import type { Stock } from '../types';
import { getCurrencySymbol, formatCurrencyValue } from '../utils/currency';

interface KeyStatsProps {
  stock: Stock;
}

export default function KeyStats({ stock }: KeyStatsProps) {
  const sym = getCurrencySymbol(stock.currency);

  function fmtPrice(value: number | null): string {
    if (value === null || value === undefined) return '—';
    return `${sym}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const stats = [
    { label: 'Previous Close', value: fmtPrice(stock.previousClose) },
    { label: 'Open', value: fmtPrice(stock.open) },
    { label: 'Day Range', value: `${sym}${stock.dayLow.toFixed(2)} - ${sym}${stock.dayHigh.toFixed(2)}` },
    { label: '52-Week Range', value: `${sym}${stock.week52Low.toFixed(2)} - ${sym}${stock.week52High.toFixed(2)}` },
    { label: 'Volume', value: stock.volume.toLocaleString() },
    { label: 'Avg Volume', value: stock.avgVolume.toLocaleString() },
    { label: 'Market Cap', value: formatCurrencyValue(stock.marketCap, stock.currency, { compact: true }) },
    { label: 'P/E Ratio (TTM)', value: stock.peRatio ? stock.peRatio.toFixed(2) : '—' },
    { label: 'EPS (TTM)', value: fmtPrice(stock.eps) },
    { label: 'Dividend Yield', value: stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : '—' },
    { label: 'Beta', value: stock.beta.toFixed(2) },
    { label: 'Currency', value: stock.currency },
    { label: 'Exchange', value: stock.exchange },
  ];

  return (
    <div className="gf-section">
      <h3 className="gf-section-title">Key Statistics</h3>
      <div className="gf-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="gf-stat-row">
            <span className="gf-stat-label">{stat.label}</span>
            <span className="gf-stat-value">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
