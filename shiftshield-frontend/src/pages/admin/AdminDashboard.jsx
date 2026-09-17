import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, AlertTriangle, Building2, UserCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState({
    organizations: 0,
    departments: 0,
    users: 0,
    staff: 0,
    riskRules: 0,
    loading: true
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/dashboard/summary');
        
        setData({
          organizations: res.data.organizations || 0,
          departments: res.data.departments || 0,
          users: res.data.users || 0,
          staff: res.data.staff || 0,
          riskRules: res.data.riskRules || 0,
          loading: false
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load system metrics.');
        setData(d => ({ ...d, loading: false }));
      }
    };
    fetchData();
  }, []);

  if (data.loading) return <div className="p-8 text-slate-500 font-medium">Loading System Dashboard...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Administration</h1>
        <p className="text-slate-500 text-sm mt-1">Manage platform configuration and user access.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center border border-red-200">
          <AlertTriangle className="w-5 h-5 mr-3" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/admin/organizations" className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Organizations</p>
            <h3 className="text-3xl font-bold text-slate-800">{data.organizations}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-500">
            <Building2 className="w-6 h-6" />
          </div>
        </Link>
        <Link to="/admin/departments" className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-brand-300 transition-all cursor-pointer">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Departments</p>
            <h3 className="text-3xl font-bold text-slate-800">{data.departments}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-50 text-brand-500">
            <Building2 className="w-6 h-6" />
          </div>
        </Link>
        <Link to="/admin/users" className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-teal-300 transition-all cursor-pointer">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Users</p>
            <h3 className="text-3xl font-bold text-slate-800">{data.users}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-teal-50 text-teal-500">
            <Users className="w-6 h-6" />
          </div>
        </Link>
        <Link to="/admin/staff" className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-purple-300 transition-all cursor-pointer">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Staff</p>
            <h3 className="text-3xl font-bold text-slate-800">{data.staff}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-50 text-purple-500">
            <UserCircle2 className="w-6 h-6" />
          </div>
        </Link>
        <Link to="/admin/risk-rules" className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-amber-300 transition-all cursor-pointer">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Risk Rules</p>
            <h3 className="text-3xl font-bold text-slate-800">{data.riskRules}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-50 text-amber-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </Link>
        {/* System health is decorative, no route currently */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">System Health</p>
            <h3 className="text-xl font-bold text-green-500">Optimal</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-50 text-green-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

