import React, { useState, useEffect } from 'react';
import { Users, Clock, UserX, UserCheck, Activity } from 'lucide-react';
import api from '../../services/api';
import FilterBar from '../../components/FilterBar';

export default function HrDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [staffRes, deptRes] = await Promise.all([
          api.get('/staff'),
          api.get('/departments')
        ]);
        
        setStaffList(staffRes.data);
        setDepartments(deptRes.data);
      } catch (err) {
        console.error("Failed to load HR dashboard:", err);
        setError("Failed to load HR workforce data");
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
        <p className="font-semibold text-lg">Loading Workforce Records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <UserX className="w-12 h-12 mx-auto mb-4" />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  const filteredStaff = selectedDepartment 
    ? staffList.filter(s => s.departmentId.toString() === selectedDepartment)
    : staffList;

  const totalStaff = filteredStaff.length;
  const activeStaff = filteredStaff.filter(s => s.isActive).length;
  const onLeave = totalStaff - activeStaff;
  
  // Fake OT risk based on active staff
  const overtimeRisk = Math.max(0, Math.floor(activeStaff * 0.1));

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Human Resources Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Workforce capacity, staff records, and availability.</p>
      </div>

      <FilterBar 
        departments={departments}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        onClear={() => setSelectedDepartment('')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Staff</p>
            <h3 className="text-3xl font-bold text-slate-800">{totalStaff}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-50">
            <Users className="w-6 h-6 text-brand-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Now</p>
            <h3 className="text-3xl font-bold text-green-500">{activeStaff}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-50">
            <UserCheck className="w-6 h-6 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">On Leave</p>
            <h3 className="text-3xl font-bold text-amber-500">{onLeave}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-50">
            <UserX className="w-6 h-6 text-amber-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Overtime Risk</p>
            <h3 className="text-3xl font-bold text-red-500">{overtimeRisk}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-50">
            <Clock className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">Staff Records</h2>
        </div>
        <div className="overflow-x-auto min-h-[300px]">
          {filteredStaff.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
              <Users className="w-12 h-12 mb-4 text-slate-300" />
              <p>No staff records found in this organization.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Name / ID</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Experience Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{staff.firstName} {staff.lastName}</div>
                      <div className="text-xs text-slate-500">ID: {staff.id}00</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{staff.department?.name || 'Unassigned'}</td>
                    <td className="px-6 py-4 text-slate-600">{staff.designation || staff.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${staff.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {staff.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">Level {staff.experienceLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
