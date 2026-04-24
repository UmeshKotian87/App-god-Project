import { Activity, Users, FileText, Calendar } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-home animate-fade-in">
      <div className="welcome-banner">
        <h2>Welcome back, Robert!</h2>
        <p>Your health status is looking good today. You have 2 upcoming appointments.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon heart"><Activity size={24}/></div>
          <div className="stat-info">
            <h3>Heart Rate</h3>
            <div className="stat-value">72 <span>bpm</span></div>
            <p className="stat-trend positive">Normal</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bp"><Users size={24}/></div>
          <div className="stat-info">
            <h3>Blood Pressure</h3>
            <div className="stat-value">120/80 <span>mmHg</span></div>
            <p className="stat-trend positive">Optimal</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon glucose"><Activity size={24}/></div>
          <div className="stat-info">
            <h3>Glucose Level</h3>
            <div className="stat-value">95 <span>mg/dL</span></div>
            <p className="stat-trend positive">Normal</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bmi"><Users size={24}/></div>
          <div className="stat-info">
            <h3>BMI</h3>
            <div className="stat-value">22.5</div>
            <p className="stat-trend positive">Healthy Weight</p>
          </div>
        </div>
      </div>

      <div className="dashboard-panels">
        <div className="upcoming-appointments card">
          <div className="panel-header">
            <h3>Upcoming Appointments</h3>
            <button className="btn-link">View All</button>
          </div>
          <div className="appointment-item">
            <div className="apt-date">
              <span className="month">APR</span>
              <span className="day">28</span>
            </div>
            <div className="apt-info">
              <h4>Dr. Sarah Chen</h4>
              <p>Cardiology Checkup • 10:00 AM</p>
            </div>
          </div>
          <div className="appointment-item">
            <div className="apt-date">
              <span className="month">MAY</span>
              <span className="day">12</span>
            </div>
            <div className="apt-info">
              <h4>Dr. Merry Dongol</h4>
              <p>Dermatology Review • 02:30 PM</p>
            </div>
          </div>
        </div>

        <div className="recent-reports card">
          <div className="panel-header">
            <h3>Recent Reports</h3>
            <button className="btn-link">View All</button>
          </div>
          <div className="report-item">
            <FileText size={20} className="report-icon" />
            <div className="report-info">
              <h4>Blood Test Results</h4>
              <p>Uploaded 2 days ago</p>
            </div>
            <button className="btn-download">Download</button>
          </div>
          <div className="report-item">
            <FileText size={20} className="report-icon" />
            <div className="report-info">
              <h4>ECG Scan</h4>
              <p>Uploaded 1 week ago</p>
            </div>
            <button className="btn-download">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}
