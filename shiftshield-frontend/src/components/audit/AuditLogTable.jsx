import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const MOCK_AUDIT_LOGS = [
  { id: 101, action: 'CREATE_SHIFT', entityType: 'Shift', entityId: 42, details: 'Created shift for department: Emergency, type: Night', timestamp: '2023-10-05T08:30:00', userFullName: 'John Doe', userEmail: 'jdoe@hospital.com' },
  { id: 102, action: 'ASSIGN_STAFF', entityType: 'ShiftAssignment', entityId: 88, details: 'Assigned staff mjane@hospital.com to shift ID: 42', timestamp: '2023-10-05T09:15:00', userFullName: 'John Doe', userEmail: 'jdoe@hospital.com' },
  { id: 103, action: 'ANALYZE_RISK', entityType: 'RiskAssessment', entityId: 210, details: 'Analyzed risk for Shift #42. Score: 45 (HIGH)', timestamp: '2023-10-05T09:16:00', userFullName: 'SYSTEM', userEmail: 'SYSTEM' },
  { id: 104, action: 'CREATE_DEPARTMENT', entityType: 'Department', entityId: 4, details: 'Created department: Neurology', timestamp: '2023-10-04T14:20:00', userFullName: 'Sarah Admin', userEmail: 'admin@hospital.com' },
];

export const AuditLogTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useRealData, setUseRealData] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await api.get('/audit-logs');
        setLogs(response.data);
        setUseRealData(true);
      } catch (err) {
        console.warn('API fetch failed, falling back to mock data for demo purposes', err);
        setLogs(MOCK_AUDIT_LOGS);
        setUseRealData(false);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading Audit Logs...</div>;
  }

  return (
    <div className="panel animate-fade-in">
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>System Audit Logs {useRealData ? '(Live Data)' : '(Demo Data)'}</span>
        <button style={{ padding: '6px 12px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Export CSV</button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Timestamp</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>User</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Action</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Entity</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No audit logs found.</td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--panel-border)' }}>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 500 }}>{log.userFullName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{log.userEmail}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontWeight: 'bold',
                      backgroundColor: log.action.includes('DELETE') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: log.action.includes('DELETE') ? '#ef4444' : '#3b82f6'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {log.entityType} <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>#{log.entityId}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                    {log.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
