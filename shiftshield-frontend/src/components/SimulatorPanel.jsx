import React, { useState } from 'react';
import api from '../api/axios';

const SimulatorPanel = ({ showToast }) => {
  const [shiftId, setShiftId] = useState('');
  const [staffIds, setStaffIds] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      // For demo purposes, the backend endpoint for simulation exists.
      // Expected JSON body: { shiftId, proposedStaffIds }
      const proposedIds = staffIds.split(',').map(s => s.trim()).filter(Boolean).map(Number);
      
      const response = await api.post('/simulations/calculate', {
        shiftId: Number(shiftId),
        proposedStaffIds: proposedIds
      });
      setResult(response.data);
      showToast('Simulation generated successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Simulation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel animate-fade-in" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>What-If Simulator</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Test staffing assignments without modifying the live schedule. Enter a Shift ID and a comma-separated list of proposed Staff IDs.
      </p>

      <form onSubmit={handleSimulate} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Shift ID</label>
          <input 
            type="number" 
            value={shiftId} 
            onChange={(e) => setShiftId(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--panel-border)', background: 'var(--main-bg)', color: 'var(--text-primary)' }}
            placeholder="e.g. 1"
            required
          />
        </div>
        <div style={{ flex: 2 }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Proposed Staff IDs (comma separated)</label>
          <input 
            type="text" 
            value={staffIds} 
            onChange={(e) => setStaffIds(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--panel-border)', background: 'var(--main-bg)', color: 'var(--text-primary)' }}
            placeholder="e.g. 1, 2, 3"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 24px', borderRadius: '6px', background: 'var(--accent-color)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500' }}
        >
          {loading ? 'Calculating...' : 'Run Simulation'}
        </button>
      </form>

      {result && (
        <div style={{ background: 'var(--main-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Simulation Results</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Projected Risk Score</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: result.riskLevel === 'CRITICAL' ? 'var(--danger-color)' : result.riskLevel === 'HIGH' ? 'var(--warning-color)' : 'var(--success-color)' }}>
                {result.riskScore} ({result.riskLevel})
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Staffing</div>
              <div style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                {result.assignedStaffCount} / {result.requiredStaffCount} Assigned
              </div>
              <div style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                {result.assignedSeniorCount} / {result.requiredSeniorCount} Seniors
              </div>
            </div>
          </div>
          {result.reasons && result.reasons.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>Risk Factors</div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--warning-color)' }}>
                {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulatorPanel;
