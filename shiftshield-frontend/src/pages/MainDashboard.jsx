import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../index.css';
import { RiskTrendChart } from '../components/charts/RiskTrendChart';
import { StaffingCoverageChart } from '../components/charts/StaffingCoverageChart';
import { DepartmentRiskChart } from '../components/charts/DepartmentRiskChart';
import { AuditLogTable } from '../components/audit/AuditLogTable';
import Login from '../components/Login';
import SimulatorPanel from '../components/SimulatorPanel';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  
  const [currentView, setCurrentView] = useState('analytics'); // analytics, audit, simulator
  const [overview, setOverview] = useState({});
  const [riskTrends, setRiskTrends] = useState([]);
  const [staffing, setStaffing] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toasts, setToasts] = useState([]);
  const unreadCount = 2;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setRole(localStorage.getItem('userRole') || 'User');
      setUserName(localStorage.getItem('userName') || 'JD');
    }
  }, []);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, hiding: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, hiding: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, 4000);
  };

  const handleLoginSuccess = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
    setUserName(localStorage.getItem('userName') || 'JD');
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    showToast('Logged out successfully', 'success');
  };

  useEffect(() => {
    if (!isAuthenticated || currentView !== 'analytics') return;
    
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await api.get('/analytics/summary');
        setOverview(response.data.overview || {});
        setRiskTrends(response.data.riskTrends || []);
        setStaffing(response.data.staffing || []);
        setDepartments(response.data.departments || []);
      } catch (err) {
        console.warn('API fetch failed', err);
        showToast("Error loading analytics data.", "error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [isAuthenticated, currentView]);

  if (!isAuthenticated) {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} showToast={showToast} />
        {/* Global Toast Container */}
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast ${toast.type} ${toast.hiding ? 'hiding' : ''}`}>
              {toast.type === 'success' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
              {toast.type === 'error' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>}
              {toast.type === 'info' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>}
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          ShiftShield
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Dashboard
          </div>
          <div className={`nav-item ${currentView === 'analytics' ? 'active' : ''}`} onClick={() => setCurrentView('analytics')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            Analytics
          </div>
          <div className={`nav-item ${currentView === 'audit' ? 'active' : ''}`} onClick={() => setCurrentView('audit')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Audit Logs
          </div>
          <div className={`nav-item ${currentView === 'simulator' ? 'active' : ''}`} onClick={() => setCurrentView('simulator')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Simulator
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ overflowY: 'auto' }}>
        <header className="dashboard-header animate-fade-in">
          <div className="dashboard-title">
            <h1>{currentView === 'analytics' ? 'Analytics Center' : currentView === 'simulator' ? 'What-If Simulator' : 'Audit Logs'}</h1>
            <p>{currentView === 'analytics' ? 'Workforce & Operational Risk Metrics' : 'System Activity Trail'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => {
              setShowNotifications(!showNotifications);
              showToast("Opened Notifications Panel", "info");
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--danger-color)', color: 'white', fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="user-profile">
              <div className="avatar" style={{cursor: 'pointer'}} onClick={handleLogout}>{userName.charAt(0) || 'U'}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{userName}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{role}</div>
              </div>
            </div>
          </div>
        </header>

        {currentView === 'audit' ? (
          <div style={{ paddingBottom: '40px' }}>
            <AuditLogTable />
          </div>
        ) : currentView === 'simulator' ? (
          <div style={{ paddingBottom: '40px' }}>
            <SimulatorPanel showToast={showToast} />
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
             Loading Analytics...
          </div>
        ) : (
          <div style={{ paddingBottom: '40px' }}>
            {/* Top Metrics Grid */}
            <div className="metrics-grid" style={{ marginBottom: '24px' }}>
              <div className="metric-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="metric-title">Active Staff</div>
                <div className="metric-value">{overview.totalActiveStaff || 0}</div>
              </div>
              <div className="metric-card warning animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="metric-title">Open / Partial Shifts</div>
                <div className="metric-value">{overview.totalOpenShifts || 0}</div>
              </div>
              <div className="metric-card success animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="metric-title">Filled Shifts</div>
                <div className="metric-value">{overview.totalFilledShifts || 0}</div>
              </div>
              <div className="metric-card danger animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="metric-title">Critical Risk Shifts</div>
                <div className="metric-value">{overview.criticalRiskShifts || 0}</div>
              </div>
            </div>

            {/* Charts Area */}
            <div className="dashboard-sections" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
              
              {/* Risk Trend Chart */}
              <div className="panel animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="panel-header">Operational Risk Trend (30 Days)</div>
                <div style={{ padding: '20px 0' }}>
                  <RiskTrendChart data={riskTrends} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Staffing Coverage Chart */}
                <div className="panel animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <div className="panel-header">Staffing Coverage by Department</div>
                  <div style={{ padding: '20px 0' }}>
                    <StaffingCoverageChart data={staffing} />
                  </div>
                </div>

                {/* Department Risk Chart */}
                <div className="panel animate-fade-in" style={{ animationDelay: '0.7s' }}>
                  <div className="panel-header">Open Risks by Department</div>
                  <div style={{ padding: '20px 0' }}>
                    <DepartmentRiskChart data={departments} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Global Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type} ${toast.hiding ? 'hiding' : ''}`}>
            {toast.type === 'success' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
            {toast.type === 'error' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>}
            {toast.type === 'info' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
