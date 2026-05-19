import { Link } from 'react-router-dom';
import { watchlists, stocks } from '../data/mockData';

export default function Sidebar() {
  const mainWatchlist = watchlists[0];

  return (
    <aside className="gf-sidebar">
      <div className="gf-sidebar-section">
        <div className="gf-sidebar-title">Watchlist</div>
        {mainWatchlist.items.slice(0, 8).map((item) => (
          <Link key={item.symbol} to={`/quote/${item.symbol}`} className="gf-sidebar-stock">
            <div>
              <div className="gf-sidebar-stock-symbol">{item.symbol}</div>
            </div>
            <div>
              <div className="gf-sidebar-stock-price">${item.price.toFixed(2)}</div>
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
      </div>

      <div className="gf-sidebar-section">
        <div className="gf-sidebar-title">Trending</div>
        {['NVDA', 'AAPL', 'TSLA', 'META', 'AMZN'].map((sym) => {
          const stock = stocks[sym];
          if (!stock) return null;
          return (
            <Link key={sym} to={`/quote/${sym}`} className="gf-sidebar-stock">
              <div>
                <div className="gf-sidebar-stock-symbol">{sym}</div>
              </div>
              <div>
                <div className="gf-sidebar-stock-price">${stock.price.toFixed(2)}</div>
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
          );
        })}
      </div>
    </aside>
  );
}
