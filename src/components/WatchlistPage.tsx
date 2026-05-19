import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { watchlists } from '../data/mockData';
import { formatCurrencyValue, getCurrencySymbol } from '../utils/currency';
import Sparkline from './Sparkline';
import type { CurrencyCode } from '../types';

function formatMarketCap(value: number, currency: CurrencyCode): string {
  return formatCurrencyValue(value, currency, { compact: true });
}

function formatVolume(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toLocaleString();
}

export default function WatchlistPage() {
  const [activeTab, setActiveTab] = useState(watchlists[0].id);
  const navigate = useNavigate();

  const activeWatchlist = watchlists.find((w) => w.id === activeTab) || watchlists[0];

  return (
    <div>
      <div className="gf-watchlist-header">
        <h1 className="gf-watchlist-title">{activeWatchlist.name}</h1>
      </div>

      <div className="gf-watchlist-tabs">
        {watchlists.map((wl) => (
          <button
            key={wl.id}
            className={`gf-watchlist-tab ${activeTab === wl.id ? 'active' : ''}`}
            onClick={() => setActiveTab(wl.id)}
          >
            {wl.name}
            <span style={{ marginLeft: 6, fontSize: 12, color: 'var(--gf-text-tertiary)' }}>
              ({wl.items.length})
            </span>
          </button>
        ))}
      </div>

      <table className="gf-watchlist-table">
        <thead>
          <tr>
            <th style={{ width: '30%' }}>Symbol</th>
            <th className="right">Price</th>
            <th className="right">Change</th>
            <th className="right">% Change</th>
            <th className="right">Market Cap</th>
            <th className="right">Volume</th>
            <th className="right" style={{ width: '100px' }}>
              30D Trend
            </th>
          </tr>
        </thead>
        <tbody>
          {activeWatchlist.items.map((item) => {
            const sym = getCurrencySymbol(item.currency);
            return (
              <tr key={item.symbol} onClick={() => navigate(`/quote/${item.symbol}`)}>
                <td>
                  <div className="gf-stock-symbol">{item.symbol}</div>
                  <div className="gf-stock-name">{item.name}</div>
                </td>
                <td className="right gf-price">
                  {sym}
                  {item.price.toFixed(2)}
                </td>
                <td className={`right ${item.change >= 0 ? 'gf-positive' : 'gf-negative'}`}>
                  {item.change >= 0 ? '+' : ''}
                  {item.change.toFixed(2)}
                </td>
                <td className="right">
                  <span
                    className={`gf-change-badge ${item.changePercent >= 0 ? 'positive' : 'negative'}`}
                  >
                    {item.changePercent >= 0 ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </td>
                <td className="right" style={{ color: 'var(--gf-text-secondary)' }}>
                  {formatMarketCap(item.marketCap, item.currency)}
                </td>
                <td className="right" style={{ color: 'var(--gf-text-secondary)' }}>
                  {formatVolume(item.volume)}
                </td>
                <td className="right">
                  <Sparkline data={item.sparklineData} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
