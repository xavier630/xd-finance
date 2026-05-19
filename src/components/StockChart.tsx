import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getChartData } from '../data/mockData';
import { getCurrencySymbol } from '../utils/currency';
import type { ChartTimeframe, CurrencyCode } from '../types';

const timeframes: ChartTimeframe[] = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'MAX'];

interface StockChartProps {
  symbol: string;
  currentPrice: number;
  change: number;
  currency: CurrencyCode;
}

export default function StockChart({ symbol, currentPrice, change, currency }: StockChartProps) {
  const [activeTimeframe, setActiveTimeframe] = useState<ChartTimeframe>('1Y');
  const data = getChartData(symbol, activeTimeframe);
  const isPositive = change >= 0;
  const color = isPositive ? '#0d904f' : '#d93025';
  const fillColor = isPositive ? '#e6f4ea' : '#fce8e6';

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (activeTimeframe === '1D' || activeTimeframe === '5D') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    if (activeTimeframe === '1M' || activeTimeframe === '6M' || activeTimeframe === 'YTD') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }

  const sym = getCurrencySymbol(currency);

  function formatPrice(value: number): string {
    return `${sym}${value.toFixed(2)}`;
  }

  return (
    <div className="gf-chart-section">
      <div className="gf-chart-header">
        <div style={{ fontSize: 13, color: 'var(--gf-text-secondary)' }}>
          {symbol} &middot; {activeTimeframe}
        </div>
        <div className="gf-chart-timeframes">
          {timeframes.map((tf) => (
            <button
              key={tf}
              className={`gf-timeframe-btn ${activeTimeframe === tf ? 'active' : ''}`}
              onClick={() => setActiveTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="gf-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillColor} stopOpacity={0.8} />
                <stop offset="100%" stopColor={fillColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: '#80868b' }}
              tickLine={false}
              axisLine={{ stroke: '#dadce0' }}
              interval="preserveStartEnd"
              minTickGap={60}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={formatPrice}
              tick={{ fontSize: 11, fill: '#80868b' }}
              tickLine={false}
              axisLine={false}
              width={70}
            />
            <Tooltip
              formatter={(value: unknown) => [formatPrice(Number(value)), 'Price']}
              labelFormatter={(label: unknown) => {
                const date = new Date(String(label));
                return date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
              }}
              contentStyle={{
                background: 'white',
                border: '1px solid #dadce0',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                fontSize: '13px',
              }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${symbol})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: 'white', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 0 0',
          fontSize: 12,
          color: 'var(--gf-text-tertiary)',
        }}
      >
        <span>Current: {formatPrice(currentPrice)}</span>
        {data.length > 0 && (
          <span>
            Period start: {formatPrice(data[0].close)} &rarr; End: {formatPrice(data[data.length - 1].close)}
          </span>
        )}
      </div>
    </div>
  );
}
