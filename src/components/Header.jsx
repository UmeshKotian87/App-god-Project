import { Activity } from 'lucide-react';
import './Header.css';

export default function Header() {
  return (
    <header className="header glass-panel">
      <div className="header-container">
        <div className="logo-container">
          <div className="logo-icon-bg">
            <Activity className="logo-icon" size={28} />
          </div>
          <h1 className="logo-text">
            MedPredict <span className="text-gradient">AI</span>
          </h1>
        </div>
        <nav className="main-nav">
          <a href="#" className="nav-link active">Dashboard</a>
          <a href="#" className="nav-link">Predictions</a>
          <a href="#" className="nav-link">Tools</a>
          <a href="#" className="nav-link">About</a>
        </nav>
        <button className="btn-primary">
          Get Started
        </button>
      </div>
    </header>
  );
}
