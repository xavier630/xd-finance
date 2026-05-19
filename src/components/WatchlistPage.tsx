import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlists } from '../context/WatchlistContext';
import { getCurrencySymbol } from '../utils/currency';
import { getQuotes } from '../services/api';
import type { YahooQuote } from '../services/api';
import type { CurrencyCode } from '../types';

interface LiveStockData {
  price: number;
  change: number;
  changePercent: number;
  fiftyTwoWeekChangePercent: number | null;
  currency: CurrencyCode;
}

export default function WatchlistPage() {
  const { watchlists, removeStock, createWatchlist, deleteWatchlist, renameWatchlist } = useWatchlists();
  const [activeTab, setActiveTab] = useState(watchlists[0]?.id || '');
  const [showNewWatchlist, setShowNewWatchlist] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [liveData, setLiveData] = useState<Record<string, LiveStockData>>({});
  const [liveLoading, setLiveLoading] = useState(false);
  const navigate = useNavigate();

  const activeWatchlist = watchlists.find((w) => w.id === activeTab) || watchlists[0];

  useEffect(() => {
    const symbols = activeWatchlist?.items.map((i) => i.symbol) || [];
    if (symbols.length === 0) return;

    setLiveLoading(true);
    getQuotes(symbols)
      .then((data) => {
        const live: Record<string, LiveStockData> = {};
        for (const sym of symbols) {
          const q = data[sym] as YahooQuote | undefined;
          if (q) {
            live[sym] = {
              price: q.regularMarketPrice,
              change: q.regularMarketChange,
              changePercent: q.regularMarketChangePercent,
              fiftyTwoWeekChangePercent: q.fiftyTwoWeekChangePercent ?? null,
              currency: (q.currency || 'USD') as CurrencyCode,
            };
          }
        }
        setLiveData(live);
      })
      .catch(() => {})
      .finally(() => setLiveLoading(false));
  }, [activeWatchlist?.id, activeWatchlist?.items.length]);

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
      const remaining = watchlists.filter((wl) => wl.id !== watchlistId);
      setActiveTab(remaining[0]?.id || '');
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

      {liveLoading && activeWatchlist?.items.length > 0 && (
        <div style={{ padding: '8px 0', color: 'var(--gf-text-tertiary)', fontSize: 13 }}>
          Refreshing live prices...
        </div>
      )}

      <table className="gf-watchlist-table">
        <thead>
          <tr>
            <th style={{ width: '25%' }}>Symbol</th>
            <th className="right">Price</th>
            <th className="right">Change</th>
            <th className="right">Day %</th>
            <th className="right">1Y %</th>
            <th className="right" style={{ width: '40px' }}></th>
          </tr>
        </thead>
        <tbody>
          {activeWatchlist?.items.map((item) => {
            const live = liveData[item.symbol];
            const price = live?.price ?? item.price;
            const change = live?.change ?? item.change;
            const changePct = live?.changePercent ?? item.changePercent;
            const yearPct = live?.fiftyTwoWeekChangePercent;
            const currency = live?.currency ?? item.currency;
            const sym = getCurrencySymbol(currency);

            return (
              <tr key={item.symbol}>
                <td onClick={() => navigate(`/quote/${item.symbol}`)} style={{ cursor: 'pointer' }}>
                  <div className="gf-stock-symbol">{item.symbol}</div>
                  <div className="gf-stock-name">{item.name}</div>
                </td>
                <td className="right gf-price" onClick={() => navigate(`/quote/${item.symbol}`)} style={{ cursor: 'pointer' }}>
                  {sym}{price.toFixed(2)}
                </td>
                <td className={`right ${change >= 0 ? 'gf-positive' : 'gf-negative'}`} onClick={() => navigate(`/quote/${item.symbol}`)} style={{ cursor: 'pointer' }}>
                  {change >= 0 ? '+' : ''}{sym}{Math.abs(change).toFixed(2)}
                </td>
                <td className="right" onClick={() => navigate(`/quote/${item.symbol}`)} style={{ cursor: 'pointer' }}>
                  <span className={`gf-change-badge ${changePct >= 0 ? 'positive' : 'negative'}`}>
                    {changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%
                  </span>
                </td>
                <td className="right" onClick={() => navigate(`/quote/${item.symbol}`)} style={{ cursor: 'pointer' }}>
                  {yearPct != null ? (
                    <span className={`gf-change-badge ${yearPct >= 0 ? 'positive' : 'negative'}`}>
                      {yearPct >= 0 ? '+' : ''}{yearPct.toFixed(2)}%
                    </span>
                  ) : (
                    <span style={{ color: 'var(--gf-text-tertiary)' }}>—</span>
                  )}
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
              <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gf-text-tertiary)' }}>
                No stocks in this watchlist. Search for stocks to add.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
