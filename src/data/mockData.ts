import type {
  Stock,
  EarningsData,
  FinancialData,
  NewsItem,
  ChartDataPoint,
  Watchlist,
  MarketIndex,
} from '../types';

export const marketIndices: MarketIndex[] = [
  { symbol: '.DJI', name: 'Dow Jones', value: 42856.12, change: 159.95, changePercent: 0.37 },
  { symbol: '.INX', name: 'S&P 500', value: 5948.71, change: -5.45, changePercent: -0.09 },
  { symbol: '.IXIC', name: 'Nasdaq', value: 19843.77, change: -134.41, changePercent: -0.67 },
  { symbol: 'RUT', name: 'Russell 2000', value: 2075.10, change: -18.20, changePercent: -0.87 },
  { symbol: 'VIX', name: 'VIX', value: 17.82, change: -0.61, changePercent: -3.31 },
];

export const stocks: Record<string, Stock> = {
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc Class A',
    exchange: 'NASDAQ',
    price: 176.49,
    change: 2.13,
    changePercent: 1.22,
    previousClose: 174.36,
    open: 174.80,
    dayHigh: 177.12,
    dayLow: 174.25,
    volume: 28456300,
    avgVolume: 25891000,
    marketCap: 2180000000000,
    peRatio: 23.45,
    eps: 7.53,
    dividendYield: 0.46,
    week52High: 191.75,
    week52Low: 130.67,
    beta: 1.06,
    sector: 'Technology',
    industry: 'Internet Content & Information',
    description:
      'Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments. The Google Services segment provides products and services, including ads, Android, Chrome, devices, Gmail, Google Drive, Google Maps, Google Photos, Google Play, Search, and YouTube.',
    ceo: 'Sundar Pichai',
    employees: 182502,
    headquarters: 'Mountain View, California',
    founded: '1998',
    website: 'https://abc.xyz',
  },
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc',
    exchange: 'NASDAQ',
    price: 214.29,
    change: -2.38,
    changePercent: -1.10,
    previousClose: 216.67,
    open: 216.10,
    dayHigh: 217.05,
    dayLow: 213.44,
    volume: 54329100,
    avgVolume: 48210000,
    marketCap: 3290000000000,
    peRatio: 33.48,
    eps: 6.40,
    dividendYield: 0.48,
    week52High: 237.49,
    week52Low: 164.08,
    beta: 1.24,
    sector: 'Technology',
    industry: 'Consumer Electronics',
    description:
      'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and Wearables, Home and Accessories products. It also provides AppleCare support and cloud services, and operates various platforms including the App Store.',
    ceo: 'Tim Cook',
    employees: 161000,
    headquarters: 'Cupertino, California',
    founded: '1976',
    website: 'https://apple.com',
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corp',
    exchange: 'NASDAQ',
    price: 446.34,
    change: 1.98,
    changePercent: 0.45,
    previousClose: 444.36,
    open: 444.50,
    dayHigh: 448.12,
    dayLow: 443.80,
    volume: 18923400,
    avgVolume: 20145000,
    marketCap: 3320000000000,
    peRatio: 37.19,
    eps: 12.00,
    dividendYield: 0.72,
    week52High: 468.35,
    week52Low: 385.58,
    beta: 0.89,
    sector: 'Technology',
    industry: 'Software - Infrastructure',
    description:
      'Microsoft Corporation develops and supports software, services, devices, and solutions worldwide. The company operates through Intelligent Cloud, Productivity and Business Processes, and More Personal Computing segments.',
    ceo: 'Satya Nadella',
    employees: 228000,
    headquarters: 'Redmond, Washington',
    founded: '1975',
    website: 'https://microsoft.com',
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com Inc',
    exchange: 'NASDAQ',
    price: 182.81,
    change: -1.25,
    changePercent: -0.68,
    previousClose: 184.06,
    open: 183.90,
    dayHigh: 185.20,
    dayLow: 181.95,
    volume: 43218700,
    avgVolume: 39876000,
    marketCap: 1910000000000,
    peRatio: 42.52,
    eps: 4.30,
    dividendYield: null,
    week52High: 201.20,
    week52Low: 151.61,
    beta: 1.16,
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    description:
      'Amazon.com, Inc. engages in the retail sale of consumer products, advertising, and subscription services through online and physical stores in North America and internationally. The company operates through three segments: North America, International, and Amazon Web Services (AWS).',
    ceo: 'Andy Jassy',
    employees: 1525000,
    headquarters: 'Seattle, Washington',
    founded: '1994',
    website: 'https://amazon.com',
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    exchange: 'NASDAQ',
    price: 135.58,
    change: -4.93,
    changePercent: -3.51,
    previousClose: 140.51,
    open: 139.80,
    dayHigh: 140.25,
    dayLow: 134.20,
    volume: 312456000,
    avgVolume: 245678000,
    marketCap: 3340000000000,
    peRatio: 64.56,
    eps: 2.10,
    dividendYield: 0.03,
    week52High: 153.13,
    week52Low: 75.61,
    beta: 1.67,
    sector: 'Technology',
    industry: 'Semiconductors',
    description:
      'NVIDIA Corporation provides graphics and compute and networking solutions in the United States, Taiwan, China, Hong Kong, and internationally. The company operates through two segments: Graphics and Compute & Networking.',
    ceo: 'Jensen Huang',
    employees: 29600,
    headquarters: 'Santa Clara, California',
    founded: '1993',
    website: 'https://nvidia.com',
  },
  META: {
    symbol: 'META',
    name: 'Meta Platforms Inc',
    exchange: 'NASDAQ',
    price: 499.49,
    change: 7.12,
    changePercent: 1.45,
    previousClose: 492.37,
    open: 493.00,
    dayHigh: 501.25,
    dayLow: 491.80,
    volume: 15678900,
    avgVolume: 17234000,
    marketCap: 1280000000000,
    peRatio: 25.87,
    eps: 19.31,
    dividendYield: 0.36,
    week52High: 544.20,
    week52Low: 390.42,
    beta: 1.22,
    sector: 'Technology',
    industry: 'Internet Content & Information',
    description:
      'Meta Platforms, Inc. engages in the development of products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables worldwide.',
    ceo: 'Mark Zuckerberg',
    employees: 67317,
    headquarters: 'Menlo Park, California',
    founded: '2004',
    website: 'https://meta.com',
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    exchange: 'NASDAQ',
    price: 184.86,
    change: -2.59,
    changePercent: -1.38,
    previousClose: 187.45,
    open: 186.90,
    dayHigh: 188.30,
    dayLow: 183.50,
    volume: 87654300,
    avgVolume: 78912000,
    marketCap: 590000000000,
    peRatio: 52.81,
    eps: 3.50,
    dividendYield: null,
    week52High: 271.00,
    week52Low: 138.80,
    beta: 2.31,
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    description:
      'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.',
    ceo: 'Elon Musk',
    employees: 140473,
    headquarters: 'Austin, Texas',
    founded: '2003',
    website: 'https://tesla.com',
  },
  JPM: {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co',
    exchange: 'NYSE',
    price: 205.42,
    change: 3.18,
    changePercent: 1.57,
    previousClose: 202.24,
    open: 202.80,
    dayHigh: 206.15,
    dayLow: 202.10,
    volume: 8934200,
    avgVolume: 9123000,
    marketCap: 592000000000,
    peRatio: 12.18,
    eps: 16.87,
    dividendYield: 2.14,
    week52High: 215.80,
    week52Low: 172.30,
    beta: 1.12,
    sector: 'Financial Services',
    industry: 'Banks - Diversified',
    description:
      'JPMorgan Chase & Co. operates as a financial services company worldwide. It operates through four segments: Consumer & Community Banking, Corporate & Investment Bank, Commercial Banking, and Asset & Wealth Management.',
    ceo: 'Jamie Dimon',
    employees: 309926,
    headquarters: 'New York, New York',
    founded: '1799',
    website: 'https://jpmorganchase.com',
  },
  JNJ: {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    exchange: 'NYSE',
    price: 156.78,
    change: 0.42,
    changePercent: 0.27,
    previousClose: 156.36,
    open: 156.50,
    dayHigh: 157.30,
    dayLow: 155.80,
    volume: 6234500,
    avgVolume: 7012000,
    marketCap: 378000000000,
    peRatio: 24.12,
    eps: 6.50,
    dividendYield: 3.12,
    week52High: 168.85,
    week52Low: 143.50,
    beta: 0.54,
    sector: 'Healthcare',
    industry: 'Drug Manufacturers - General',
    description:
      'Johnson & Johnson researches, develops, manufactures, and sells various products in the healthcare field worldwide. The company operates through Innovative Medicine and MedTech segments.',
    ceo: 'Joaquin Duato',
    employees: 131900,
    headquarters: 'New Brunswick, New Jersey',
    founded: '1886',
    website: 'https://jnj.com',
  },
  V: {
    symbol: 'V',
    name: 'Visa Inc',
    exchange: 'NYSE',
    price: 282.15,
    change: 1.87,
    changePercent: 0.67,
    previousClose: 280.28,
    open: 280.50,
    dayHigh: 283.40,
    dayLow: 279.90,
    volume: 5678900,
    avgVolume: 6234000,
    marketCap: 570000000000,
    peRatio: 31.35,
    eps: 9.00,
    dividendYield: 0.74,
    week52High: 296.50,
    week52Low: 252.70,
    beta: 0.96,
    sector: 'Financial Services',
    industry: 'Credit Services',
    description:
      'Visa Inc. operates as a payments technology company worldwide. The company operates VisaNet, a transaction processing network that enables authorization, clearing, and settlement of payment transactions.',
    ceo: 'Ryan McInerney',
    employees: 26500,
    headquarters: 'San Francisco, California',
    founded: '1958',
    website: 'https://visa.com',
  },
};

function generateSparkline(base: number, volatility: number): number[] {
  const points: number[] = [];
  let current = base;
  for (let i = 0; i < 30; i++) {
    current += (Math.random() - 0.5) * volatility;
    points.push(Math.round(current * 100) / 100);
  }
  return points;
}

export const watchlists: Watchlist[] = [
  {
    id: 'main',
    name: 'My Watchlist',
    items: [
      { symbol: 'GOOGL', name: 'Alphabet Inc Class A', price: 176.49, change: 2.13, changePercent: 1.22, marketCap: 2180000000000, volume: 28456300, sparklineData: generateSparkline(174, 3) },
      { symbol: 'AAPL', name: 'Apple Inc', price: 214.29, change: -2.38, changePercent: -1.10, marketCap: 3290000000000, volume: 54329100, sparklineData: generateSparkline(215, 4) },
      { symbol: 'MSFT', name: 'Microsoft Corp', price: 446.34, change: 1.98, changePercent: 0.45, marketCap: 3320000000000, volume: 18923400, sparklineData: generateSparkline(444, 5) },
      { symbol: 'AMZN', name: 'Amazon.com Inc', price: 182.81, change: -1.25, changePercent: -0.68, marketCap: 1910000000000, volume: 43218700, sparklineData: generateSparkline(183, 3) },
      { symbol: 'NVDA', name: 'NVIDIA Corp', price: 135.58, change: -4.93, changePercent: -3.51, marketCap: 3340000000000, volume: 312456000, sparklineData: generateSparkline(138, 6) },
      { symbol: 'META', name: 'Meta Platforms Inc', price: 499.49, change: 7.12, changePercent: 1.45, marketCap: 1280000000000, volume: 15678900, sparklineData: generateSparkline(495, 8) },
      { symbol: 'TSLA', name: 'Tesla Inc', price: 184.86, change: -2.59, changePercent: -1.38, marketCap: 590000000000, volume: 87654300, sparklineData: generateSparkline(186, 5) },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co', price: 205.42, change: 3.18, changePercent: 1.57, marketCap: 592000000000, volume: 8934200, sparklineData: generateSparkline(203, 3) },
      { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.78, change: 0.42, changePercent: 0.27, marketCap: 378000000000, volume: 6234500, sparklineData: generateSparkline(156, 2) },
      { symbol: 'V', name: 'Visa Inc', price: 282.15, change: 1.87, changePercent: 0.67, marketCap: 570000000000, volume: 5678900, sparklineData: generateSparkline(281, 4) },
    ],
  },
  {
    id: 'tech',
    name: 'Tech Giants',
    items: [
      { symbol: 'GOOGL', name: 'Alphabet Inc Class A', price: 176.49, change: 2.13, changePercent: 1.22, marketCap: 2180000000000, volume: 28456300, sparklineData: generateSparkline(174, 3) },
      { symbol: 'AAPL', name: 'Apple Inc', price: 214.29, change: -2.38, changePercent: -1.10, marketCap: 3290000000000, volume: 54329100, sparklineData: generateSparkline(215, 4) },
      { symbol: 'MSFT', name: 'Microsoft Corp', price: 446.34, change: 1.98, changePercent: 0.45, marketCap: 3320000000000, volume: 18923400, sparklineData: generateSparkline(444, 5) },
      { symbol: 'NVDA', name: 'NVIDIA Corp', price: 135.58, change: -4.93, changePercent: -3.51, marketCap: 3340000000000, volume: 312456000, sparklineData: generateSparkline(138, 6) },
      { symbol: 'META', name: 'Meta Platforms Inc', price: 499.49, change: 7.12, changePercent: 1.45, marketCap: 1280000000000, volume: 15678900, sparklineData: generateSparkline(495, 8) },
    ],
  },
];

export const earningsData: Record<string, EarningsData[]> = {
  GOOGL: [
    { quarter: 'Q4 2024', date: 'Feb 4, 2025', epsEstimate: 2.12, epsActual: 2.15, epsSurprise: 0.03, epsSurprisePercent: 1.42, revenueEstimate: 96800000000, revenueActual: 96469000000, revenueSurprise: -331000000 },
    { quarter: 'Q3 2024', date: 'Oct 29, 2024', epsEstimate: 1.84, epsActual: 2.12, epsSurprise: 0.28, epsSurprisePercent: 15.22, revenueEstimate: 86300000000, revenueActual: 88268000000, revenueSurprise: 1968000000 },
    { quarter: 'Q2 2024', date: 'Jul 23, 2024', epsEstimate: 1.84, epsActual: 1.89, epsSurprise: 0.05, epsSurprisePercent: 2.72, revenueEstimate: 84190000000, revenueActual: 84742000000, revenueSurprise: 552000000 },
    { quarter: 'Q1 2024', date: 'Apr 25, 2024', epsEstimate: 1.51, epsActual: 1.89, epsSurprise: 0.38, epsSurprisePercent: 25.17, revenueEstimate: 78590000000, revenueActual: 80539000000, revenueSurprise: 1949000000 },
    { quarter: 'Q4 2023', date: 'Jan 30, 2024', epsEstimate: 1.59, epsActual: 1.64, epsSurprise: 0.05, epsSurprisePercent: 3.14, revenueEstimate: 85330000000, revenueActual: 86310000000, revenueSurprise: 980000000 },
    { quarter: 'Q3 2023', date: 'Oct 24, 2023', epsEstimate: 1.45, epsActual: 1.55, epsSurprise: 0.10, epsSurprisePercent: 6.90, revenueEstimate: 75550000000, revenueActual: 76693000000, revenueSurprise: 1143000000 },
    { quarter: 'Q2 2023', date: 'Jul 25, 2023', epsEstimate: 1.34, epsActual: 1.44, epsSurprise: 0.10, epsSurprisePercent: 7.46, revenueEstimate: 72770000000, revenueActual: 74604000000, revenueSurprise: 1834000000 },
    { quarter: 'Q1 2023', date: 'Apr 25, 2023', epsEstimate: 1.08, epsActual: 1.17, epsSurprise: 0.09, epsSurprisePercent: 8.33, revenueEstimate: 68860000000, revenueActual: 69787000000, revenueSurprise: 927000000 },
  ],
  AAPL: [
    { quarter: 'Q1 FY2025', date: 'Jan 30, 2025', epsEstimate: 2.35, epsActual: 2.40, epsSurprise: 0.05, epsSurprisePercent: 2.13, revenueEstimate: 124100000000, revenueActual: 124300000000, revenueSurprise: 200000000 },
    { quarter: 'Q4 FY2024', date: 'Oct 31, 2024', epsEstimate: 1.60, epsActual: 1.64, epsSurprise: 0.04, epsSurprisePercent: 2.50, revenueEstimate: 94350000000, revenueActual: 94930000000, revenueSurprise: 580000000 },
    { quarter: 'Q3 FY2024', date: 'Aug 1, 2024', epsEstimate: 1.35, epsActual: 1.40, epsSurprise: 0.05, epsSurprisePercent: 3.70, revenueEstimate: 84410000000, revenueActual: 85777000000, revenueSurprise: 1367000000 },
    { quarter: 'Q2 FY2024', date: 'May 2, 2024', epsEstimate: 1.50, epsActual: 1.53, epsSurprise: 0.03, epsSurprisePercent: 2.00, revenueEstimate: 90010000000, revenueActual: 90754000000, revenueSurprise: 744000000 },
    { quarter: 'Q1 FY2024', date: 'Feb 1, 2024', epsEstimate: 2.10, epsActual: 2.18, epsSurprise: 0.08, epsSurprisePercent: 3.81, revenueEstimate: 117900000000, revenueActual: 119575000000, revenueSurprise: 1675000000 },
    { quarter: 'Q4 FY2023', date: 'Nov 2, 2023', epsEstimate: 1.39, epsActual: 1.46, epsSurprise: 0.07, epsSurprisePercent: 5.04, revenueEstimate: 89300000000, revenueActual: 89498000000, revenueSurprise: 198000000 },
    { quarter: 'Q3 FY2023', date: 'Aug 3, 2023', epsEstimate: 1.19, epsActual: 1.26, epsSurprise: 0.07, epsSurprisePercent: 5.88, revenueEstimate: 81730000000, revenueActual: 81797000000, revenueSurprise: 67000000 },
    { quarter: 'Q2 FY2023', date: 'May 4, 2023', epsEstimate: 1.43, epsActual: 1.52, epsSurprise: 0.09, epsSurprisePercent: 6.29, revenueEstimate: 92950000000, revenueActual: 94836000000, revenueSurprise: 1886000000 },
  ],
  NVDA: [
    { quarter: 'Q4 FY2025', date: 'Feb 26, 2025', epsEstimate: 0.84, epsActual: 0.89, epsSurprise: 0.05, epsSurprisePercent: 5.95, revenueEstimate: 38000000000, revenueActual: 39331000000, revenueSurprise: 1331000000 },
    { quarter: 'Q3 FY2025', date: 'Nov 20, 2024', epsEstimate: 0.74, epsActual: 0.81, epsSurprise: 0.07, epsSurprisePercent: 9.46, revenueEstimate: 33090000000, revenueActual: 35082000000, revenueSurprise: 1992000000 },
    { quarter: 'Q2 FY2025', date: 'Aug 28, 2024', epsEstimate: 0.64, epsActual: 0.68, epsSurprise: 0.04, epsSurprisePercent: 6.25, revenueEstimate: 28540000000, revenueActual: 30040000000, revenueSurprise: 1500000000 },
    { quarter: 'Q1 FY2025', date: 'May 22, 2024', epsEstimate: 0.55, epsActual: 0.61, epsSurprise: 0.06, epsSurprisePercent: 10.91, revenueEstimate: 24560000000, revenueActual: 26044000000, revenueSurprise: 1484000000 },
    { quarter: 'Q4 FY2024', date: 'Feb 21, 2024', epsEstimate: 0.47, epsActual: 0.52, epsSurprise: 0.05, epsSurprisePercent: 10.64, revenueEstimate: 20370000000, revenueActual: 22103000000, revenueSurprise: 1733000000 },
    { quarter: 'Q3 FY2024', date: 'Nov 21, 2023', epsEstimate: 0.34, epsActual: 0.40, epsSurprise: 0.06, epsSurprisePercent: 17.65, revenueEstimate: 16070000000, revenueActual: 18120000000, revenueSurprise: 2050000000 },
    { quarter: 'Q2 FY2024', date: 'Aug 23, 2023', epsEstimate: 0.21, epsActual: 0.27, epsSurprise: 0.06, epsSurprisePercent: 28.57, revenueEstimate: 11040000000, revenueActual: 13507000000, revenueSurprise: 2467000000 },
    { quarter: 'Q1 FY2024', date: 'May 24, 2023', epsEstimate: 0.09, epsActual: 0.11, epsSurprise: 0.02, epsSurprisePercent: 22.22, revenueEstimate: 6500000000, revenueActual: 7192000000, revenueSurprise: 692000000 },
  ],
};

export const financialData: Record<string, FinancialData[]> = {
  GOOGL: [
    { period: 'Q4 2024', revenue: 96469000000, operatingExpense: 62300000000, netIncome: 26540000000, netProfitMargin: 27.51, earningsPerShare: 2.15, ebitda: 38420000000, effectiveTaxRate: 11.8 },
    { period: 'Q3 2024', revenue: 88268000000, operatingExpense: 56120000000, netIncome: 26301000000, netProfitMargin: 29.80, earningsPerShare: 2.12, ebitda: 36890000000, effectiveTaxRate: 8.9 },
    { period: 'Q2 2024', revenue: 84742000000, operatingExpense: 54890000000, netIncome: 23619000000, netProfitMargin: 27.87, earningsPerShare: 1.89, ebitda: 33280000000, effectiveTaxRate: 10.5 },
    { period: 'Q1 2024', revenue: 80539000000, operatingExpense: 51340000000, netIncome: 23662000000, netProfitMargin: 29.38, earningsPerShare: 1.89, ebitda: 32650000000, effectiveTaxRate: 7.1 },
    { period: 'Annual 2024', revenue: 350018000000, operatingExpense: 224650000000, netIncome: 100122000000, netProfitMargin: 28.61, earningsPerShare: 8.05, ebitda: 141240000000, effectiveTaxRate: 9.6 },
    { period: 'Annual 2023', revenue: 307394000000, operatingExpense: 207810000000, netIncome: 73795000000, netProfitMargin: 24.01, earningsPerShare: 5.80, ebitda: 108290000000, effectiveTaxRate: 13.3 },
  ],
  AAPL: [
    { period: 'Q1 FY2025', revenue: 124300000000, operatingExpense: 98210000000, netIncome: 36330000000, netProfitMargin: 29.23, earningsPerShare: 2.40, ebitda: 44120000000, effectiveTaxRate: 16.2 },
    { period: 'Q4 FY2024', revenue: 94930000000, operatingExpense: 74560000000, netIncome: 24780000000, netProfitMargin: 26.10, earningsPerShare: 1.64, ebitda: 33650000000, effectiveTaxRate: 14.8 },
    { period: 'Q3 FY2024', revenue: 85777000000, operatingExpense: 67230000000, netIncome: 21448000000, netProfitMargin: 25.01, earningsPerShare: 1.40, ebitda: 30120000000, effectiveTaxRate: 15.1 },
    { period: 'Q2 FY2024', revenue: 90754000000, operatingExpense: 71890000000, netIncome: 23636000000, netProfitMargin: 26.04, earningsPerShare: 1.53, ebitda: 32450000000, effectiveTaxRate: 15.5 },
  ],
};

function generateChartData(basePrice: number, days: number, volatility: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let price = basePrice * (1 - volatility * days * 0.001);
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dailyChange = (Math.random() - 0.48) * volatility;
    price += dailyChange;
    const open = price - (Math.random() - 0.5) * volatility * 0.5;
    const high = Math.max(price, open) + Math.random() * volatility * 0.3;
    const low = Math.min(price, open) - Math.random() * volatility * 0.3;
    const volume = Math.floor(20000000 + Math.random() * 30000000);

    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(price * 100) / 100,
      volume,
    });
  }
  return data;
}

export const chartData: Record<string, Record<string, ChartDataPoint[]>> = {
  GOOGL: {
    '1D': generateChartData(176.49, 1, 2),
    '5D': generateChartData(176.49, 5, 2),
    '1M': generateChartData(176.49, 30, 3),
    '6M': generateChartData(176.49, 180, 3),
    'YTD': generateChartData(176.49, 140, 3),
    '1Y': generateChartData(176.49, 365, 4),
    '5Y': generateChartData(176.49, 1825, 5),
    MAX: generateChartData(176.49, 3650, 6),
  },
  AAPL: {
    '1D': generateChartData(214.29, 1, 3),
    '5D': generateChartData(214.29, 5, 3),
    '1M': generateChartData(214.29, 30, 4),
    '6M': generateChartData(214.29, 180, 4),
    'YTD': generateChartData(214.29, 140, 4),
    '1Y': generateChartData(214.29, 365, 5),
    '5Y': generateChartData(214.29, 1825, 6),
    MAX: generateChartData(214.29, 3650, 7),
  },
};

function getChartDataForSymbol(symbol: string): Record<string, ChartDataPoint[]> {
  if (chartData[symbol]) return chartData[symbol];
  const stock = stocks[symbol];
  if (!stock) return {};
  const price = stock.price;
  return {
    '1D': generateChartData(price, 1, price * 0.01),
    '5D': generateChartData(price, 5, price * 0.01),
    '1M': generateChartData(price, 30, price * 0.015),
    '6M': generateChartData(price, 180, price * 0.015),
    'YTD': generateChartData(price, 140, price * 0.015),
    '1Y': generateChartData(price, 365, price * 0.02),
    '5Y': generateChartData(price, 1825, price * 0.025),
    MAX: generateChartData(price, 3650, price * 0.03),
  };
}

export function getChartData(symbol: string, timeframe: string): ChartDataPoint[] {
  const data = getChartDataForSymbol(symbol);
  return data[timeframe] || [];
}

export const newsData: Record<string, NewsItem[]> = {
  GOOGL: [
    { id: '1', title: 'Alphabet Reports Strong Q4 Earnings, Cloud Revenue Surges', source: 'Reuters', url: '#', publishedAt: '2 hours ago', summary: 'Alphabet Inc. reported fourth-quarter earnings that exceeded analyst expectations, driven by strong growth in its cloud computing division and sustained advertising revenue.' },
    { id: '2', title: 'Google AI Integration Drives Search Revenue Growth', source: 'Bloomberg', url: '#', publishedAt: '5 hours ago', summary: 'Google\'s integration of AI-powered features into its search engine is driving increased engagement and advertising revenue, according to internal metrics shared during the earnings call.' },
    { id: '3', title: 'Waymo Expansion Plans Signal Alphabet\'s Autonomous Vehicle Ambitions', source: 'TechCrunch', url: '#', publishedAt: '8 hours ago', summary: 'Alphabet\'s autonomous vehicle subsidiary Waymo announced plans to expand its robotaxi service to five new cities by the end of the year.' },
    { id: '4', title: 'Analysts Raise Price Targets for Alphabet Following Earnings Beat', source: 'MarketWatch', url: '#', publishedAt: '1 day ago', summary: 'Multiple Wall Street analysts have raised their price targets for Alphabet stock following the company\'s better-than-expected quarterly results.' },
    { id: '5', title: 'YouTube Premium Subscribers Cross 100 Million Milestone', source: 'The Verge', url: '#', publishedAt: '1 day ago', summary: 'YouTube\'s premium subscription service has crossed 100 million paying subscribers globally, a significant milestone for Alphabet\'s subscription business.' },
  ],
  AAPL: [
    { id: '1', title: 'Apple Vision Pro 2 Expected to Launch in 2025', source: 'Bloomberg', url: '#', publishedAt: '3 hours ago', summary: 'Apple is reportedly working on a second-generation Vision Pro headset with improved displays and a lower price point.' },
    { id: '2', title: 'Apple Services Revenue Hits All-Time High', source: 'CNBC', url: '#', publishedAt: '6 hours ago', summary: 'Apple\'s services segment, including the App Store, Apple Music, and iCloud, reached a new quarterly revenue record.' },
    { id: '3', title: 'iPhone 17 Lineup Rumors: Major Camera Upgrades Expected', source: 'MacRumors', url: '#', publishedAt: '1 day ago', summary: 'Upcoming iPhone 17 models are expected to feature significant camera improvements and a new design language.' },
  ],
  NVDA: [
    { id: '1', title: 'NVIDIA Blackwell GPUs See Unprecedented Demand', source: 'Reuters', url: '#', publishedAt: '1 hour ago', summary: 'NVIDIA\'s latest Blackwell architecture GPUs are seeing demand that far outstrips supply, with major cloud providers ordering billions of dollars worth of chips.' },
    { id: '2', title: 'NVIDIA Partners with Healthcare Companies for AI Drug Discovery', source: 'Bloomberg', url: '#', publishedAt: '4 hours ago', summary: 'NVIDIA announced new partnerships with pharmaceutical companies to accelerate drug discovery using AI and its specialized computing hardware.' },
    { id: '3', title: 'Jensen Huang: AI Infrastructure Buildout is Just Beginning', source: 'CNBC', url: '#', publishedAt: '1 day ago', summary: 'NVIDIA CEO Jensen Huang said the buildout of AI computing infrastructure is still in its early stages, suggesting continued strong demand for the company\'s products.' },
  ],
};

export function getNewsForStock(symbol: string): NewsItem[] {
  return newsData[symbol] || [
    { id: '1', title: `${stocks[symbol]?.name || symbol} Reports Quarterly Results`, source: 'Reuters', url: '#', publishedAt: '2 hours ago', summary: `${stocks[symbol]?.name || symbol} released its latest quarterly financial results, meeting analyst expectations across key metrics.` },
    { id: '2', title: `Analysts Weigh In on ${symbol} Outlook`, source: 'Bloomberg', url: '#', publishedAt: '5 hours ago', summary: `Several Wall Street analysts have updated their ratings and price targets for ${symbol} following recent market developments.` },
    { id: '3', title: `${stocks[symbol]?.industry || 'Industry'} Sector Shows Mixed Signals`, source: 'MarketWatch', url: '#', publishedAt: '1 day ago', summary: `The broader ${stocks[symbol]?.industry || 'industry'} sector is showing mixed signals as investors weigh macroeconomic factors.` },
  ];
}

export function getEarningsForStock(symbol: string): EarningsData[] {
  return earningsData[symbol] || [];
}

export function getFinancialsForStock(symbol: string): FinancialData[] {
  return financialData[symbol] || [];
}

export const relatedStocks: Record<string, string[]> = {
  GOOGL: ['META', 'MSFT', 'AMZN', 'AAPL'],
  AAPL: ['MSFT', 'GOOGL', 'META', 'AMZN'],
  MSFT: ['GOOGL', 'AAPL', 'AMZN', 'META'],
  AMZN: ['GOOGL', 'MSFT', 'AAPL', 'META'],
  NVDA: ['GOOGL', 'MSFT', 'AMZN', 'META'],
  META: ['GOOGL', 'MSFT', 'AAPL', 'AMZN'],
  TSLA: ['NVDA', 'AAPL', 'AMZN', 'GOOGL'],
  JPM: ['V', 'MSFT', 'AAPL', 'JNJ'],
  JNJ: ['JPM', 'V', 'AAPL', 'MSFT'],
  V: ['JPM', 'MSFT', 'AAPL', 'JNJ'],
};
