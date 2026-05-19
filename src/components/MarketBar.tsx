import { useState, useEffect } from 'react';
import { getMarketIndices } from '../services/api';
import type { MarketIndex } from '../types';

const INDEX_NAMES: Record<string, string> = {
  '^DJI': 'Dow Jones',
  '^GSPC': 'S&P 500',
  '^IXIC': 'Nasdaq',
  '^RUT': 'Russell 2000',
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
      .catch(() => {
        // API unavailable
      })
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
      {indices.map((index) => (
        <div key={index.symbol} className="gf-market-item">
          <div className="gf-market-item-name">{index.name}</div>
          <div className="gf-market-item-value">
            {index.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div
            className={`gf-market-item-change ${index.change >= 0 ? 'gf-positive' : 'gf-negative'}`}
          >
            {index.change >= 0 ? '+' : ''}
            {index.change.toFixed(2)} ({index.change >= 0 ? '+' : ''}
            {index.changePercent.toFixed(2)}%)
          </div>
        </div>
      ))}
    </div>
  );
}
