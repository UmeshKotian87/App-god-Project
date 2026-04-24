import { useState, useEffect } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import BMICalculator from './pages/BMICalculator';
import SkinDisease from './pages/SkinDisease';
import FindDoctor from './pages/FindDoctor';
import HeartDisease from './pages/HeartDisease';
import DiabetesPredictor from './pages/DiabetesPredictor';
import ParkinsonsPredictor from './pages/ParkinsonsPredictor';
import MedicineCalendar from './pages/MedicineCalendar';
import PatientHistory from './pages/PatientHistory';
import AuthPage from './pages/AuthPage';
import AIBot from './components/AIBot';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const session = localStorage.getItem('medpredict_session');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.loggedIn) {
        setIsAuthenticated(true);
        setUser(parsed);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('medpredict_session');
    setIsAuthenticated(false);
    setUser(null);
    setActivePage('dashboard');
  };

  // Show auth page if not logged in
  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <>
      <DashboardLayout 
        activePage={activePage} 
        setActivePage={setActivePage} 
        user={user}
        onLogout={handleLogout}
      >
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'bmi' && <BMICalculator />}
        {activePage === 'skin' && <SkinDisease />}
        {activePage === 'find-doctor' && <FindDoctor />}
        {activePage === 'heart' && <HeartDisease />}
        {activePage === 'diabetes' && <DiabetesPredictor />}
        {activePage === 'parkinsons' && <ParkinsonsPredictor />}
        {activePage === 'medications' && <MedicineCalendar />}
        {activePage === 'history' && <PatientHistory />}
        {activePage === 'appointments' && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2>Appointments</h2>
            <p>Your upcoming and past appointments will be listed here.</p>
          </div>
        )}
        {activePage === 'reports' && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2>Medical Reports</h2>
            <p>Access your lab results, prescriptions, and health records here.</p>
          </div>
        )}
      </DashboardLayout>
      <AIBot />
    </>
  );
}

export default App;
