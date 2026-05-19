import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Watchlist, WatchlistItem } from '../types';
import {
  loadWatchlists,
  saveWatchlists,
  addToWatchlist,
  removeFromWatchlist,
  createWatchlist as createWl,
  deleteWatchlist as deleteWl,
  renameWatchlist as renameWl,
} from '../services/watchlistStorage';

interface WatchlistContextValue {
  watchlists: Watchlist[];
  addStock: (watchlistId: string, item: WatchlistItem) => void;
  removeStock: (watchlistId: string, symbol: string) => void;
  createWatchlist: (name: string) => void;
  deleteWatchlist: (watchlistId: string) => void;
  renameWatchlist: (watchlistId: string, newName: string) => void;
  isInWatchlist: (watchlistId: string, symbol: string) => boolean;
  getWatchlistsForSymbol: (symbol: string) => string[];
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>(() => loadWatchlists());

  useEffect(() => {
    saveWatchlists(watchlists);
  }, [watchlists]);

  const addStock = useCallback((watchlistId: string, item: WatchlistItem) => {
    setWatchlists((prev) => addToWatchlist(prev, watchlistId, item));
  }, []);

  const removeStock = useCallback((watchlistId: string, symbol: string) => {
    setWatchlists((prev) => removeFromWatchlist(prev, watchlistId, symbol));
  }, []);

  const createWatchlist = useCallback((name: string) => {
    setWatchlists((prev) => createWl(prev, name));
  }, []);

  const deleteWatchlist = useCallback((watchlistId: string) => {
    setWatchlists((prev) => deleteWl(prev, watchlistId));
  }, []);

  const renameWatchlist = useCallback((watchlistId: string, newName: string) => {
    setWatchlists((prev) => renameWl(prev, watchlistId, newName));
  }, []);

  const isInWatchlist = useCallback(
    (watchlistId: string, symbol: string) => {
      const wl = watchlists.find((w) => w.id === watchlistId);
      return wl ? wl.items.some((i) => i.symbol === symbol) : false;
    },
    [watchlists]
  );

  const getWatchlistsForSymbol = useCallback(
    (symbol: string) => {
      return watchlists
        .filter((wl) => wl.items.some((i) => i.symbol === symbol))
        .map((wl) => wl.id);
    },
    [watchlists]
  );

  return (
    <WatchlistContext.Provider
      value={{
        watchlists,
        addStock,
        removeStock,
        createWatchlist,
        deleteWatchlist,
        renameWatchlist,
        isInWatchlist,
        getWatchlistsForSymbol,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlists(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlists must be used within WatchlistProvider');
  return ctx;
}
