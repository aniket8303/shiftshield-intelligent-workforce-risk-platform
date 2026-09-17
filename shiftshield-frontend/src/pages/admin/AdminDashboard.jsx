import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  AlertTriangle,
  Building2,
  UserCircle2,
  RefreshCw,
} from 'lucide-react';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [data, setData] = useState({
    organizations: 0,
    departments: 0,
    users: 0,
    staff: 0,
    riskRules: 0,
  });

  const [health, setHealth] = useState('CHECKING');
  const [loading, setLoading] = useState(true);
  const [healthLoading, setHealthLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/admin/dashboard/summary');

      setData({
        organizations: response.data.organizations ?? 0,
        departments: response.data.departments ?? 0,
        users: response.data.users ?? 0,
        staff: response.data.staff ?? 0,
        riskRules: response.data.riskRules ?? 0,
      });
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError('Failed to load system metrics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHealth = async () => {
    try {
      setHealthLoading(true);

      /*
       * Actuator is outside /api, so use the backend origin directly.
       * VITE_API_BASE_URL is expected to be:
       * http://localhost:8081/api
       */
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

      const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

      const response = await fetch(`${backendBaseUrl}/actuator/health`);

      if (!response.ok) {
        throw new Error(`Health endpoint returned ${response.status}`);
      }

      const result = await response.json();

      setHealth(result.status?.toUpperCase() || 'UNKNOWN');
    } catch (err) {
      console.error('Failed to check system health:', err);
      setHealth('DOWN');
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchHealth();
  }, []);

  const handleRefresh = () => {
    fetchDashboard();
    fetchHealth();
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Administration</h1>
            <p className="text-slate-500 text-sm mt-1">Loading system metrics...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
             <div className="h-32 bg-slate-100 rounded-xl"></div>
             <div className="h-32 bg-slate-100 rounded-xl"></div>
             <div className="h-32 bg-slate-100 rounded-xl"></div>
             <div className="h-32 bg-slate-100 rounded-xl"></div>
             <div className="h-32 bg-slate-100 rounded-xl"></div>
             <div className="h-32 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const healthDisplay =
    healthLoading
      ? 'Checking...'
      : health === 'UP'
        ? 'Operational'
        : health === 'DOWN'
          ? 'Unavailable'
          : health;

  const healthClass =
    health === 'UP'
      ? 'text-green-500'
      : health === 'DOWN'
        ? 'text-red-500'
        : 'text-amber-500';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            System Administration
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Manage platform configuration and user access.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || healthLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            className={`w-4 h-4 ${healthLoading ? 'animate-spin' : ''
              }`}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center border border-red-200">
          <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        {/* Organizations */}
        <Link
          to="/admin/organizations"
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Organizations
            </p>
            <h3 className="text-3xl font-bold text-slate-800">
              {data.organizations}
            </h3>
          </div>

          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-500">
            <Building2 className="w-6 h-6" />
          </div>
        </Link>

        {/* Departments */}
        <Link
          to="/admin/departments"
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-brand-300 transition-all cursor-pointer"
        >
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Departments
            </p>
            <h3 className="text-3xl font-bold text-slate-800">
              {data.departments}
            </h3>
          </div>

          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-50 text-brand-500">
            <Building2 className="w-6 h-6" />
          </div>
        </Link>

        {/* Users */}
        <Link
          to="/admin/users"
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-teal-300 transition-all cursor-pointer"
        >
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Users
            </p>
            <h3 className="text-3xl font-bold text-slate-800">
              {data.users}
            </h3>
          </div>

          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-teal-50 text-teal-500">
            <Users className="w-6 h-6" />
          </div>
        </Link>

        {/* Staff */}
        <Link
          to="/admin/staff"
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-purple-300 transition-all cursor-pointer"
        >
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Staff
            </p>
            <h3 className="text-3xl font-bold text-slate-800">
              {data.staff}
            </h3>
          </div>

          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-50 text-purple-500">
            <UserCircle2 className="w-6 h-6" />
          </div>
        </Link>

        {/* Risk Rules */}
        <Link
          to="/admin/risk-rules"
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-amber-300 transition-all cursor-pointer"
        >
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Risk Rules
            </p>
            <h3 className="text-3xl font-bold text-slate-800">
              {data.riskRules}
            </h3>
          </div>

          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-50 text-amber-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </Link>

        {/* Real System Health */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              System Health
            </p>

            <h3 className={`text-xl font-bold ${healthClass}`}>
              {healthDisplay}
            </h3>
          </div>

          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${health === 'UP'
                ? 'bg-green-50 text-green-500'
                : health === 'DOWN'
                  ? 'bg-red-50 text-red-500'
                  : 'bg-amber-50 text-amber-500'
              }`}
          >
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}