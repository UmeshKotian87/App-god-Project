import { 
  LayoutDashboard, Search, Heart, CalendarDays, FileText, Pill, 
  UserSquare, Shield, Beaker, Scale, Calendar, ScanFace, Activity, Brain,
  Settings, HelpCircle, MessageSquare, LogOut, Moon, Sun, History
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ darkMode, setDarkMode, activePage, setActivePage }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'find-doctor', icon: Search, label: 'Find Doctor' },
    { id: 'history', icon: History, label: 'Patient History', isNew: true },
    { id: 'medications', icon: Pill, label: 'Medication Calendar', isNew: false },
    { id: 'diabetes', icon: Activity, label: 'Diabetes Prediction' },
    { id: 'heart', icon: Heart, label: 'Heart Health' },
    { id: 'parkinsons', icon: Brain, label: 'Neurological Assessment' },
    { id: 'appointments', icon: CalendarDays, label: 'Appointments' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'skin', icon: ScanFace, label: 'Skin Disease Detection' },
    { id: 'bmi', icon: Scale, label: 'BMI Calculator' }
  ];

  const bottomItems = [
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help Center' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'logout', icon: LogOut, label: 'Log out' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="brand-logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="asclepius-icon">
            <path d="M12 2v20" />
            <path d="M12 22s-4-2-4-6 4-4 4-4-4-2-4-6 4-4 4-4" />
          </svg>
        </div>
        <div className="brand-logo-text">
          <span className="brand-med">Med</span><span className="brand-predict">Predict</span> <span className="brand-ai">AI</span>
        </div>
      </div>

      <div className="sidebar-scroll">
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a 
                key={item.id} 
                href="#" 
                className={`sidebar-link ${activePage === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(item.id);
                }}
              >
                <Icon size={20} className="sidebar-link-icon" />
                <span className="sidebar-link-text">{item.label}</span>
                {item.isNew && <span className="new-badge">NEW</span>}
              </a>
            );
          })}
        </nav>

        <div className="sidebar-divider"></div>

        <nav className="sidebar-nav">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.id} href="#" className="sidebar-link">
                <Icon size={20} className="sidebar-link-icon" />
                <span className="sidebar-link-text">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="dark-mode-toggle">
          {darkMode ? <Sun size={20} className="sidebar-link-icon" /> : <Moon size={20} className="sidebar-link-icon" />}
          <span className="sidebar-link-text">Dark Mode</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={darkMode} 
              onChange={() => setDarkMode(!darkMode)} 
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </aside>
  );
}
