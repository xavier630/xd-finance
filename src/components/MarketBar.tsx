import { marketIndices } from '../data/mockData';

export default function MarketBar() {
  return (
    <div className="gf-market-bar">
      {marketIndices.map((index) => (
        <div key={index.symbol} className="gf-market-item">
          <div className="gf-market-item-name">{index.name}</div>
          <div className="gf-market-item-value">
            {index.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div
            className={`gf-market-item-change ${index.change >= 0 ? 'gf-positive' : 'gf-negative'}`}
          >
            {index.change >= 0 ? '+' : ''}
            {index.change.toFixed(2)} ({index.change >= 0 ? '+' : ''}
            {index.changePercent.toFixed(2)}%)
          </div>
        </div>
      ))}
    </div>
  );
}
