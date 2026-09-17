import React, { useState, useEffect } from 'react';
import { Clock, Briefcase, FileText, Calendar, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function StaffDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/metrics');
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to load staff dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8 font-medium text-slate-500">Loading your schedule...</div>;

  const assignments = metrics?.myUpcomingShifts || [];
  const upcoming = assignments.length; 
  const weeklyHours = metrics?.weeklyHours || 0;
  const pendingRequests = metrics?.pendingRequests || 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Staff Portal</h1>
        <p className="text-slate-500 text-sm mt-1">View your schedule and manage requests.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Upcoming Shifts</p>
            <h3 className="text-3xl font-bold text-slate-800">{upcoming}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-50 text-brand-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Hours this Week</p>
            <h3 className="text-3xl font-bold text-slate-800">{weeklyHours}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-teal-50 text-teal-500">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Pending Requests</p>
            <h3 className="text-3xl font-bold text-slate-800">{pendingRequests}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-50 text-amber-500">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">My Schedule</h2>
        </div>
        <div className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <th className="p-4">Shift ID</th>
                <th className="p-4">Staff Name</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-800">#{a.shiftId}</td>
                  <td className="p-4 text-sm text-slate-600 font-medium">{a.staffName}</td>
                  <td className="p-4 text-sm text-slate-600">{a.staffDesignation}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md flex items-center w-max">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {assignments.length === 0 && (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No upcoming shifts assigned.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
