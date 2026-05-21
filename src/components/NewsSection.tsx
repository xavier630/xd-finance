interface NewsSectionProps {
  symbol: string;
}

export default function NewsSection({ symbol: _symbol }: NewsSectionProps) {
  return (
    <div className="gf-section">
      <h3 className="gf-section-title">News</h3>
      <div className="gf-news-list">
        <div style={{ padding: '16px', color: '#999', fontSize: 14 }}>
          News integration coming soon.
        </div>
      </div>
    </div>
  );
}
