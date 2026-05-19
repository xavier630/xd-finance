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

const TICKER_COLORS: string[] = [
  '#1a73e8', '#d93025', '#0d904f', '#e37400', '#9334e6',
  '#00897b', '#c2185b', '#6d4c41', '#546e7a', '#f4511e',
];

function getTickerColor(symbol: string): string {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TICKER_COLORS[Math.abs(hash) % TICKER_COLORS.length];
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
  const symbolsKey = activeWatchlist?.items.map((i) => i.symbol).join(',') ?? '';

  useEffect(() => {
    const symbols = activeWatchlist?.items.map((i) => i.symbol) || [];
    if (symbols.length === 0) { setLiveLoading(false); return; }

    let cancelled = false;
    setLiveLoading(true);
    getQuotes(symbols)
      .then((data) => {
        if (cancelled) return;
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
      .finally(() => { if (!cancelled) setLiveLoading(false); });

    return () => { cancelled = true; };
  }, [activeWatchlist?.id, symbolsKey]);

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
      <div className="gf-breadcrumb">
        <span>HOME</span>
        <span>&rsaquo;</span>
        <span className="active">Watchlists</span>
      </div>

      <div className="gf-classic-wl-tabs">
        {watchlists.map((wl) => (
          <button
            key={wl.id}
            className={`gf-classic-wl-tab ${activeTab === wl.id ? 'active' : ''}`}
            onClick={() => setActiveTab(wl.id)}
          >
            <span className="gf-classic-wl-tab-icon">{'☰'}</span>
            {wl.name}
            <span className="gf-classic-wl-tab-count">{wl.items.length}</span>
          </button>
        ))}
        <button className="gf-classic-wl-tab gf-classic-wl-tab-new" onClick={() => setShowNewWatchlist(true)}>
          + New
        </button>
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
          <button className="gf-btn-primary" onClick={() => handleRename(editingId)}>Save</button>
          <button className="gf-btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
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
          <button className="gf-btn-primary" onClick={handleCreateWatchlist}>Create</button>
          <button className="gf-btn-secondary" onClick={() => setShowNewWatchlist(false)}>Cancel</button>
        </div>
      )}

      <div className="gf-classic-wl-header">
        <h2 className="gf-classic-wl-title">{activeWatchlist?.name || 'Watchlist'}</h2>
        <div className="gf-classic-wl-actions">
          {activeWatchlist && (
            <>
              <button
                className="gf-btn-secondary"
                onClick={() => {
                  setEditingId(activeWatchlist.id);
                  setEditingName(activeWatchlist.name);
                }}
              >
                Rename
              </button>
              {watchlists.length > 1 && (
                <button className="gf-btn-danger" onClick={() => handleDeleteWatchlist(activeWatchlist.id)}>
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {liveLoading && <div className="gf-loading" style={{ padding: '8px 0' }}>Loading live prices...</div>}

      <div className="gf-classic-wl-list">
        {activeWatchlist?.items.map((item) => {
          const live = liveData[item.symbol];
          const price = live?.price ?? item.price;
          const change = live?.change ?? item.change;
          const changePercent = live?.changePercent ?? item.changePercent;
          const currency = live?.currency ?? item.currency;
          const sym = getCurrencySymbol(currency);
          const isPositive = change >= 0;
          const isNegative = change < 0;

          return (
            <div
              key={item.symbol}
              className="gf-classic-wl-row"
              onClick={() => navigate(`/quote/${item.symbol}`)}
            >
              <span className="gf-ticker-badge" style={{ backgroundColor: getTickerColor(item.symbol) }}>
                {item.symbol}
              </span>
              <span className="gf-classic-wl-name">{item.name}</span>
              <span className="gf-classic-wl-price">{sym}{price.toFixed(2)}</span>
              <span className={`gf-classic-wl-change ${isNegative ? 'negative' : ''}`}>
                {isPositive ? '+' : '-'}{sym}{Math.abs(change).toFixed(2)}
              </span>
              <span className={`gf-classic-wl-pct ${isPositive ? 'positive' : isNegative ? 'negative' : ''}`}>
                {isPositive ? '\u2191' : isNegative ? '\u2193' : ''} {Math.abs(changePercent).toFixed(2)}%
              </span>
              <button
                className="gf-btn-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeStock(activeWatchlist.id, item.symbol);
                }}
                title="Remove from watchlist"
              >
                {'✕'}
              </button>
            </div>
          );
        })}
        {activeWatchlist?.items.length === 0 && (
          <div className="gf-classic-wl-empty">
            No stocks in this watchlist. Search for stocks to add.
          </div>
        )}
      </div>
    </div>
  );
}
