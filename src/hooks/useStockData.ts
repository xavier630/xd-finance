import { useState, useEffect } from 'react';
import type { Stock, ChartDataPoint, EarningsData, FinancialData } from '../types';
import type { CurrencyCode } from '../types';
import * as api from '../services/api';
import {
  stocks as mockStocks,
  getChartData as getMockChartData,
  getEarningsForStock as getMockEarnings,
  getFinancialsForStock as getMockFinancials,
} from '../data/mockData';

function mapCurrency(code: string | undefined): CurrencyCode {
  const valid: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'HKD', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'SGD'];
  if (code && valid.includes(code as CurrencyCode)) return code as CurrencyCode;
  return 'USD';
}

function mapExchange(exchange: string, fullName?: string): string {
  if (fullName) return fullName;
  const map: Record<string, string> = {
    NMS: 'NASDAQ', NGM: 'NASDAQ', NYQ: 'NYSE', HKG: 'HKSE',
    GER: 'XETRA', LSE: 'LSE', EBS: 'SIX', PAR: 'Euronext',
  };
  return map[exchange] || exchange;
}

export function useQuote(symbol: string | undefined) {
  const [stock, setStock] = useState<Stock | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .getQuote(symbol)
      .then((q) => {
        if (cancelled) return;
        const s: Stock = {
          symbol: q.symbol,
          name: q.longName || q.shortName || q.symbol,
          exchange: mapExchange(q.exchange, q.fullExchangeName),
          currency: mapCurrency(q.currency),
          price: q.regularMarketPrice,
          change: q.regularMarketChange,
          changePercent: q.regularMarketChangePercent,
          previousClose: q.regularMarketPreviousClose,
          open: q.regularMarketOpen,
          dayHigh: q.regularMarketDayHigh,
          dayLow: q.regularMarketDayLow,
          volume: q.regularMarketVolume,
          avgVolume: q.averageDailyVolume3Month || q.regularMarketVolume,
          marketCap: q.marketCap || 0,
          peRatio: q.trailingPE || 0,
          eps: q.trailingEps || 0,
          dividendYield: q.dividendYield ? q.dividendYield * 100 : 0,
          week52High: q.fiftyTwoWeekHigh,
          week52Low: q.fiftyTwoWeekLow,
          beta: 0,
          sector: '',
          industry: '',
          description: '',
          ceo: '',
          employees: 0,
          headquarters: '',
          founded: '',
          website: '',
        };
        setStock(s);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        // Fall back to mock data
        const mock = mockStocks[symbol.toUpperCase()] || mockStocks[symbol];
        if (mock) {
          setStock(mock);
          setError(null);
        } else {
          setError(err.message);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return { stock, loading, error };
}

export function useFundamentals(symbol: string | undefined) {
  const [data, setData] = useState<api.YahooFundamentals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    setLoading(true);

    api
      .getFundamentals(symbol)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return { data, loading };
}

export function useChartData(symbol: string | undefined, timeframe: string) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    setLoading(true);

    const { period1, period2, interval } = api.getChartParams(timeframe);

    api
      .getChart(symbol, period1, period2, interval)
      .then((result) => {
        if (cancelled) return;
        const points: ChartDataPoint[] = result.quotes
          .filter((q) => q.close != null)
          .map((q) => ({
            date: q.date,
            open: q.open,
            high: q.high,
            low: q.low,
            close: q.close,
            volume: q.volume,
          }));
        setData(points);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        // Fall back to mock
        const mock = getMockChartData(symbol, timeframe);
        setData(mock);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [symbol, timeframe]);

  return { data, loading };
}

export function useEarnings(symbol: string | undefined) {
  const [data, setData] = useState<EarningsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    setLoading(true);

    api
      .getFundamentals(symbol)
      .then((result) => {
        if (cancelled) return;
        const history = result.earningsHistory?.history || [];
        const quarterlyIncome = result.incomeStatementHistoryQuarterly?.incomeStatementHistory || [];

        const earnings: EarningsData[] = history.map((h, i) => {
          const qDate = new Date(h.quarter);
          const quarterNum = Math.floor(qDate.getMonth() / 3) + 1;
          const year = qDate.getFullYear();
          const quarterLabel = `Q${quarterNum} ${year}`;

          // Try to match with quarterly income for revenue
          const matchedIncome = quarterlyIncome[i];
          const revenue = matchedIncome?.totalRevenue || 0;

          return {
            quarter: quarterLabel,
            date: qDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            epsEstimate: h.epsEstimate,
            epsActual: h.epsActual,
            epsSurprise: h.epsDifference,
            epsSurprisePercent: h.surprisePercent * 100,
            revenueEstimate: revenue,
            revenueActual: revenue,
            revenueSurprise: 0,
          };
        });

        setData(earnings.length > 0 ? earnings : getMockEarnings(symbol));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setData(getMockEarnings(symbol));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return { data, loading };
}

export function useFinancials(symbol: string | undefined) {
  const [quarterly, setQuarterly] = useState<FinancialData[]>([]);
  const [annual, setAnnual] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    setLoading(true);

    api
      .getFundamentals(symbol)
      .then((result) => {
        if (cancelled) return;

        const toFinancial = (s: { endDate: string; totalRevenue: number; netIncome: number; grossProfit: number; operatingIncome: number; costOfRevenue?: number; ebit?: number }, periodLabel: string): FinancialData => {
          const opExpense = s.totalRevenue - s.operatingIncome;
          const margin = s.totalRevenue ? (s.netIncome / s.totalRevenue) * 100 : 0;
          return {
            period: periodLabel,
            revenue: s.totalRevenue,
            operatingExpense: opExpense,
            netIncome: s.netIncome,
            netProfitMargin: margin,
            earningsPerShare: 0,
            ebitda: s.ebit || s.operatingIncome,
            effectiveTaxRate: 0,
            grossProfit: s.grossProfit,
            operatingIncome: s.operatingIncome,
            costOfRevenue: s.costOfRevenue || 0,
          };
        };

        const mapStatements = (stmts: api.YahooFundamentals['incomeStatementHistory']): FinancialData[] => {
          if (!stmts?.incomeStatementHistory) return [];
          return stmts.incomeStatementHistory.map((s) => {
            const d = new Date(s.endDate);
            const quarterNum = Math.floor(d.getMonth() / 3) + 1;
            return toFinancial(s, `Q${quarterNum} ${d.getFullYear()}`);
          });
        };

        const mapAnnualStatements = (stmts: api.YahooFundamentals['incomeStatementHistory']): FinancialData[] => {
          if (!stmts?.incomeStatementHistory) return [];
          return stmts.incomeStatementHistory.map((s) => {
            const d = new Date(s.endDate);
            return toFinancial(s, `FY ${d.getFullYear()}`);
          });
        };

        const q = mapStatements(result.incomeStatementHistoryQuarterly);
        const a = mapAnnualStatements(result.incomeStatementHistory);

        setQuarterly(q.length > 0 ? q : getMockFinancials(symbol));
        setAnnual(a);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setQuarterly(getMockFinancials(symbol));
        setAnnual([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return { quarterly, annual, loading };
}

export function useCompanyInfo(symbol: string | undefined) {
  const [profile, setProfile] = useState<api.YahooAssetProfile | null>(null);
  const [beta, setBeta] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    setLoading(true);

    api
      .getFundamentals(symbol)
      .then((result) => {
        if (cancelled) return;
        setProfile(result.assetProfile || null);
        setBeta(result.defaultKeyStatistics?.beta || 0);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return { profile, beta, loading };
}
