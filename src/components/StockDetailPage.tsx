import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCurrencySymbol } from '../utils/currency';
import { useWatchlists } from '../context/WatchlistContext';
import { useQuote, useCompanyInfo } from '../hooks/useStockData';
import StockChart from './StockChart';
import KeyStats from './KeyStats';
import ClassicFinancials from './ClassicFinancials';
import CompanyInfo from './CompanyInfo';

const GOOGLE_FINANCE_EXCHANGE_MAP: Record<string, string> = {
  'NASDAQ': 'NASDAQ', 'NasdaqGS': 'NASDAQ', 'NasdaqGM': 'NASDAQ', 'NasdaqCM': 'NASDAQ',
  'NYSE': 'NYSE', 'NYSEArca': 'NYSEARCA',
  'LSE': 'LON', 'London': 'LON', 'London Stock Exchange': 'LON',
  'XETRA': 'ETR',
  'HKSE': 'HKG', 'Hong Kong': 'HKG',
  'SIX': 'SWX', 'Swiss Exchange': 'SWX',
  'Euronext': 'EPA', 'Euronext Paris': 'EPA',
  'TSE': 'TYO', 'Tokyo': 'TYO',
  'ASX': 'ASX',
  'TSX': 'TSE',
};

function getGoogleFinanceUrl(symbol: string, exchange: string): string {
  const gExchange = GOOGLE_FINANCE_EXCHANGE_MAP[exchange] || exchange;
  const cleanSymbol = symbol.replace(/\.(DE|L|HK|SW|PA|TO|AX|T)$/, '');
  return `https://www.google.com/finance/quote/${encodeURIComponent(cleanSymbol)}:${encodeURIComponent(gExchange)}?window=5Y`;
}

export default function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { stock, loading, error } = useQuote(symbol);
  const { profile, beta } = useCompanyInfo(symbol);
  const { watchlists, addStock, removeStock, getWatchlistsForSymbol } = useWatchlists();
  const [showWatchlistMenu, setShowWatchlistMenu] = useState(false);

  if (loading) {
    return (
      <div className="gf-stock-detail">
        <div className="gf-loading">Loading {symbol}...</div>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="gf-stock-detail">
        <div className="gf-empty-state" style={{ minHeight: 400 }}>
          <h3>Stock not found</h3>
          <p>The symbol &quot;{symbol}&quot; was not found. Try searching for another stock.</p>
          <Link to="/" style={{ marginTop: 16, color: 'var(--gf-blue-dark)' }}>
            Back to Watchlist
          </Link>
        </div>
      </div>
    );
  }

  const enrichedStock = {
    ...stock,
    beta: beta || stock.beta,
    sector: profile?.sector || stock.sector,
    industry: profile?.industry || stock.industry,
    description: profile?.longBusinessSummary || stock.description,
    ceo: profile?.companyOfficers?.[0]?.name || stock.ceo,
    employees: profile?.fullTimeEmployees || stock.employees,
    headquarters: profile ? [profile.city, profile.state, profile.country].filter(Boolean).join(', ') : stock.headquarters,
    website: profile?.website || stock.website,
  };

  const isPositive = stock.change >= 0;
  const memberOf = getWatchlistsForSymbol(stock.symbol);
  const isWatched = memberOf.length > 0;

  function handleToggleWatchlist(watchlistId: string) {
    if (!stock) return;
    if (memberOf.includes(watchlistId)) {
      removeStock(watchlistId, stock.symbol);
    } else {
      addStock(watchlistId, {
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        marketCap: stock.marketCap,
        volume: stock.volume,
        sparklineData: [],
        currency: stock.currency,
      });
    }
  }

  return (
    <div className="gf-stock-detail">
      <div className="gf-breadcrumb">
        <Link to="/">HOME</Link>
        <span>&rsaquo;</span>
        <span>{stock.symbol} &middot; {stock.exchange}</span>
      </div>

      <div className="gf-detail-header">
        <div className="gf-detail-title">
          <h1 className="gf-detail-name">{stock.name}</h1>
        </div>

        <div className="gf-detail-actions">
          <button
            className={`gf-btn-follow ${isWatched ? 'following' : ''}`}
            onClick={() => setShowWatchlistMenu(!showWatchlistMenu)}
          >
            {isWatched ? '\u2713 Following' : '+ Follow'}
          </button>
          <a
            href={getGoogleFinanceUrl(stock.symbol, stock.exchange)}
            target="_blank"
            rel="noopener noreferrer"
            className="gf-btn-share"
          >
            View on Google Finance
          </a>
          {showWatchlistMenu && (
            <div className="gf-watchlist-dropdown">
              {watchlists.map((wl) => {
                const inThis = memberOf.includes(wl.id);
                return (
                  <button
                    key={wl.id}
                    className={`gf-watchlist-dropdown-item ${inThis ? 'active' : ''}`}
                    onClick={() => handleToggleWatchlist(wl.id)}
                  >
                    <span>{inThis ? '\u2605' : '\u2606'}</span>
                    <span>{wl.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="gf-detail-price-row">
        <span className="gf-detail-price">{getCurrencySymbol(stock.currency)}{stock.price.toFixed(2)}</span>
        <span className={`gf-detail-change-badge ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '\u2191' : '\u2193'}{Math.abs(stock.changePercent).toFixed(2)}%
        </span>
        <span className={`gf-detail-change-abs ${isPositive ? 'gf-positive' : 'gf-negative'}`}>
          {isPositive ? '+' : ''}{stock.change.toFixed(2)}
        </span>
      </div>
      <div className="gf-detail-meta">
        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })} &middot; {stock.currency} &middot; {stock.exchange} &middot; Disclaimer
      </div>

      <div className="gf-classic-layout">
        <div className="gf-classic-main">
          <StockChart symbol={stock.symbol} currentPrice={stock.price} change={stock.change} currency={stock.currency} />

          <ClassicFinancials symbol={stock.symbol} />
        </div>

        <div className="gf-classic-sidebar">
          <KeyStats stock={enrichedStock} />
          <CompanyInfo stock={enrichedStock} />
        </div>
      </div>
    </div>
  );
}
