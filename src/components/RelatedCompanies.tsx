import { Link } from 'react-router-dom';
import { stocks, relatedStocks } from '../data/mockData';

interface RelatedCompaniesProps {
  symbol: string;
}

export default function RelatedCompanies({ symbol }: RelatedCompaniesProps) {
  const related = relatedStocks[symbol] || [];

  if (related.length === 0) return null;

  return (
    <div className="gf-section">
      <h3 className="gf-section-title">Compare with</h3>
      <div className="gf-related-grid">
        {related.map((sym) => {
          const stock = stocks[sym];
          if (!stock) return null;
          return (
            <Link key={sym} to={`/quote/${sym}`} className="gf-related-card">
              <div className="gf-related-symbol">{sym}</div>
              <div className="gf-related-name">{stock.name}</div>
              <div className="gf-related-price">${stock.price.toFixed(2)}</div>
              <div className={`gf-related-change ${stock.change >= 0 ? 'gf-positive' : 'gf-negative'}`}>
                {stock.change >= 0 ? '+' : ''}
                {stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}
                {stock.changePercent.toFixed(2)}%)
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
