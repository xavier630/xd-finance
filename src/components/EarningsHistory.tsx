import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useEarnings } from '../hooks/useStockData';

interface EarningsHistoryProps {
  symbol: string;
}

function formatRevenue(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

export default function EarningsHistory({ symbol }: EarningsHistoryProps) {
  const { data: earnings, loading } = useEarnings(symbol);

  if (loading) {
    return (
      <div className="gf-section">
        <h3 className="gf-section-title">Earnings</h3>
        <div className="gf-loading">Loading earnings data...</div>
      </div>
    );
  }

  if (earnings.length === 0) {
    return (
      <div className="gf-section">
        <h3 className="gf-section-title">Earnings</h3>
        <div className="gf-empty-state">
          <p>No earnings data available for {symbol}</p>
        </div>
      </div>
    );
  }

  const chartData = [...earnings].reverse().map((e) => ({
    quarter: e.quarter,
    estimate: e.epsEstimate,
    actual: e.epsActual,
    surprise: e.epsSurprisePercent,
  }));

  return (
    <div className="gf-section">
      <h3 className="gf-section-title">Earnings</h3>

      <div className="gf-earnings-legend">
        <div className="gf-earnings-legend-item">
          <div className="gf-earnings-legend-dot" style={{ background: '#dadce0' }} />
          <span>EPS Estimate</span>
        </div>
        <div className="gf-earnings-legend-item">
          <div className="gf-earnings-legend-dot" style={{ background: '#0d904f' }} />
          <span>EPS Actual (Beat)</span>
        </div>
        <div className="gf-earnings-legend-item">
          <div className="gf-earnings-legend-dot" style={{ background: '#d93025' }} />
          <span>EPS Actual (Miss)</span>
        </div>
      </div>

      <div className="gf-earnings-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="quarter"
              tick={{ fontSize: 11, fill: '#80868b' }}
              tickLine={false}
              axisLine={{ stroke: '#dadce0' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#80868b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${v.toFixed(2)}`}
            />
            <Tooltip
              formatter={(value: unknown, name: unknown) => [
                `$${Number(value).toFixed(2)}`,
                name === 'estimate' ? 'EPS Estimate' : 'EPS Actual',
              ]}
              contentStyle={{
                background: 'white',
                border: '1px solid #dadce0',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            />
            <ReferenceLine y={0} stroke="#dadce0" />
            <Bar dataKey="estimate" fill="#dadce0" radius={[2, 2, 0, 0]} barSize={20} name="estimate" />
            <Bar
              dataKey="actual"
              radius={[2, 2, 0, 0]}
              barSize={20}
              name="actual"
              fill="#0d904f"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="gf-earnings-table">
        <thead>
          <tr>
            <th>Quarter</th>
            <th>Date</th>
            <th className="right">EPS Est.</th>
            <th className="right">EPS Actual</th>
            <th className="right">Surprise</th>
            <th className="right">Revenue Est.</th>
            <th className="right">Revenue Actual</th>
            <th className="right">Rev. Surprise</th>
          </tr>
        </thead>
        <tbody>
          {earnings.map((e) => (
            <tr key={e.quarter}>
              <td style={{ fontWeight: 500 }}>{e.quarter}</td>
              <td style={{ color: 'var(--gf-text-secondary)' }}>{e.date}</td>
              <td className="right">${e.epsEstimate.toFixed(2)}</td>
              <td className="right" style={{ fontWeight: 500 }}>
                ${e.epsActual.toFixed(2)}
              </td>
              <td className={`right ${e.epsSurprise >= 0 ? 'gf-positive' : 'gf-negative'}`}>
                {e.epsSurprise >= 0 ? '+' : ''}
                {e.epsSurprisePercent.toFixed(2)}%
              </td>
              <td className="right">{formatRevenue(e.revenueEstimate)}</td>
              <td className="right" style={{ fontWeight: 500 }}>
                {formatRevenue(e.revenueActual)}
              </td>
              <td className={`right ${e.revenueSurprise >= 0 ? 'gf-positive' : 'gf-negative'}`}>
                {e.revenueSurprise >= 0 ? '+' : ''}
                {formatRevenue(Math.abs(e.revenueSurprise))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
