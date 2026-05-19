import { useState } from 'react';
import { getFinancialsForStock } from '../data/mockData';

interface FinancialsProps {
  symbol: string;
}

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

export default function Financials({ symbol }: FinancialsProps) {
  const allFinancials = getFinancialsForStock(symbol);
  const [view, setView] = useState<'quarterly' | 'annual'>('quarterly');

  if (allFinancials.length === 0) {
    return (
      <div className="gf-section">
        <h3 className="gf-section-title">Financials</h3>
        <div className="gf-empty-state">
          <p>No financial data available for {symbol}</p>
        </div>
      </div>
    );
  }

  const quarterly = allFinancials.filter((f) => f.period.startsWith('Q'));
  const annual = allFinancials.filter((f) => f.period.startsWith('Annual'));
  const financials = view === 'quarterly' ? quarterly : annual;

  return (
    <div className="gf-section">
      <h3 className="gf-section-title">Financials — Income Statement</h3>

      <div className="gf-financials-tabs">
        <button
          className={`gf-fin-tab ${view === 'quarterly' ? 'active' : ''}`}
          onClick={() => setView('quarterly')}
        >
          Quarterly
        </button>
        <button
          className={`gf-fin-tab ${view === 'annual' ? 'active' : ''}`}
          onClick={() => setView('annual')}
        >
          Annual
        </button>
      </div>

      <table className="gf-financials-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>(USD)</th>
            {financials.map((f) => (
              <th key={f.period}>{f.period}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Revenue</td>
            {financials.map((f) => (
              <td key={f.period}>{formatCurrency(f.revenue)}</td>
            ))}
          </tr>
          <tr>
            <td>Operating Expense</td>
            {financials.map((f) => (
              <td key={f.period}>{formatCurrency(f.operatingExpense)}</td>
            ))}
          </tr>
          <tr>
            <td>Net Income</td>
            {financials.map((f) => (
              <td key={f.period} style={{ fontWeight: 500 }}>
                {formatCurrency(f.netIncome)}
              </td>
            ))}
          </tr>
          <tr>
            <td>Net Profit Margin</td>
            {financials.map((f) => (
              <td key={f.period}>{f.netProfitMargin.toFixed(2)}%</td>
            ))}
          </tr>
          <tr>
            <td>EPS</td>
            {financials.map((f) => (
              <td key={f.period}>${f.earningsPerShare.toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            <td>EBITDA</td>
            {financials.map((f) => (
              <td key={f.period}>{formatCurrency(f.ebitda)}</td>
            ))}
          </tr>
          <tr>
            <td>Effective Tax Rate</td>
            {financials.map((f) => (
              <td key={f.period}>{f.effectiveTaxRate.toFixed(1)}%</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
