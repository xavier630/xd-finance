import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrencySymbol } from '../utils/currency';
import { getQuotes } from '../services/api';
import type { CurrencyCode } from '../types';

const RELATED_MAP: Record<string, string[]> = {
  GOOGL: ['MSFT', 'META', 'AMZN', 'AAPL'],
  AAPL: ['MSFT', 'GOOGL', 'META', 'AMZN'],
  MSFT: ['GOOGL', 'AAPL', 'AMZN', 'META'],
  AMZN: ['GOOGL', 'MSFT', 'AAPL', 'META'],
  NVDA: ['AMD', 'INTC', 'TSM', 'AVGO'],
  META: ['GOOGL', 'SNAP', 'PINS', 'MSFT'],
  TSLA: ['F', 'GM', 'RIVN', 'NIO'],
  JPM: ['BAC', 'GS', 'MS', 'WFC'],
  JNJ: ['PFE', 'MRK', 'UNH', 'ABBV'],
  V: ['MA', 'PYPL', 'SQ', 'AXP'],
};

interface RelatedStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: CurrencyCode;
}

interface RelatedCompaniesProps {
  symbol: string;
}

export default function RelatedCompanies({ symbol }: RelatedCompaniesProps) {
  const [related, setRelated] = useState<RelatedStock[]>([]);

  useEffect(() => {
    const symbols = RELATED_MAP[symbol.toUpperCase()];
    if (!symbols || symbols.length === 0) {
      setRelated([]);
      return;
    }

    getQuotes(symbols)
      .then((data) => {
        const stocks: RelatedStock[] = symbols.map((sym) => {
          const q = data[sym];
          if (!q) return null;
          return {
            symbol: q.symbol,
            name: q.longName || q.shortName || q.symbol,
            price: q.regularMarketPrice,
            change: q.regularMarketChange,
            changePercent: q.regularMarketChangePercent,
            currency: (q.currency || 'USD') as CurrencyCode,
          };
        }).filter(Boolean) as RelatedStock[];
        setRelated(stocks);
      })
      .catch(() => {
        setRelated([]);
      });
  }, [symbol]);

  if (related.length === 0) return null;

  return (
    <div className="gf-section">
      <h3 className="gf-section-title">Compare with</h3>
      <div className="gf-related-grid">
        {related.map((stock) => (
          <Link key={stock.symbol} to={`/quote/${stock.symbol}`} className="gf-related-card">
            <div className="gf-related-symbol">{stock.symbol}</div>
            <div className="gf-related-name">{stock.name}</div>
            <div className="gf-related-price">{getCurrencySymbol(stock.currency)}{stock.price.toFixed(2)}</div>
            <div className={`gf-related-change ${stock.change >= 0 ? 'gf-positive' : 'gf-negative'}`}>
              {stock.change >= 0 ? '+' : ''}
              {stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}
              {stock.changePercent.toFixed(2)}%)
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
