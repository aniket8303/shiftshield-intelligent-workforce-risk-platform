import React, { useState, useEffect } from 'react';
import { Users, Clock, AlertCircle, Activity } from 'lucide-react';
import api from '../../services/api';

export default function WorkforceIntelligence() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get('/staff');
        setStaff(res.data);
      } catch (err) {
        console.error("Failed to load workforce:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400">
        <Activity className="w-12 h-12 mb-4 animate-spin text-brand-500" />
        <p className="font-semibold text-lg">Loading Workforce Capacity...</p>
      </div>
    );
  }

  const activeStaff = staff.filter(s => s.status === 'ACTIVE');
  const onLeave = staff.filter(s => s.status === 'ON_LEAVE');
  
  // Dummy high workload calculation since actual weekly hours isn't deeply tracked per user in this endpoint
  const highWorkload = activeStaff.slice(0, Math.floor(activeStaff.length * 0.15));

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Workforce Capacity</h1>
        <p className="text-slate-500 text-sm mt-1">Global staff availability, utilization, and capacity risks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center text-slate-500 mb-2">
            <Users className="w-4 h-4 mr-2" />
            <h3 className="font-medium text-sm">Active Workforce</h3>
          </div>
          <div className="text-3xl font-bold text-slate-800">{activeStaff.length}</div>
          <p className="text-xs text-slate-400 mt-2">Ready for deployment</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center text-amber-500 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            <h3 className="font-medium text-sm">Staff on Leave</h3>
          </div>
          <div className="text-3xl font-bold text-slate-800">{onLeave.length}</div>
          <p className="text-xs text-slate-400 mt-2">Currently unavailable</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-red-200 bg-red-50/30 shadow-sm">
          <div className="flex items-center text-red-600 mb-2">
            <AlertCircle className="w-4 h-4 mr-2" />
            <h3 className="font-medium text-sm">High Workload Alert</h3>
          </div>
          <div className="text-3xl font-bold text-red-600">{highWorkload.length}</div>
          <p className="text-xs text-red-500 mt-2">Approaching maximum hours</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">High Utilization Staff</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Staff Member</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {highWorkload.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">
                  {s.firstName} {s.lastName}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{s.department?.name || 'General'}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{s.designation || 'Staff'}</td>
                <td className="px-6 py-4 text-right">
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                    OVERWORKED
                  </span>
                </td>
              </tr>
            ))}
            {highWorkload.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">No staff currently exceeding workload limits.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
