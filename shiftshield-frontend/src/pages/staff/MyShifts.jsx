import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Activity, FileText } from 'lucide-react';
import api from '../../services/api';

export default function MyShifts() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyAssignments();
  }, []);

  const fetchMyAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shifts/my-assignments');
      setAssignments(res.data);
    } catch (err) {
      console.error("Failed to load shifts:", err);
      setError("Could not load your shift schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-indigo-600" />
          My Shift Schedule
        </h1>
        <p className="text-slate-500 text-sm mt-1">View your upcoming and past assignments.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-12 text-red-500 text-center">
            <p>{error}</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
            <Calendar className="w-12 h-12 mb-4 text-slate-300" />
            <p>You have no upcoming shifts assigned.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map(a => (
              <div key={a.id} className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-colors bg-slate-50/50">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border bg-green-50 text-green-700 border-green-200`}>
                    {a.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Shift #{a.shiftId}00
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Assigned Shift
                </h3>
                <p className="text-sm text-slate-600 mb-4 flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-slate-400" />
                  Your Role: {a.staffDesignation}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                  <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                    View Details
                  </button>
                  <button className="text-sm text-slate-500 hover:text-red-600 transition-colors">
                    Request Change
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
