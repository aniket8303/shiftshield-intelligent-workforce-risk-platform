import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import api from '../../services/api';

export default function ActionIntelligence() {
  const [shifts, setShifts] = useState([]);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [shiftRes, riskRes] = await Promise.all([
          api.get('/shifts'),
          api.get('/risk/assessments')
        ]);
        setShifts(shiftRes.data);
        setRisks(riskRes.data);
      } catch (err) {
        console.error("Failed to load actions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400">
        <Activity className="w-12 h-12 mb-4 animate-spin text-brand-500" />
        <p className="font-semibold text-lg">Scanning Operational Environment...</p>
      </div>
    );
  }

  // Generate Actionable items from risks and shifts
  const actionableItems = [];

  risks.forEach(risk => {
    if (risk.riskLevel === 'HIGH' || risk.riskLevel === 'CRITICAL') {
      const shift = shifts.find(s => s.id === risk.shiftId);
      if (shift) {
        actionableItems.push({
          id: `risk-${risk.id}`,
          type: 'RISK',
          priority: risk.riskLevel === 'CRITICAL' ? 1 : 2,
          department: shift.departmentName,
          shiftId: shift.id,
          reason: risk.reasons?.[0] || 'High operational risk detected',
          action: 'Find Replacement or Run Simulation'
        });
      }
    }
  });

  shifts.forEach(shift => {
    const required = shift.requiredStaffCount || 0;
    const assigned = shift.assignedStaffCount || 0;
    if (assigned < required) {
      actionableItems.push({
        id: `shift-${shift.id}`,
        type: 'STAFFING',
        priority: 1, // High priority for unstaffed
        department: shift.departmentName,
        shiftId: shift.id,
        reason: `Staffing deficit: ${assigned}/${required} assigned`,
        action: 'Schedule Additional Staff'
      });
    }
  });

  // Sort by priority
  actionableItems.sort((a, b) => a.priority - b.priority);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Operational Action Center</h1>
        <p className="text-slate-500 text-sm mt-1">Review and resolve critical operational bottlenecks.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-red-500" /> Action Queue
          </h2>
          <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-xs">
            {actionableItems.length} Pending
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {actionableItems.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">All Systems Operational</h3>
              <p>No critical actions required at this time.</p>
            </div>
          ) : (
            actionableItems.map(item => (
              <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start">
                  <div className={`mt-1 p-2 rounded-lg mr-4 ${item.priority === 1 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide ${item.type === 'RISK' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {item.type} ISSUE
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 mt-2">{item.department} - Shift #{item.shiftId}</h3>
                    <p className="text-slate-600 text-sm mt-1">{item.reason}</p>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <button className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                    {item.action} <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
