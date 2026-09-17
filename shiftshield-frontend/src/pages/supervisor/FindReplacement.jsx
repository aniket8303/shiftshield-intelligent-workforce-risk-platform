import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Filter, CheckCircle2, 
  XCircle, Clock, Calendar, Activity
} from 'lucide-react';
import api from '../../services/api';

export default function FindReplacement() {
  const [searchParams] = useSearchParams();
  const shiftId = searchParams.get('shiftId');
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shiftId) return;

    const fetchEligibleStaff = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/shifts/${shiftId}/eligible-staff`);
        setStaffList(res.data);
      } catch (err) {
        console.error("Failed to load eligible staff:", err);
        setError("Failed to load eligible staff for this shift.");
      } finally {
        setLoading(false);
      }
    };
    fetchEligibleStaff();
  }, [shiftId]);

  const handleSelectStaff = (staffId) => {
    navigate(`/supervisor/simulator?shiftId=${shiftId}&staffId=${staffId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400">
        <Activity className="w-12 h-12 mb-4 animate-spin text-brand-500" />
        <p className="font-semibold text-lg">Searching for eligible staff...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link to={`/supervisor/risks?shiftId=${shiftId}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Shift Details
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Find Replacement Staff</h1>
            <p className="text-slate-500 text-sm mt-1">Select eligible staff for Shift #{shiftId}00</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            type="text" 
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            placeholder="Search by name or ID..."
          />
        </div>
        <div className="flex items-center space-x-2">
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-600 outline-none focus:border-brand-500">
            <option>All Roles</option>
            <option>Senior Nurse</option>
            <option>Registered Nurse</option>
          </select>
          <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staffList.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            No eligible staff found for this shift. Everyone is either assigned, resting, or over capacity.
          </div>
        ) : (
          staffList.map((person) => (
            <div key={person.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-brand-300 hover:shadow-md">
              <div className="px-5 py-3 border-b flex justify-between items-center bg-slate-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-200 to-brand-300 text-brand-700 flex items-center justify-center font-bold text-sm mr-3">
                    {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{person.firstName} {person.lastName}</h3>
                    <p className="text-xs text-slate-500">{person.designation || person.role}</p>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> ELIGIBLE
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="mb-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills / Details</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-brand-50 text-brand-700 text-xs px-2 py-1 rounded border border-brand-100">
                      Level {person.experienceLevel || 1}
                    </span>
                    <span className="bg-slate-50 text-slate-700 text-xs px-2 py-1 rounded border border-slate-200">
                      {person.departmentName}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button 
                    onClick={() => handleSelectStaff(person.id)}
                    className="w-full py-2.5 rounded-lg text-sm font-bold transition-all bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                  >
                    Select for Simulator
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
