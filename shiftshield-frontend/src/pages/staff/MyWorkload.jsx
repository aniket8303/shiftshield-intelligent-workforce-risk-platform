import React, { useState, useEffect } from 'react';
import { Activity, Briefcase, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function MyWorkload() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/metrics');
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to load staff workload", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400">
        <Activity className="w-12 h-12 mb-4 animate-spin text-brand-500" />
        <p className="font-semibold text-lg">Loading Workload Data...</p>
      </div>
    );
  }

  const weeklyHours = metrics?.weeklyHours || 0;
  const assignments = metrics?.myUpcomingShifts || [];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
          <Briefcase className="w-6 h-6 mr-2 text-indigo-600" />
          My Workload
        </h1>
        <p className="text-slate-500 text-sm mt-1">Track your hours and current operational load.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Hours Logged This Week</p>
            <div className="text-4xl font-bold text-slate-800">{weeklyHours} <span className="text-lg text-slate-400">hrs</span></div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-indigo-100 flex items-center justify-center text-indigo-600">
            <Activity className="w-8 h-8" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Workload Status</p>
            <div className={`text-2xl font-bold ${weeklyHours > 40 ? 'text-amber-500' : 'text-green-500'}`}>
              {weeklyHours > 40 ? 'Heavy Load' : 'Optimal'}
            </div>
          </div>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${weeklyHours > 40 ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'}`}>
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Recent Assignments Impacting Workload</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {assignments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No recent assignments found.</div>
          ) : (
            assignments.map(a => (
              <div key={a.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-slate-400 mr-3" />
                  <div>
                    <h3 className="font-bold text-slate-800">Shift #{a.shiftId}</h3>
                    <p className="text-xs text-slate-500">Role: {a.staffDesignation}</p>
                  </div>
                </div>
                <div className="text-sm font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded">
                  8 hours
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
