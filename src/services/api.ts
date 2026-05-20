const API_BASE = import.meta.env.VITE_API_URL || '';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

// ---------- Types for Yahoo Finance responses ----------

export interface YahooQuote {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketPreviousClose: number;
  regularMarketOpen: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  averageDailyVolume3Month?: number;
  marketCap?: number;
  trailingPE?: number;
  trailingEps?: number;
  epsTrailingTwelveMonths?: number;
  dividendYield?: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekChangePercent?: number;
  currency?: string;
  exchange: string;
  fullExchangeName?: string;
}

export interface YahooChartResult {
  meta: {
    currency: string;
    symbol: string;
    regularMarketPrice: number;
  };
  quotes: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export interface YahooSearchQuote {
  symbol: string;
  shortname?: string;
  longname?: string;
  quoteType: string;
  exchange: string;
  exchDisp?: string;
  sector?: string;
  industry?: string;
}

export interface YahooSearchResult {
  quotes: YahooSearchQuote[];
  count: number;
}

export interface YahooEarningsHistoryEntry {
  epsActual: number;
  epsEstimate: number;
  epsDifference: number;
  surprisePercent: number;
  quarter: string;
  currency: string;
  period: string;
}

export interface YahooAssetProfile {
  longBusinessSummary?: string;
  companyOfficers?: Array<{ name: string; title: string }>;
  city?: string;
  state?: string;
  country?: string;
  fullTimeEmployees?: number;
  sector?: string;
  industry?: string;
  website?: string;
}

export interface YahooFundamentals {
  assetProfile?: YahooAssetProfile;
  earningsHistory?: {
    history: YahooEarningsHistoryEntry[];
  };
  incomeStatementHistory?: {
    incomeStatementHistory: Array<{
      endDate: string;
      totalRevenue: number;
      netIncome: number;
      grossProfit: number;
      operatingIncome: number;
      ebit?: number;
      costOfRevenue?: number;
    }>;
  };
  incomeStatementHistoryQuarterly?: {
    incomeStatementHistory: Array<{
      endDate: string;
      totalRevenue: number;
      netIncome: number;
      grossProfit: number;
      operatingIncome: number;
      ebit?: number;
      costOfRevenue?: number;
    }>;
  };
  defaultKeyStatistics?: {
    beta?: number;
    trailingEps?: number;
    forwardEps?: number;
    priceToBook?: number;
    enterpriseValue?: number;
  };
  financialData?: {
    currentPrice?: number;
    targetMeanPrice?: number;
    revenueGrowth?: number;
    grossMargins?: number;
    operatingMargins?: number;
    profitMargins?: number;
  };
}

// ---------- API functions ----------

export async function getQuote(symbol: string): Promise<YahooQuote> {
  return fetchJson<YahooQuote>(`${API_BASE}/api/quote/${encodeURIComponent(symbol)}`);
}

export async function getQuotes(symbols: string[]): Promise<Record<string, YahooQuote>> {
  return fetchJson<Record<string, YahooQuote>>(
    `${API_BASE}/api/quotes?symbols=${symbols.map(encodeURIComponent).join(',')}`
  );
}

export async function getChart(
  symbol: string,
  period1: string,
  period2: string,
  interval: string
): Promise<YahooChartResult> {
  const params = new URLSearchParams({ period1, period2, interval });
  return fetchJson<YahooChartResult>(
    `${API_BASE}/api/chart/${encodeURIComponent(symbol)}?${params}`
  );
}

export async function getFundamentals(symbol: string): Promise<YahooFundamentals> {
  return fetchJson<YahooFundamentals>(
    `${API_BASE}/api/fundamentals/${encodeURIComponent(symbol)}`
  );
}

export async function searchSymbols(query: string): Promise<YahooSearchResult> {
  return fetchJson<YahooSearchResult>(
    `${API_BASE}/api/search?q=${encodeURIComponent(query)}`
  );
}

export async function getMarketIndices(): Promise<YahooQuote[]> {
  return fetchJson<YahooQuote[]>(`${API_BASE}/api/market-indices`);
}

// ---------- Timeframe helpers ----------

export function getChartParams(timeframe: string): { period1: string; period2: string; interval: string } {
  const now = new Date();
  const period2 = now.toISOString().split('T')[0];
  let period1Date: Date;
  let interval: string;

  switch (timeframe) {
    case '1D':
      period1Date = new Date(now);
      period1Date.setDate(period1Date.getDate() - 1);
      interval = '5m';
      break;
    case '5D':
      period1Date = new Date(now);
      period1Date.setDate(period1Date.getDate() - 5);
      interval = '15m';
      break;
    case '1M':
      period1Date = new Date(now);
      period1Date.setMonth(period1Date.getMonth() - 1);
      interval = '1d';
      break;
    case '6M':
      period1Date = new Date(now);
      period1Date.setMonth(period1Date.getMonth() - 6);
      interval = '1d';
      break;
    case 'YTD':
      period1Date = new Date(now.getFullYear(), 0, 1);
      interval = '1d';
      break;
    case '1Y':
      period1Date = new Date(now);
      period1Date.setFullYear(period1Date.getFullYear() - 1);
      interval = '1d';
      break;
    case '5Y':
      period1Date = new Date(now);
      period1Date.setFullYear(period1Date.getFullYear() - 5);
      interval = '1wk';
      break;
    case 'MAX':
      period1Date = new Date(now);
      period1Date.setFullYear(period1Date.getFullYear() - 20);
      interval = '1mo';
      break;
    default:
      period1Date = new Date(now);
      period1Date.setFullYear(period1Date.getFullYear() - 1);
      interval = '1d';
  }

  return {
    period1: period1Date.toISOString().split('T')[0],
    period2,
    interval,
  };
}
