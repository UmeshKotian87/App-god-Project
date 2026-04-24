import { useState, useEffect } from 'react';
import { Menu, Bell, ChevronDown, X, LogOut } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css';

export default function DashboardLayout({ children, activePage, setActivePage, user, onLogout }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSetActivePage = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const userName = user?.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className={`dashboard-layout ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className={`sidebar-wrapper ${sidebarOpen ? 'mobile-open' : ''}`}>
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} activePage={activePage} setActivePage={handleSetActivePage} onLogout={onLogout} />
      </div>
      
      <div className="dashboard-main">
        <header className="dashboard-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="header-right">
            <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="user-avatar">{userInitial}</div>
              <div className="user-info">
                <span className="user-name">{userName} <ChevronDown size={14} className="dropdown-icon"/></span>
              </div>
            </div>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <strong>{userName}</strong>
                  <span>{user?.email}</span>
                </div>
                <button className="dropdown-item logout" onClick={onLogout}>
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
            
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
}
