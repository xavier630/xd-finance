import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { searchSymbols } from '../services/api';
import type { YahooSearchQuote } from '../services/api';

export default function Header() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<YahooSearchQuote[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchSymbols(value.trim())
        .then((result) => {
          const equities = result.quotes
            .filter((q) => q.quoteType === 'EQUITY' || q.quoteType === 'ETF')
            .slice(0, 8);
          setSuggestions(equities);
          setShowSuggestions(equities.length > 0);
        })
        .catch(() => {
          setSuggestions([]);
          setShowSuggestions(false);
        });
    }, 250);
  }

  function handleSelect(symbol: string) {
    setQuery('');
    setShowSuggestions(false);
    navigate(`/quote/${symbol}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      if (suggestions.length > 0) {
        handleSelect(suggestions[0].symbol);
      } else {
        handleSelect(trimmed.toUpperCase());
      }
    }
  }

  return (
    <header className="gf-header">
      <Link to="/" className="gf-logo">
        <svg className="gf-logo-icon" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#4285F4" />
          <path d="M12 2C6.48 2 2 6.48 2 12h10V2z" fill="#34A853" />
          <path d="M2 12c0 5.52 4.48 10 10 10V12H2z" fill="#FBBC05" />
          <path d="M12 22c5.52 0 10-4.48 10-10H12v10z" fill="#EA4335" />
        </svg>
        <span className="gf-logo-text">
          <span className="gf-logo-google">XD</span> Finance
        </span>
      </Link>

      <div className="gf-search-container">
        <form onSubmit={handleSubmit}>
          <span className="gf-search-icon">&#x1F50D;</span>
          <input
            ref={inputRef}
            className="gf-search-input"
            type="text"
            placeholder="Search for stocks, ETFs, and more"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query && setShowSuggestions(true)}
          />
        </form>
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              border: '1px solid var(--gf-border)',
              borderRadius: '0 0 8px 8px',
              boxShadow: 'var(--gf-shadow)',
              zIndex: 200,
              overflow: 'hidden',
            }}
          >
            {suggestions.map((item) => (
              <div
                key={item.symbol}
                onClick={() => handleSelect(item.symbol)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gf-bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <div style={{ fontWeight: 500, fontSize: '14px', color: 'var(--gf-blue-dark)' }}>
                    {item.symbol}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--gf-text-secondary)' }}>
                    {item.longname || item.shortname || ''} &middot; {item.exchDisp || item.exchange}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'var(--gf-text-tertiary)' }}>
                    {item.sector || item.quoteType}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <nav className="gf-header-nav">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Watchlist
        </Link>
        <Link to="/markets" className={location.pathname === '/markets' ? 'active' : ''}>
          Markets
        </Link>
      </nav>
    </header>
  );
}
