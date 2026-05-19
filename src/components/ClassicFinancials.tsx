import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useFundamentals } from '../hooks/useStockData';

interface ClassicFinancialsProps {
  symbol: string;
}

type ViewMode = 'quarterly' | 'annual';

function formatValue(value: number | null | undefined): string {
  if (value == null) return '\u2014';
  const abs = Math.abs(value);
  if (abs >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
}

function formatPercent(current: number | null | undefined, previous: number | null | undefined): string | null {
  if (current == null || previous == null || previous === 0) return null;
  const change = ((current - previous) / Math.abs(previous)) * 100;
  return `${change >= 0 ? '\u2191' : '\u2193'}${Math.abs(change).toFixed(2)}%`;
}

function formatPeriodLabel(endDate: string, mode: ViewMode): string {
  const d = new Date(endDate);
  if (mode === 'annual') return d.getFullYear().toString();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="cf-section">
      <button className="cf-section-header" onClick={() => setOpen(!open)}>
        <h3 className="cf-section-title">{title}</h3>
        <span className={`cf-chevron ${open ? 'open' : ''}`}>{open ? '\u25B2' : '\u25BC'}</span>
      </button>
      {open && <div className="cf-section-body">{children}</div>}
    </div>
  );
}

export default function ClassicFinancials({ symbol }: ClassicFinancialsProps) {
  const { data, loading } = useFundamentals(symbol);

  if (loading) {
    return (
      <div className="cf-container">
        <h2 className="cf-heading">Financials</h2>
        <div className="gf-loading">Loading financial data...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="cf-container">
        <h2 className="cf-heading">Financials</h2>
        <div className="gf-empty-state"><p>No financial data available</p></div>
      </div>
    );
  }

  return (
    <div className="cf-container">
      <h2 className="cf-heading">Financials</h2>
      <IncomeStatementSection data={data} />
      <BalanceSheetSection data={data} />
      <CashFlowSection data={data} />
    </div>
  );
}

function IncomeStatementSection({ data }: { data: NonNullable<ReturnType<typeof useFundamentals>['data']> }) {
  const [view, setView] = useState<ViewMode>('quarterly');

  const rawQ = data.incomeStatementHistoryQuarterly?.incomeStatementHistory || [];
  const rawA = data.incomeStatementHistory?.incomeStatementHistory || [];
  const statements = view === 'quarterly' ? rawQ : rawA;

  if (statements.length === 0) return null;

  const sorted = [...statements].sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
  const latest = sorted[sorted.length - 1];
  const prev = sorted.length >= 2 ? sorted[sorted.length - 2] : null;

  const chartData = sorted.map((s) => ({
    period: formatPeriodLabel(s.endDate, view),
    Revenue: s.totalRevenue ?? 0,
    'Net income': s.netIncome ?? 0,
  }));

  const margin = latest.totalRevenue ? ((latest.netIncome ?? 0) / latest.totalRevenue * 100) : 0;
  const opExpense = (latest.totalRevenue ?? 0) - (latest.operatingIncome ?? 0);

  const rows: Array<{ label: string; value: string; yoy: string | null }> = [
    { label: 'Revenue', value: formatValue(latest.totalRevenue), yoy: formatPercent(latest.totalRevenue, prev?.totalRevenue) },
    { label: 'Operating expense', value: formatValue(opExpense), yoy: formatPercent(opExpense, prev ? (prev.totalRevenue ?? 0) - (prev.operatingIncome ?? 0) : null) },
    { label: 'Net income', value: formatValue(latest.netIncome), yoy: formatPercent(latest.netIncome, prev?.netIncome) },
    { label: 'Net profit margin', value: `${margin.toFixed(2)}`, yoy: prev?.totalRevenue ? formatPercent(margin, (prev.netIncome ?? 0) / prev.totalRevenue * 100) : null },
    { label: 'EBITDA', value: formatValue(latest.ebit ?? latest.operatingIncome), yoy: formatPercent(latest.ebit ?? latest.operatingIncome, prev?.ebit ?? prev?.operatingIncome) },
  ];

  return (
    <CollapsibleSection title="Income Statement" defaultOpen={true}>
      <ViewToggle view={view} setView={setView} />
      <FinancialBarChart data={chartData} bars={[{ key: 'Revenue', color: '#4285f4' }, { key: 'Net income', color: '#fbbc04' }]} />
      <FinancialTable
        periodLabel={formatPeriodLabel(latest.endDate, view)}
        rows={rows}
      />
    </CollapsibleSection>
  );
}

function BalanceSheetSection({ data }: { data: NonNullable<ReturnType<typeof useFundamentals>['data']> }) {
  const [view, setView] = useState<ViewMode>('quarterly');

  const rawQ = data.balanceSheetHistoryQuarterly?.balanceSheetStatements || [];
  const rawA = data.balanceSheetHistory?.balanceSheetStatements || [];
  const statements = view === 'quarterly' ? rawQ : rawA;

  if (statements.length === 0) return null;

  const sorted = [...statements].sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
  const latest = sorted[sorted.length - 1];
  const prev = sorted.length >= 2 ? sorted[sorted.length - 2] : null;

  const chartData = sorted.map((s) => ({
    period: formatPeriodLabel(s.endDate, view),
    'Total assets': s.totalAssets ?? 0,
    'Total liabilities': s.totalLiab ?? 0,
  }));

  const cashAndInvestments = (latest.cash ?? 0) + (latest.shortTermInvestments ?? 0);
  const prevCashAndInvestments = prev ? (prev.cash ?? 0) + (prev.shortTermInvestments ?? 0) : null;

  const rows: Array<{ label: string; value: string; yoy: string | null }> = [
    { label: 'Cash and short-term investments', value: formatValue(cashAndInvestments || null), yoy: formatPercent(cashAndInvestments || null, prevCashAndInvestments) },
    { label: 'Total assets', value: formatValue(latest.totalAssets), yoy: formatPercent(latest.totalAssets, prev?.totalAssets) },
    { label: 'Total liabilities', value: formatValue(latest.totalLiab), yoy: formatPercent(latest.totalLiab, prev?.totalLiab) },
    { label: 'Total equity', value: formatValue(latest.totalStockholderEquity), yoy: formatPercent(latest.totalStockholderEquity, prev?.totalStockholderEquity) },
  ];

  return (
    <CollapsibleSection title="Balance Sheet">
      <ViewToggle view={view} setView={setView} />
      <FinancialBarChart data={chartData} bars={[{ key: 'Total assets', color: '#4285f4' }, { key: 'Total liabilities', color: '#fbbc04' }]} />
      <FinancialTable
        periodLabel={formatPeriodLabel(latest.endDate, view)}
        rows={rows}
      />
    </CollapsibleSection>
  );
}

function CashFlowSection({ data }: { data: NonNullable<ReturnType<typeof useFundamentals>['data']> }) {
  const [view, setView] = useState<ViewMode>('quarterly');

  const rawQ = data.cashflowStatementHistoryQuarterly?.cashflowStatements || [];
  const rawA = data.cashflowStatementHistory?.cashflowStatements || [];
  const statements = view === 'quarterly' ? rawQ : rawA;

  if (statements.length === 0) return null;

  const sorted = [...statements].sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
  const latest = sorted[sorted.length - 1];
  const prev = sorted.length >= 2 ? sorted[sorted.length - 2] : null;

  const freeCashFlow = (latest.totalCashFromOperatingActivities ?? 0) + (latest.capitalExpenditures ?? 0);
  const prevFCF = prev ? (prev.totalCashFromOperatingActivities ?? 0) + (prev.capitalExpenditures ?? 0) : null;

  const chartData = sorted.map((s) => ({
    period: formatPeriodLabel(s.endDate, view),
    'Operating cash flow': s.totalCashFromOperatingActivities ?? 0,
    'Capital expenditures': Math.abs(s.capitalExpenditures ?? 0),
  }));

  const rows: Array<{ label: string; value: string; yoy: string | null }> = [
    { label: 'Operating cash flow', value: formatValue(latest.totalCashFromOperatingActivities), yoy: formatPercent(latest.totalCashFromOperatingActivities, prev?.totalCashFromOperatingActivities) },
    { label: 'Capital expenditures', value: formatValue(latest.capitalExpenditures), yoy: formatPercent(latest.capitalExpenditures, prev?.capitalExpenditures) },
    { label: 'Free cash flow', value: formatValue(freeCashFlow), yoy: formatPercent(freeCashFlow, prevFCF) },
    { label: 'Financing cash flow', value: formatValue(latest.totalCashFromFinancingActivities), yoy: formatPercent(latest.totalCashFromFinancingActivities, prev?.totalCashFromFinancingActivities) },
  ];

  return (
    <CollapsibleSection title="Cash Flow">
      <ViewToggle view={view} setView={setView} />
      <FinancialBarChart data={chartData} bars={[{ key: 'Operating cash flow', color: '#4285f4' }, { key: 'Capital expenditures', color: '#fbbc04' }]} />
      <FinancialTable
        periodLabel={formatPeriodLabel(latest.endDate, view)}
        rows={rows}
      />
    </CollapsibleSection>
  );
}

function ViewToggle({ view, setView }: { view: ViewMode; setView: (v: ViewMode) => void }) {
  return (
    <div className="cf-view-toggle">
      <button className={`cf-toggle-btn ${view === 'quarterly' ? 'active' : ''}`} onClick={() => setView('quarterly')}>
        Quarterly
      </button>
      <button className={`cf-toggle-btn ${view === 'annual' ? 'active' : ''}`} onClick={() => setView('annual')}>
        Annual
      </button>
    </div>
  );
}

function FinancialBarChart({ data, bars }: { data: Array<Record<string, unknown>>; bars: Array<{ key: string; color: string }> }) {
  return (
    <div className="cf-chart">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#1a73e8' }} tickLine={false} axisLine={{ stroke: '#dadce0' }} />
          <YAxis tick={{ fontSize: 11, fill: '#5f6368' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => formatValue(v)} width={60} />
          <Tooltip formatter={(value: unknown) => formatValue(Number(value))} contentStyle={{ background: 'white', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '13px' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '13px', color: '#5f6368' }} />
          {bars.map((b) => (
            <Bar key={b.key} dataKey={b.key} fill={b.color} radius={[2, 2, 0, 0]} barSize={24} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function FinancialTable({ periodLabel, rows }: { periodLabel: string; rows: Array<{ label: string; value: string; yoy: string | null }> }) {
  return (
    <table className="cf-table">
      <thead>
        <tr>
          <th className="cf-table-label"></th>
          <th className="cf-table-value">{periodLabel}</th>
          <th className="cf-table-yoy">Y/Y CHANGE</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <td className="cf-table-label">{r.label}</td>
            <td className="cf-table-value">{r.value}</td>
            <td className={`cf-table-yoy ${r.yoy && r.yoy.startsWith('\u2191') ? 'gf-positive' : r.yoy && r.yoy.startsWith('\u2193') ? 'gf-negative' : ''}`}>
              {r.yoy ?? '\u2014'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
