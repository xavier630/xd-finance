import type { Watchlist, WatchlistItem } from '../types';

const STORAGE_KEY = 'xd-finance-watchlists';

const EMPTY_DEFAULT: Watchlist[] = [
  { id: 'main', name: 'My Watchlist', items: [] },
];

export function loadWatchlists(): Watchlist[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data) as Watchlist[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fall through to defaults
  }
  return structuredClone(EMPTY_DEFAULT);
}

export function saveWatchlists(watchlists: Watchlist[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlists));
  } catch {
    // storage full or unavailable — silent fail
  }
}

export function addToWatchlist(
  watchlists: Watchlist[],
  watchlistId: string,
  item: WatchlistItem
): Watchlist[] {
  return watchlists.map((wl) => {
    if (wl.id !== watchlistId) return wl;
    if (wl.items.some((i) => i.symbol === item.symbol)) return wl;
    return { ...wl, items: [...wl.items, item] };
  });
}

export function removeFromWatchlist(
  watchlists: Watchlist[],
  watchlistId: string,
  symbol: string
): Watchlist[] {
  return watchlists.map((wl) => {
    if (wl.id !== watchlistId) return wl;
    return { ...wl, items: wl.items.filter((i) => i.symbol !== symbol) };
  });
}

export function createWatchlist(
  watchlists: Watchlist[],
  name: string
): Watchlist[] {
  const id = `custom-${Date.now()}`;
  return [...watchlists, { id, name, items: [] }];
}

export function deleteWatchlist(
  watchlists: Watchlist[],
  watchlistId: string
): Watchlist[] {
  return watchlists.filter((wl) => wl.id !== watchlistId);
}

export function renameWatchlist(
  watchlists: Watchlist[],
  watchlistId: string,
  newName: string
): Watchlist[] {
  return watchlists.map((wl) => {
    if (wl.id !== watchlistId) return wl;
    return { ...wl, name: newName };
  });
}

export function isInWatchlist(
  watchlists: Watchlist[],
  watchlistId: string,
  symbol: string
): boolean {
  const wl = watchlists.find((w) => w.id === watchlistId);
  return wl ? wl.items.some((i) => i.symbol === symbol) : false;
}

export function isInAnyWatchlist(
  watchlists: Watchlist[],
  symbol: string
): string[] {
  return watchlists
    .filter((wl) => wl.items.some((i) => i.symbol === symbol))
    .map((wl) => wl.id);
}
