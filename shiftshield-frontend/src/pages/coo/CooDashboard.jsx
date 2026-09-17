import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import FilterBar from '../../components/FilterBar';

export default function CooDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [actions, setActions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [metricsRes, riskRes, shiftsRes, deptRes] = await Promise.all([
          api.get('/dashboard/metrics'),
          api.get('/risk/assessments'),
          api.get('/shifts'),
          api.get('/departments')
        ]);
        
        setMetrics(metricsRes.data);
        setDepartments(deptRes.data);
        
        // Build map of shift ID to shift Details
        const shiftsMap = shiftsRes.data.reduce((acc, curr) => {
          acc[curr.id] = curr;
          return acc;
        }, {});

        // Map risk assessments to operational actions for the COO
        const highRisks = riskRes.data.filter(r => r.riskLevel === 'HIGH' || r.riskLevel === 'CRITICAL');
        
        const mappedActions = highRisks.map((risk, index) => {
          const shift = shiftsMap[risk.shiftId] || {};
          let issue = "Coverage gap detected";
          if (risk.reasons && risk.reasons.length > 0) {
            issue = risk.reasons[0]; // Use primary risk reason
          }
          
          return {
            id: index + 1,
            shiftId: risk.shiftId,
            departmentId: shift.departmentId,
            department: shift.departmentName || 'General',
            startTime: shift.startTime,
            issue: issue,
            status: 'Open',
            owner: 'Supervisor'
          };
        });

        setActions(mappedActions);
      } catch (err) {
        console.error("Failed to load COO dashboard:", err);
        setError("Failed to load operational data");
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
        <p className="font-semibold text-lg">Loading Enterprise Intelligence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <ShieldAlert className="w-12 h-12 mx-auto mb-4" />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  const filteredActions = actions.filter(a => {
    if (selectedDepartment && a.departmentId && a.departmentId.toString() !== selectedDepartment) return false;
    if (selectedDate && a.startTime && !a.startTime.startsWith(selectedDate)) return false;
    return true;
  });

  const criticalRisks = metrics?.criticalRiskShifts || 0;
  const highRisks = metrics?.highRiskShifts || 0;
  const coverageGaps = metrics?.totalOpenShifts || 0;
  const pendingActions = filteredActions.length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">COO Operations Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Hospital-wide risk mitigation and department performance.</p>
      </div>

      <FilterBar 
        departments={departments}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onClear={() => {
          setSelectedDepartment('');
          setSelectedDate('');
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Critical Risks</p>
            <h3 className="text-3xl font-bold text-red-500">{criticalRisks}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-50">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">High Risks</p>
            <h3 className="text-3xl font-bold text-amber-500">{highRisks}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-50">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Coverage Gaps</p>
            <h3 className="text-3xl font-bold text-slate-800">{coverageGaps}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-50">
            <Activity className="w-6 h-6 text-slate-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Pending Actions</p>
            <h3 className="text-3xl font-bold text-brand-600">{pendingActions}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-50">
            <FileText className="w-6 h-6 text-brand-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Operational Corrective Actions</h2>
        </div>
        <div className="overflow-x-auto min-h-[300px]">
          {filteredActions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
              <CheckCircle2 className="w-12 h-12 mb-4 text-green-400" />
              <p>No corrective actions required. Operations are stable.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Issue / Primary Risk Factor</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActions.map(action => (
                  <tr key={action.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{action.department}</div>
                      <div className="text-xs text-slate-500">Shift #{action.shiftId}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm max-w-md truncate">{action.issue}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{action.owner}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                        action.status === 'Open' ? 'bg-red-50 text-red-600 border-red-200' :
                        action.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        'bg-green-50 text-green-600 border-green-200'
                      }`}>
                        {action.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
