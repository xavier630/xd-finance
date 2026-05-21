import { useState } from 'react';
import type { Stock } from '../types';

interface CompanyInfoProps {
  stock: Stock;
}

export default function CompanyInfo({ stock }: CompanyInfoProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="gf-about-card">
      <button className="gf-about-header" onClick={() => setOpen(!open)}>
        <h3 className="gf-about-title">About</h3>
        <span className="cf-chevron">{open ? '\u25B2' : '\u25BC'}</span>
      </button>
      {open && (
        <div className="gf-about-body">
          {stock.description && (
            <p className="gf-about-description">{stock.description}</p>
          )}
          <div className="gf-about-details">
            {stock.ceo && (
              <div className="gf-about-row">
                <span className="gf-about-label">CEO</span>
                <span className="gf-about-value">{stock.ceo}</span>
              </div>
            )}
            {stock.headquarters && (
              <div className="gf-about-row">
                <span className="gf-about-label">Headquarters</span>
                <span className="gf-about-value">{stock.headquarters}</span>
              </div>
            )}
            {stock.employees > 0 && (
              <div className="gf-about-row">
                <span className="gf-about-label">Employees</span>
                <span className="gf-about-value">{stock.employees.toLocaleString()}</span>
              </div>
            )}
            {stock.sector && (
              <div className="gf-about-row">
                <span className="gf-about-label">Sector</span>
                <span className="gf-about-value">{stock.sector}</span>
              </div>
            )}
            {stock.industry && (
              <div className="gf-about-row">
                <span className="gf-about-label">Industry</span>
                <span className="gf-about-value">{stock.industry}</span>
              </div>
            )}
            {stock.website && (
              <div className="gf-about-row">
                <span className="gf-about-label">Website</span>
                <a
                  href={stock.website}
                  className="gf-about-value"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--gf-blue-dark)' }}
                >
                  {stock.website}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
