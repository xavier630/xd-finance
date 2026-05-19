import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrencySymbol } from '../utils/currency';
import { useWatchlists } from '../context/WatchlistContext';
import { getQuotes } from '../services/api';
import type { CurrencyCode } from '../types';

const TRENDING_SYMBOLS = ['NVDA', 'AAPL', 'TSLA', 'META', 'AMZN'];

interface TrendingStock {
  symbol: string;
  price: number;
  changePercent: number;
  currency: CurrencyCode;
}

export default function Sidebar() {
  const { watchlists } = useWatchlists();
  const mainWatchlist = watchlists[0];
  const [trending, setTrending] = useState<TrendingStock[]>([]);

  useEffect(() => {
    getQuotes(TRENDING_SYMBOLS)
      .then((data) => {
        const stocks: TrendingStock[] = TRENDING_SYMBOLS.map((sym) => {
          const q = data[sym];
          if (!q) return null;
          return {
            symbol: q.symbol,
            price: q.regularMarketPrice,
            changePercent: q.regularMarketChangePercent,
            currency: (q.currency || 'USD') as CurrencyCode,
          };
        }).filter(Boolean) as TrendingStock[];
        setTrending(stocks);
      })
      .catch(() => {
        // API unavailable
      });
  }, []);

  return (
    <aside className="gf-sidebar">
      <div className="gf-sidebar-section">
        <div className="gf-sidebar-title">Watchlist</div>
        {mainWatchlist?.items.slice(0, 8).map((item) => (
          <Link key={item.symbol} to={`/quote/${item.symbol}`} className="gf-sidebar-stock">
            <div>
              <div className="gf-sidebar-stock-symbol">{item.symbol}</div>
            </div>
            <div>
              <div className="gf-sidebar-stock-price">{getCurrencySymbol(item.currency)}{item.price.toFixed(2)}</div>
              <div
                className={`gf-sidebar-stock-change ${
                  item.changePercent >= 0 ? 'gf-positive' : 'gf-negative'
                }`}
              >
                {item.changePercent >= 0 ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </div>
            </div>
          </Link>
        ))}
        {(!mainWatchlist || mainWatchlist.items.length === 0) && (
          <div style={{ padding: '8px 12px', color: '#999', fontSize: 13 }}>
            No stocks in watchlist. Search to add some.
          </div>
        )}
      </div>

      <div className="gf-sidebar-section">
        <div className="gf-sidebar-title">Trending</div>
        {trending.map((stock) => (
          <Link key={stock.symbol} to={`/quote/${stock.symbol}`} className="gf-sidebar-stock">
            <div>
              <div className="gf-sidebar-stock-symbol">{stock.symbol}</div>
            </div>
            <div>
              <div className="gf-sidebar-stock-price">{getCurrencySymbol(stock.currency)}{stock.price.toFixed(2)}</div>
              <div
                className={`gf-sidebar-stock-change ${
                  stock.changePercent >= 0 ? 'gf-positive' : 'gf-negative'
                }`}
              >
                {stock.changePercent >= 0 ? '+' : ''}
                {stock.changePercent.toFixed(2)}%
              </div>
            </div>
          </Link>
        ))}
        {trending.length === 0 && (
          <div style={{ padding: '8px 12px', color: '#999', fontSize: 13 }}>
            Loading...
          </div>
        )}
      </div>
    </aside>
  );
}
