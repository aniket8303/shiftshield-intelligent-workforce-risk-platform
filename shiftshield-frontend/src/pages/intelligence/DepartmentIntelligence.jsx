import React, { useState, useEffect } from 'react';
import { Building2, Users, AlertTriangle, Activity } from 'lucide-react';
import api from '../../services/api';

export default function DepartmentIntelligence() {
  const [departments, setDepartments] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [risks, setRisks] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deptRes, metricRes, riskRes, shiftRes] = await Promise.all([
          api.get('/departments'),
          api.get('/dashboard/metrics'),
          api.get('/risk/assessments'),
          api.get('/shifts')
        ]);
        setDepartments(deptRes.data);
        setMetrics(metricRes.data);
        setRisks(riskRes.data);
        setShifts(shiftRes.data);
      } catch (err) {
        console.error("Failed to load department intelligence:", err);
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
        <p className="font-semibold text-lg">Loading Department Intelligence...</p>
      </div>
    );
  }

  // Calculate department risk and coverage
  const deptStats = departments.map(dept => {
    const deptShifts = shifts.filter(s => s.departmentId === dept.id);
    const deptRisks = risks.filter(r => deptShifts.some(s => s.id === r.shiftId));
    
    const avgRisk = deptRisks.length > 0 
      ? Math.round(deptRisks.reduce((acc, r) => acc + r.riskScore, 0) / deptRisks.length) 
      : 0;

    let required = 0;
    let assigned = 0;
    deptShifts.forEach(s => {
      required += s.requiredStaffCount || 0;
      assigned += s.assignedStaffCount || 0;
    });
    
    const coverage = required > 0 ? Math.round((assigned / required) * 100) : 100;

    return {
      ...dept,
      shiftsCount: deptShifts.length,
      avgRisk,
      coverage,
      riskLevel: avgRisk > 60 ? 'HIGH' : avgRisk > 30 ? 'MEDIUM' : 'LOW'
    };
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Department Intelligence</h1>
        <p className="text-slate-500 text-sm mt-1">Cross-departmental operational metrics, staffing, and risk oversight.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deptStats.map(dept => (
          <div key={dept.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-brand-50 rounded-lg mr-3">
                  <Building2 className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{dept.name}</h3>
                  <p className="text-xs text-slate-500">ID: {dept.id}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold border ${
                dept.riskLevel === 'HIGH' ? 'bg-red-50 text-red-600 border-red-200' :
                dept.riskLevel === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                'bg-green-50 text-green-600 border-green-200'
              }`}>
                RISK: {dept.avgRisk}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 flex items-center">
                  <Users className="w-3 h-3 mr-1" /> Coverage
                </p>
                <div className="text-lg font-bold text-slate-800">{dept.coverage}%</div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Shifts
                </p>
                <div className="text-lg font-bold text-slate-800">{dept.shiftsCount} Active</div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-lg transition-colors border border-slate-200">
                View Deep Dive
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {deptStats.length === 0 && (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200 text-slate-500">
          No departments found in the organization.
        </div>
      )}
    </div>
  );
}
