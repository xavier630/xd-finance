import { getNewsForStock } from '../data/mockData';

interface NewsSectionProps {
  symbol: string;
}

export default function NewsSection({ symbol }: NewsSectionProps) {
  const news = getNewsForStock(symbol);

  return (
    <div className="gf-section">
      <h3 className="gf-section-title">News</h3>
      <div className="gf-news-list">
        {news.map((item) => (
          <div key={item.id} className="gf-news-item">
            <div className="gf-news-content">
              <div className="gf-news-source">
                <span>{item.source}</span>
                <span>&middot;</span>
                <span>{item.publishedAt}</span>
              </div>
              <div className="gf-news-title">{item.title}</div>
              <div className="gf-news-summary">{item.summary}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
