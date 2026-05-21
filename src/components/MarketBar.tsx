import { useState, useEffect } from 'react';
import { getMarketIndices } from '../services/api';
import type { MarketIndex } from '../types';

const INDEX_NAMES: Record<string, string> = {
  '^DJI': 'Dow Jones',
  '^GSPC': 'S&P 500',
  '^IXIC': 'Nasdaq',
  '^RUT': 'Russell',
  '^VIX': 'VIX',
};

export default function MarketBar() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketIndices()
      .then((data) => {
        const mapped: MarketIndex[] = data.map((q) => ({
          symbol: q.symbol,
          name: INDEX_NAMES[q.symbol] || q.shortName || q.symbol,
          value: q.regularMarketPrice,
          change: q.regularMarketChange,
          changePercent: q.regularMarketChangePercent,
        }));
        setIndices(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="gf-market-bar"><div className="gf-market-item">Loading market data...</div></div>;
  }

  if (indices.length === 0) {
    return <div className="gf-market-bar"><div className="gf-market-item">Market data unavailable</div></div>;
  }

  return (
    <div className="gf-market-bar">
      {indices.map((index) => {
        const isPositive = index.change >= 0;
        return (
          <div key={index.symbol} className={`gf-market-chip ${isPositive ? 'positive' : 'negative'}`}>
            <span className="gf-market-chip-arrow">{isPositive ? '\u2191' : '\u2193'}</span>
            <div className="gf-market-chip-info">
              <span className="gf-market-chip-name">{index.name}</span>
              <span className="gf-market-chip-value">
                {index.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="gf-market-chip-change">
              <span className={isPositive ? 'gf-positive' : 'gf-negative'}>
                {isPositive ? '+' : ''}{index.changePercent.toFixed(3)}%
              </span>
              <span className={isPositive ? 'gf-positive' : 'gf-negative'}>
                {isPositive ? '+' : ''}{index.change.toFixed(2)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
