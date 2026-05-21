import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MarketBar from './components/MarketBar';
import WatchlistPage from './components/WatchlistPage';
import StockDetailPage from './components/StockDetailPage';
import { WatchlistProvider } from './context/WatchlistContext';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export default function App() {
  return (
    <WatchlistProvider>
    <Router basename={basename}>
      <div>
        <Header />
        <div className="gf-market-nav">
          <span className="gf-market-nav-label">MARKETS</span>
          <span className="gf-market-nav-link active">US</span>
          <span className="gf-market-nav-link">Europe</span>
          <span className="gf-market-nav-link">Asia</span>
          <span className="gf-market-nav-link">Currencies</span>
          <span className="gf-market-nav-link">Crypto</span>
          <span className="gf-market-nav-link">Futures</span>
        </div>
        <MarketBar />
        <main className="gf-main-classic">
          <Routes>
            <Route path="/" element={<WatchlistPage />} />
            <Route path="/quote/:symbol" element={<StockDetailPage />} />
          </Routes>
        </main>
        <footer className="gf-footer">
          <span>XD Finance &mdash; Powered by Yahoo Finance</span>
          <a href="#">Help</a>
          <a href="#">Send feedback</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Disclaimer</a>
        </footer>
      </div>
    </Router>
    </WatchlistProvider>
  );
}
