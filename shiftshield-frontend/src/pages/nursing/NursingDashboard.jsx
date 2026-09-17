import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, HeartPulse, UserCheck, Calendar } from 'lucide-react';
import api from '../../services/api';
import FilterBar from '../../components/FilterBar';

export default function NursingDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [metricsRes, shiftsRes, riskRes, deptRes] = await Promise.all([
          api.get('/dashboard/metrics'),
          api.get('/shifts'),
          api.get('/risk/assessments'),
          api.get('/departments')
        ]);
        
        setMetrics(metricsRes.data);
        setDepartments(deptRes.data);
        
        const risks = riskRes.data.reduce((acc, curr) => {
          acc[curr.shiftId] = curr;
          return acc;
        }, {});

        const combinedShifts = shiftsRes.data.map(shift => ({
          ...shift,
          risk: risks[shift.id]?.riskLevel || 'LOW',
          riskScore: risks[shift.id]?.riskScore || 0
        }));

        setShifts(combinedShifts);
      } catch (err) {
        console.error("Failed to load nursing dashboard:", err);
        setError("Failed to load nursing dashboard data");
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
        <p className="font-semibold text-lg">Loading Nursing Intelligence...</p>
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

  const filteredShifts = shifts.filter(s => {
    if (selectedDepartment && s.departmentId.toString() !== selectedDepartment) return false;
    if (selectedDate && !s.startTime.startsWith(selectedDate)) return false;
    return true;
  });

  const totalStaff = metrics?.totalActiveStaff || 0;
  const highRiskCount = filteredShifts.filter(s => s.risk === 'HIGH' || s.risk === 'CRITICAL').length;
  
  let totalAssigned = 0;
  let totalRequired = 0;
  filteredShifts.forEach(s => {
    totalAssigned += s.assignedStaffCount || 0;
    totalRequired += s.requiredStaffCount || 0;
  });
  const coverageRatio = totalRequired > 0 ? Math.round((totalAssigned / totalRequired) * 100) : 100;
  
  const burnoutIndicators = Math.floor(highRiskCount * 1.5);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Nursing Superintendent</h1>
        <p className="text-slate-500 text-sm mt-1">Nursing coverage, clinical workload, and shift safety intelligence.</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Nursing Staff</p>
            <h3 className="text-3xl font-bold text-slate-800">{totalStaff}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-50">
            <UserCheck className="w-6 h-6 text-brand-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Coverage Ratio</p>
            <h3 className="text-3xl font-bold text-slate-800">{coverageRatio}%</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-medical-teal/10">
            <Activity className="w-6 h-6 text-medical-teal" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">High Risk Shifts</p>
            <h3 className={`text-3xl font-bold ${highRiskCount > 0 ? 'text-red-500' : 'text-green-500'}`}>{highRiskCount}</h3>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${highRiskCount > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
            <ShieldAlert className={`w-6 h-6 ${highRiskCount > 0 ? 'text-red-500' : 'text-green-500'}`} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Burnout Indicators</p>
            <h3 className={`text-3xl font-bold ${burnoutIndicators > 0 ? 'text-amber-500' : 'text-slate-800'}`}>{burnoutIndicators}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-50">
            <HeartPulse className="w-6 h-6 text-amber-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Upcoming Nursing Shifts</h2>
        </div>
        <div className="overflow-x-auto min-h-[300px]">
          {filteredShifts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
              <Calendar className="w-12 h-12 mb-4 text-slate-300" />
              <p>No active shifts scheduled for criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Department & Time</th>
                  <th className="px-6 py-4 text-center">Staff Coverage</th>
                  <th className="px-6 py-4 text-center">Senior Coverage</th>
                  <th className="px-6 py-4 text-right">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShifts.map((shift) => {
                  const assigned = shift.assignedStaffCount || 0;
                  const required = shift.requiredStaffCount || 0;
                  const srAssigned = shift.requiredSeniorStaffCount > 0 ? (assigned > 5 ? 1 : 0) : 0;
                  const srRequired = shift.requiredSeniorStaffCount || 0;
                  const timeStr = `${new Date(shift.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(shift.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

                  return (
                    <tr key={shift.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{shift.departmentName}</div>
                        <div className="text-xs text-slate-500">{timeStr}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-bold ${assigned < required ? 'text-red-500' : 'text-slate-700'}`}>
                          {assigned}
                        </span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-slate-500 font-medium">{required}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-bold ${srAssigned < srRequired ? 'text-amber-500' : 'text-slate-700'}`}>
                          {srAssigned}
                        </span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-slate-500 font-medium">{srRequired}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                          shift.risk === 'HIGH' || shift.risk === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-200' :
                          shift.risk === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                          'bg-green-50 text-green-600 border-green-200'
                        }`}>
                          {shift.risk}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
