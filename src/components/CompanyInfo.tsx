import type { Stock } from '../types';

interface CompanyInfoProps {
  stock: Stock;
}

export default function CompanyInfo({ stock }: CompanyInfoProps) {
  return (
    <div className="gf-section">
      <h3 className="gf-section-title">About {stock.name}</h3>
      <p className="gf-description">{stock.description}</p>
      <div className="gf-company-details">
        <div className="gf-company-detail">
          <span className="gf-company-detail-label">CEO</span>
          <span className="gf-company-detail-value">{stock.ceo}</span>
        </div>
        <div className="gf-company-detail">
          <span className="gf-company-detail-label">Headquarters</span>
          <span className="gf-company-detail-value">{stock.headquarters}</span>
        </div>
        <div className="gf-company-detail">
          <span className="gf-company-detail-label">Founded</span>
          <span className="gf-company-detail-value">{stock.founded}</span>
        </div>
        <div className="gf-company-detail">
          <span className="gf-company-detail-label">Employees</span>
          <span className="gf-company-detail-value">{stock.employees.toLocaleString()}</span>
        </div>
        <div className="gf-company-detail">
          <span className="gf-company-detail-label">Sector</span>
          <span className="gf-company-detail-value">{stock.sector}</span>
        </div>
        <div className="gf-company-detail">
          <span className="gf-company-detail-label">Industry</span>
          <span className="gf-company-detail-value">{stock.industry}</span>
        </div>
        <div className="gf-company-detail">
          <span className="gf-company-detail-label">Website</span>
          <a
            href={stock.website}
            className="gf-company-detail-value"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gf-blue-dark)' }}
          >
            {stock.website}
          </a>
        </div>
      </div>
    </div>
  );
}
