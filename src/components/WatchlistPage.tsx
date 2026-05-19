import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlists } from '../context/WatchlistContext';
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
  const { watchlists, removeStock, createWatchlist, deleteWatchlist, renameWatchlist } = useWatchlists();
  const [activeTab, setActiveTab] = useState(watchlists[0]?.id || '');
  const [showNewWatchlist, setShowNewWatchlist] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const navigate = useNavigate();

  const activeWatchlist = watchlists.find((w) => w.id === activeTab) || watchlists[0];

  function handleCreateWatchlist() {
    if (newWatchlistName.trim()) {
      createWatchlist(newWatchlistName.trim());
      setNewWatchlistName('');
      setShowNewWatchlist(false);
    }
  }

  function handleRename(watchlistId: string) {
    if (editingName.trim()) {
      renameWatchlist(watchlistId, editingName.trim());
    }
    setEditingId(null);
  }

  function handleDeleteWatchlist(watchlistId: string) {
    deleteWatchlist(watchlistId);
    if (activeTab === watchlistId) {
      setActiveTab(watchlists[0]?.id || '');
    }
  }

  return (
    <div>
      <div className="gf-watchlist-header">
        <h1 className="gf-watchlist-title">{activeWatchlist?.name || 'Watchlist'}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {activeWatchlist && (
            <>
              <button
                className="gf-btn-secondary"
                onClick={() => {
                  setEditingId(activeWatchlist.id);
                  setEditingName(activeWatchlist.name);
                }}
                title="Rename watchlist"
              >
                Rename
              </button>
              {watchlists.length > 1 && (
                <button
                  className="gf-btn-danger"
                  onClick={() => handleDeleteWatchlist(activeWatchlist.id)}
                  title="Delete watchlist"
                >
                  Delete
                </button>
              )}
            </>
          )}
          <button className="gf-btn-primary" onClick={() => setShowNewWatchlist(true)}>
            + New Watchlist
          </button>
        </div>
      </div>

      {editingId && (
        <div className="gf-inline-form">
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRename(editingId)}
            autoFocus
            className="gf-input"
          />
          <button className="gf-btn-primary" onClick={() => handleRename(editingId)}>
            Save
          </button>
          <button className="gf-btn-secondary" onClick={() => setEditingId(null)}>
            Cancel
          </button>
        </div>
      )}

      {showNewWatchlist && (
        <div className="gf-inline-form">
          <input
            type="text"
            value={newWatchlistName}
            onChange={(e) => setNewWatchlistName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateWatchlist()}
            placeholder="Watchlist name"
            autoFocus
            className="gf-input"
          />
          <button className="gf-btn-primary" onClick={handleCreateWatchlist}>
            Create
          </button>
          <button className="gf-btn-secondary" onClick={() => setShowNewWatchlist(false)}>
            Cancel
          </button>
        </div>
      )}

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
            <th style={{ width: '25%' }}>Symbol</th>
            <th className="right">Price</th>
            <th className="right">Change</th>
            <th className="right">% Change</th>
            <th className="right">Market Cap</th>
            <th className="right">Volume</th>
            <th className="right" style={{ width: '100px' }}>
              30D Trend
            </th>
            <th className="right" style={{ width: '40px' }}></th>
          </tr>
        </thead>
        <tbody>
          {activeWatchlist?.items.map((item) => {
            const sym = getCurrencySymbol(item.currency);
            return (
              <tr key={item.symbol}>
                <td onClick={() => navigate(`/quote/${item.symbol}`)} style={{ cursor: 'pointer' }}>
                  <div className="gf-stock-symbol">{item.symbol}</div>
                  <div className="gf-stock-name">{item.name}</div>
                </td>
                <td className="right gf-price" onClick={() => navigate(`/quote/${item.symbol}`)} style={{ cursor: 'pointer' }}>
                  {sym}
                  {item.price.toFixed(2)}
                </td>
                <td className={`right ${item.change >= 0 ? 'gf-positive' : 'gf-negative'}`} onClick={() => navigate(`/quote/${item.symbol}`)} style={{ cursor: 'pointer' }}>
                  {item.change >= 0 ? '+' : ''}
                  {item.change.toFixed(2)}
                </td>
                <td className="right" onClick={() => navigate(`/quote/${item.symbol}`)} style={{ cursor: 'pointer' }}>
                  <span
                    className={`gf-change-badge ${item.changePercent >= 0 ? 'positive' : 'negative'}`}
                  >
                    {item.changePercent >= 0 ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </td>
                <td className="right" style={{ color: 'var(--gf-text-secondary)', cursor: 'pointer' }} onClick={() => navigate(`/quote/${item.symbol}`)}>
                  {formatMarketCap(item.marketCap, item.currency)}
                </td>
                <td className="right" style={{ color: 'var(--gf-text-secondary)', cursor: 'pointer' }} onClick={() => navigate(`/quote/${item.symbol}`)}>
                  {formatVolume(item.volume)}
                </td>
                <td className="right" onClick={() => navigate(`/quote/${item.symbol}`)} style={{ cursor: 'pointer' }}>
                  <Sparkline data={item.sparklineData} />
                </td>
                <td className="right">
                  <button
                    className="gf-btn-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStock(activeWatchlist.id, item.symbol);
                    }}
                    title="Remove from watchlist"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
          {activeWatchlist?.items.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gf-text-tertiary)' }}>
                No stocks in this watchlist. Search for stocks to add.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
