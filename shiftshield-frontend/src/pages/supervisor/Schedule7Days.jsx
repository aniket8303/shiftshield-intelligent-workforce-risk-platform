import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import api from '../../services/api';
import { Calendar, ChevronLeft, ChevronRight, AlertTriangle, Users } from 'lucide-react';

export default function Schedule7Days() {
  const [shifts, setShifts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Assignment Modal
  const [selectedShift, setSelectedShift] = useState(null);
  const [eligibleStaff, setEligibleStaff] = useState([]);
  const [assignments, setAssignments] = useState([]);
  
  // 7 days array
  const days = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchShifts();
  }, [startDate, selectedDept]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
      if (res.data.length > 0 && !selectedDept) {
        setSelectedDept(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchShifts = async () => {
    if (!selectedDept) return;
    setLoading(true);
    try {
      const startStr = format(days[0], 'yyyy-MM-dd');
      const endStr = format(days[6], 'yyyy-MM-dd');
      const res = await api.get(`/shifts?departmentId=${selectedDept}&startDate=${startStr}&endDate=${endStr}`);
      setShifts(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load shifts.');
    } finally {
      setLoading(false);
    }
  };

  const handleShiftClick = async (shift) => {
    setSelectedShift(shift);
    try {
      const [eligibleRes, assignRes] = await Promise.all([
        api.get(`/shifts/${shift.id}/eligible-staff`),
        api.get(`/shifts/${shift.id}/assignments`)
      ]);
      setEligibleStaff(eligibleRes.data);
      setAssignments(assignRes.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load shift details.');
    }
  };

  const assignStaff = async (staffId) => {
    try {
      await api.post(`/shifts/${selectedShift.id}/assignments`, { staffId });
      // Refresh details
      const [eligibleRes, assignRes] = await Promise.all([
        api.get(`/shifts/${selectedShift.id}/eligible-staff`),
        api.get(`/shifts/${selectedShift.id}/assignments`)
      ]);
      setEligibleStaff(eligibleRes.data);
      setAssignments(assignRes.data);
      fetchShifts(); // Refresh main board
    } catch (err) {
      alert(err.response?.data || 'Failed to assign staff.');
    }
  };

  const getShiftsForDayAndType = (day, type) => {
    return shifts.filter(s => {
      const sDate = new Date(s.startTime);
      return sDate.getDate() === day.getDate() && sDate.getMonth() === day.getMonth() && s.type === type;
    });
  };

  const shiftTypes = ['MORNING', 'AFTERNOON', 'NIGHT'];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-brand-600" />
            7-Day Schedule
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage weekly workforce assignments and load.</p>
        </div>
        
        <div className="flex items-center space-x-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
          <select 
            value={selectedDept} 
            onChange={e => setSelectedDept(e.target.value)}
            className="border-none text-sm font-medium focus:ring-0 text-slate-700 bg-transparent cursor-pointer"
          >
            <option value="">Select Department...</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <div className="h-6 border-l border-slate-300"></div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setStartDate(addDays(startDate, -7))} className="p-1 text-slate-400 hover:text-brand-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-slate-700 w-48 text-center">
              {format(days[0], 'MMM d')} - {format(days[6], 'MMM d, yyyy')}
            </span>
            <button onClick={() => setStartDate(addDays(startDate, 7))} className="p-1 text-slate-400 hover:text-brand-600 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center border border-red-200">
          <AlertTriangle className="w-5 h-5 mr-3" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading schedule...</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 border-r border-slate-200 w-32 font-semibold text-slate-600">Date</th>
                {shiftTypes.map(type => (
                  <th key={type} className="p-4 text-center font-semibold text-slate-600 capitalize w-1/3">{type.toLowerCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {days.map((day, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 border-r border-slate-200 bg-slate-50/50 font-medium text-slate-700">
                    <div className="text-xs text-slate-500 uppercase">{format(day, 'EEE')}</div>
                    <div className="text-lg">{format(day, 'd MMM')}</div>
                  </td>
                  {shiftTypes.map(type => {
                    const typeShifts = getShiftsForDayAndType(day, type);
                    return (
                      <td key={type} className="p-2 border-r border-slate-100 align-top">
                        {typeShifts.length === 0 ? (
                          <div className="p-3 text-center text-xs text-slate-400 italic">No shift scheduled</div>
                        ) : (
                          typeShifts.map(shift => (
                            <div 
                              key={shift.id} 
                              onClick={() => handleShiftClick(shift)}
                              className={`p-3 mb-2 rounded-lg cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md border ${
                                shift.status === 'FILLED' ? 'bg-green-50 border-green-200 hover:border-green-300' :
                                shift.status === 'PARTIAL' ? 'bg-amber-50 border-amber-200 hover:border-amber-300' :
                                'bg-red-50 border-red-200 hover:border-red-300'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                  shift.status === 'FILLED' ? 'bg-green-100 text-green-700' :
                                  shift.status === 'PARTIAL' ? 'bg-amber-100 text-amber-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {shift.status}
                                </span>
                                <span className="text-xs font-mono text-slate-500">
                                  {format(new Date(shift.startTime), 'HH:mm')} - {format(new Date(shift.endTime), 'HH:mm')}
                                </span>
                              </div>
                              <div className="flex items-center text-sm font-medium text-slate-700">
                                <Users className="w-4 h-4 mr-2 opacity-50" />
                                {shift.assignedStaffCount} / {shift.requiredStaffCount} Assigned
                              </div>
                            </div>
                          ))
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignment Modal */}
      {selectedShift && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Shift Assignments</h2>
                <p className="text-slate-500 text-sm mt-1">{selectedShift.departmentName} - {selectedShift.type}</p>
              </div>
              <button onClick={() => setSelectedShift(null)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Currently Assigned ({assignments.length}/{selectedShift.requiredStaffCount})</h3>
                {assignments.length === 0 ? (
                  <div className="p-4 bg-slate-50 text-slate-500 rounded-lg text-sm text-center border border-slate-100">No staff assigned yet.</div>
                ) : (
                  <div className="space-y-2">
                    {assignments.map(a => (
                      <div key={a.id} className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center group">
                        <div>
                          <p className="font-semibold text-slate-800">{a.staffName}</p>
                          <p className="text-xs text-slate-500">{a.staffDesignation}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full group-hover:hidden">Confirmed</span>
                          <button 
                            onClick={async () => {
                              try {
                                await api.delete(`/shifts/${selectedShift.id}/assignments/${a.id}`);
                                const [eligibleRes, assignRes] = await Promise.all([
                                  api.get(`/shifts/${selectedShift.id}/eligible-staff`),
                                  api.get(`/shifts/${selectedShift.id}/assignments`)
                                ]);
                                setEligibleStaff(eligibleRes.data);
                                setAssignments(assignRes.data);
                                fetchShifts();
                              } catch(err) {
                                alert('Failed to unassign staff.');
                              }
                            }}
                            className="hidden group-hover:block bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
                          >
                            Unassign
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Eligible Staff</h3>
                {eligibleStaff.length === 0 ? (
                  <div className="p-4 bg-slate-50 text-slate-500 rounded-lg text-sm text-center border border-slate-100">No available staff for this time block.</div>
                ) : (
                  <div className="space-y-2">
                    {eligibleStaff.map(staff => (
                      <div key={staff.id} className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center hover:border-brand-300 transition-colors">
                        <div>
                          <p className="font-semibold text-slate-800">{staff.firstName} {staff.lastName}</p>
                          <p className="text-xs text-slate-500">{staff.designation}</p>
                        </div>
                        <button 
                          onClick={() => assignStaff(staff.id)}
                          className="bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                        >
                          Assign
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
