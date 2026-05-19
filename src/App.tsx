import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MarketBar from './components/MarketBar';
import Sidebar from './components/Sidebar';
import WatchlistPage from './components/WatchlistPage';
import StockDetailPage from './components/StockDetailPage';
import { WatchlistProvider } from './context/WatchlistContext';

export default function App() {
  return (
    <WatchlistProvider>
    <Router>
      <div>
        <Header />
        <MarketBar />
        <div className="gf-layout">
          <Sidebar />
          <main className="gf-main">
            <Routes>
              <Route path="/" element={<WatchlistPage />} />
              <Route path="/quote/:symbol" element={<StockDetailPage />} />
              <Route path="/markets" element={<WatchlistPage />} />
            </Routes>
          </main>
        </div>
        <footer className="gf-footer">
          <span>Google Finance Clone &mdash; Mock Data Only</span>
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
