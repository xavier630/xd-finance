import express from 'express';
import cors from 'cors';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simple in-memory cache
const cache = new Map<string, { data: unknown; expires: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.data as T;
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown, ttlMs: number): void {
  cache.set(key, { data, expires: Date.now() + ttlMs });
}

const QUOTE_TTL = 5 * 60 * 1000;        // 5 minutes
const CHART_TTL = 10 * 60 * 1000;       // 10 minutes
const FUNDAMENTALS_TTL = 60 * 60 * 1000; // 1 hour
const SEARCH_TTL = 30 * 60 * 1000;      // 30 minutes

// GET /api/quote/:symbol
app.get('/api/quote/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const cacheKey = `quote:${symbol}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const result = await yahooFinance.quote(symbol);
    setCache(cacheKey, result, QUOTE_TTL);
    res.json(result);
  } catch (err) {
    console.error(`Quote error for ${symbol}:`, err);
    res.status(500).json({ error: `Failed to fetch quote for ${symbol}` });
  }
});

// GET /api/quotes?symbols=AAPL,GOOGL,MSFT
app.get('/api/quotes', async (req, res) => {
  const symbols = (req.query.symbols as string || '').split(',').filter(Boolean);
  if (symbols.length === 0) return res.status(400).json({ error: 'No symbols provided' });

  try {
    const results = await Promise.allSettled(
      symbols.map(async (symbol) => {
        const cacheKey = `quote:${symbol}`;
        const cached = getCached(cacheKey);
        if (cached) return cached;
        const result = await yahooFinance.quote(symbol);
        setCache(cacheKey, result, QUOTE_TTL);
        return result;
      })
    );

    const data: Record<string, unknown> = {};
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        data[symbols[i]] = result.value;
      }
    });
    res.json(data);
  } catch (err) {
    console.error('Quotes error:', err);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// GET /api/chart/:symbol?period=1y&interval=1d
app.get('/api/chart/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const period1 = req.query.period1 as string | undefined;
  const period2 = req.query.period2 as string | undefined;
  const interval = (req.query.interval as string) || '1d';

  const cacheKey = `chart:${symbol}:${period1}:${period2}:${interval}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const queryOptions: Record<string, unknown> = { interval };
    if (period1) queryOptions.period1 = period1;
    if (period2) queryOptions.period2 = period2;

    const result = await yahooFinance.chart(symbol, queryOptions as Parameters<typeof yahooFinance.chart>[1]);
    setCache(cacheKey, result, CHART_TTL);
    res.json(result);
  } catch (err) {
    console.error(`Chart error for ${symbol}:`, err);
    res.status(500).json({ error: `Failed to fetch chart for ${symbol}` });
  }
});

// GET /api/fundamentals/:symbol
app.get('/api/fundamentals/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const cacheKey = `fundamentals:${symbol}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const result = await yahooFinance.quoteSummary(symbol, {
      modules: [
        'assetProfile',
        'earningsHistory',
        'earningsTrend',
        'incomeStatementHistory',
        'incomeStatementHistoryQuarterly',
        'balanceSheetHistory',
        'balanceSheetHistoryQuarterly',
        'cashflowStatementHistory',
        'cashflowStatementHistoryQuarterly',
        'defaultKeyStatistics',
        'financialData',
      ],
    });
    setCache(cacheKey, result, FUNDAMENTALS_TTL);
    res.json(result);
  } catch (err) {
    console.error(`Fundamentals error for ${symbol}:`, err);
    res.status(500).json({ error: `Failed to fetch fundamentals for ${symbol}` });
  }
});

// GET /api/earnings/:symbol - returns up to 10 years of quarterly earnings
app.get('/api/earnings/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const cacheKey = `earnings:${symbol}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const result = await yahooFinance.quoteSummary(symbol, {
      modules: ['earningsHistory', 'earnings'],
    });
    setCache(cacheKey, result, FUNDAMENTALS_TTL);
    res.json(result);
  } catch (err) {
    console.error(`Earnings error for ${symbol}:`, err);
    res.status(500).json({ error: `Failed to fetch earnings for ${symbol}` });
  }
});

// GET /api/earnings-history/:symbol - Alpha Vantage deep earnings (10+ years, US stocks)
app.get('/api/earnings-history/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const cacheKey = `av-earnings:${symbol}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  const AV_KEY = process.env.ALPHA_VANTAGE_KEY;
  if (!AV_KEY) {
    return res.status(503).json({ error: 'ALPHA_VANTAGE_KEY not configured' });
  }
  try {
    const url = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${encodeURIComponent(symbol)}&apikey=${AV_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data['Note'] || data['Information']) {
      return res.status(429).json({ error: 'Alpha Vantage rate limit reached' });
    }
    setCache(cacheKey, data, FUNDAMENTALS_TTL);
    res.json(data);
  } catch (err) {
    console.error(`Alpha Vantage earnings error for ${symbol}:`, err);
    res.status(500).json({ error: `Failed to fetch earnings history for ${symbol}` });
  }
});

// GET /api/search?q=apple
app.get('/api/search', async (req, res) => {
  const query = req.query.q as string;
  if (!query) return res.status(400).json({ error: 'No query provided' });

  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const result = await yahooFinance.search(query);
    setCache(cacheKey, result, SEARCH_TTL);
    res.json(result);
  } catch (err) {
    console.error(`Search error for ${query}:`, err);
    res.status(500).json({ error: `Failed to search for ${query}` });
  }
});

// GET /api/market-indices
app.get('/api/market-indices', async (_req, res) => {
  const cacheKey = 'market-indices';
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const symbols = ['^DJI', '^GSPC', '^IXIC', '^RUT', '^VIX'];
    const results = await Promise.allSettled(
      symbols.map((s) => yahooFinance.quote(s))
    );

    const indices = results
      .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof yahooFinance.quote>>> => r.status === 'fulfilled')
      .map((r) => r.value);

    setCache(cacheKey, indices, QUOTE_TTL);
    res.json(indices);
  } catch (err) {
    console.error('Market indices error:', err);
    res.status(500).json({ error: 'Failed to fetch market indices' });
  }
});

app.listen(PORT, () => {
  console.log(`Yahoo Finance proxy running on http://localhost:${PORT}`);
});
