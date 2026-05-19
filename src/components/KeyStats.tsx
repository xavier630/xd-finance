import type { Stock } from '../types';

interface KeyStatsProps {
  stock: Stock;
}

function formatNumber(value: number | null, prefix = '', suffix = ''): string {
  if (value === null || value === undefined) return '—';
  return `${prefix}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${suffix}`;
}

function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

export default function KeyStats({ stock }: KeyStatsProps) {
  const stats = [
    { label: 'Previous Close', value: formatNumber(stock.previousClose, '$') },
    { label: 'Open', value: formatNumber(stock.open, '$') },
    { label: 'Day Range', value: `$${stock.dayLow.toFixed(2)} - $${stock.dayHigh.toFixed(2)}` },
    { label: '52-Week Range', value: `$${stock.week52Low.toFixed(2)} - $${stock.week52High.toFixed(2)}` },
    { label: 'Volume', value: stock.volume.toLocaleString() },
    { label: 'Avg Volume', value: stock.avgVolume.toLocaleString() },
    { label: 'Market Cap', value: formatLargeNumber(stock.marketCap) },
    { label: 'P/E Ratio (TTM)', value: stock.peRatio ? stock.peRatio.toFixed(2) : '—' },
    { label: 'EPS (TTM)', value: formatNumber(stock.eps, '$') },
    { label: 'Dividend Yield', value: stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : '—' },
    { label: 'Beta', value: stock.beta.toFixed(2) },
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
