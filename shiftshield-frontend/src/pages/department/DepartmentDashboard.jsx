import React, { useState, useEffect } from 'react';
import { Users, Activity, Clock, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import FilterBar from '../../components/FilterBar';

export default function DepartmentDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShiftType, setSelectedShiftType] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/metrics');
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to load department dashboard", err);
        setError("Failed to load department metrics.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 font-medium text-slate-500">Loading Department Overview...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Department Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Monitor staff, shifts, and departmental operations.</p>
      </div>

      <FilterBar 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedShiftType={selectedShiftType}
        setSelectedShiftType={setSelectedShiftType}
        selectedRisk={selectedRisk}
        setSelectedRisk={setSelectedRisk}
        onClear={() => {
          setSelectedDate('');
          setSelectedShiftType('');
          setSelectedRisk('');
        }}
      />
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center border border-red-200">
          <AlertTriangle className="w-5 h-5 mr-3" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Staff</p>
            <h3 className="text-3xl font-bold text-slate-800">{metrics?.totalActiveStaff || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-50 text-brand-500">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Open Shifts</p>
            <h3 className="text-3xl font-bold text-slate-800">{metrics?.totalOpenShifts || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-teal-50 text-teal-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Coverage Gaps</p>
            <h3 className="text-3xl font-bold text-amber-500">{metrics?.understaffedShifts || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-50 text-amber-500">
            <Activity className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">High Risk Alerts</p>
            <h3 className="text-3xl font-bold text-red-500">{metrics?.highRiskShifts || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-50 text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Placeholder for Recent Shifts Table or List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Recent Department Operations</h2>
        </div>
        <div className="p-8 text-center text-slate-500">
          Implement specific table view with `metrics?.upcomingShifts` here.
        </div>
      </div>
    </div>
  );
}
