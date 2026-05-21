import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
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
import { loadGistWatchlists, saveGistWatchlists, getGistStatus } from '../services/api';

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'disabled';

interface WatchlistContextValue {
  watchlists: Watchlist[];
  addStock: (watchlistId: string, item: WatchlistItem) => void;
  removeStock: (watchlistId: string, symbol: string) => void;
  createWatchlist: (name: string) => void;
  deleteWatchlist: (watchlistId: string) => void;
  renameWatchlist: (watchlistId: string, newName: string) => void;
  isInWatchlist: (watchlistId: string, symbol: string) => boolean;
  getWatchlistsForSymbol: (symbol: string) => string[];
  syncStatus: SyncStatus;
  lastSynced: Date | null;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

const GIST_DEBOUNCE_MS = 2000;

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>(() => loadWatchlists());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const gistEnabled = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadDone = useRef(false);

  // Check if Gist sync is available and load remote data on mount
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const status = await getGistStatus();
        if (cancelled) return;

        if (!status.configured) {
          setSyncStatus('disabled');
          return;
        }

        gistEnabled.current = true;
        setSyncStatus('syncing');

        const result = await loadGistWatchlists();
        if (cancelled) return;

        if (result.watchlists && Array.isArray(result.watchlists) && result.watchlists.length > 0) {
          setWatchlists(result.watchlists as Watchlist[]);
          saveWatchlists(result.watchlists as Watchlist[]);
        }

        setSyncStatus('synced');
        setLastSynced(new Date());
        initialLoadDone.current = true;
      } catch {
        if (!cancelled) setSyncStatus('error');
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  // Save to localStorage + debounced Gist save on every change
  useEffect(() => {
    saveWatchlists(watchlists);

    if (!gistEnabled.current) return;
    // Skip the initial render to avoid saving defaults back before Gist loads
    if (!initialLoadDone.current) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setSyncStatus('syncing');
      try {
        await saveGistWatchlists(watchlists);
        setSyncStatus('synced');
        setLastSynced(new Date());
      } catch {
        setSyncStatus('error');
      }
    }, GIST_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
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
        syncStatus,
        lastSynced,
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
