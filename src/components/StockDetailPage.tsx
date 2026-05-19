import { useParams, Link } from 'react-router-dom';
import { stocks } from '../data/mockData';
import { getCurrencySymbol } from '../utils/currency';
import StockChart from './StockChart';
import KeyStats from './KeyStats';
import EarningsHistory from './EarningsHistory';
import Financials from './Financials';
import NewsSection from './NewsSection';
import CompanyInfo from './CompanyInfo';
import RelatedCompanies from './RelatedCompanies';

export default function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const stock = symbol ? (stocks[symbol.toUpperCase()] || stocks[symbol]) : undefined;

  if (!stock) {
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

  const isPositive = stock.change >= 0;

  return (
    <div className="gf-stock-detail">
      <div className="gf-breadcrumb">
        <Link to="/">Home</Link>
        <span>&rsaquo;</span>
        <span>
          {stock.symbol} &middot; {stock.exchange}
        </span>
      </div>

      <div className="gf-detail-header">
        <div className="gf-detail-title">
          <h1 className="gf-detail-name">{stock.name}</h1>
          <span className="gf-detail-symbol">
            {stock.symbol} &middot; {stock.exchange}
          </span>
        </div>

        <div className="gf-detail-price-row">
          <span className="gf-detail-price">{getCurrencySymbol(stock.currency)}{stock.price.toFixed(2)}</span>
          <span className={`gf-detail-change ${isPositive ? 'gf-positive' : 'gf-negative'}`}>
            {isPositive ? '+' : ''}
            {stock.change.toFixed(2)} ({isPositive ? '+' : ''}
            {stock.changePercent.toFixed(2)}%)
          </span>
        </div>

        <div className="gf-detail-meta">
          Closed: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} &middot; {stock.currency} &middot; {stock.exchange}
        </div>
      </div>

      <StockChart symbol={stock.symbol} currentPrice={stock.price} change={stock.change} currency={stock.currency} />

      <KeyStats stock={stock} />

      <EarningsHistory symbol={stock.symbol} />

      <Financials symbol={stock.symbol} />

      <CompanyInfo stock={stock} />

      <RelatedCompanies symbol={stock.symbol} />

      <NewsSection symbol={stock.symbol} />
    </div>
  );
}
