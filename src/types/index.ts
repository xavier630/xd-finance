export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'HKD' | 'JPY' | 'CHF' | 'CAD' | 'AUD' | 'CNY' | 'SGD';

export interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  currency: CurrencyCode;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  peRatio: number | null;
  eps: number | null;
  dividendYield: number | null;
  week52High: number;
  week52Low: number;
  beta: number;
  sector: string;
  industry: string;
  description: string;
  ceo: string;
  employees: number;
  headquarters: string;
  founded: string;
  website: string;
}

export interface EarningsData {
  quarter: string;
  date: string;
  epsEstimate: number;
  epsActual: number;
  epsSurprise: number;
  epsSurprisePercent: number;
  revenueEstimate: number;
  revenueActual: number;
  revenueSurprise: number;
}

export interface FinancialData {
  period: string;
  revenue: number;
  operatingExpense: number;
  netIncome: number;
  netProfitMargin: number;
  earningsPerShare: number;
  ebitda: number;
  effectiveTaxRate: number;
  grossProfit?: number;
  operatingIncome?: number;
  costOfRevenue?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  imageUrl?: string;
}

export interface ChartDataPoint {
  date: string;
  timestamp?: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  sparklineData: number[];
  currency: CurrencyCode;
}

export interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
}

export type ChartTimeframe = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'MAX';

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  currency?: CurrencyCode;
}
