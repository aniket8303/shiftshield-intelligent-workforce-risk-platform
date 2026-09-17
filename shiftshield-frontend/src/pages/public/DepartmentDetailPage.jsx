import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../components/public/Header';
import Footer from '../../components/public/Footer';
import api from '../../services/api';
import { ArrowLeft, Users, Clock, AlertTriangle, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function DepartmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [department, setDepartment] = useState(null);
  const [staff, setStaff] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        setLoading(true);
        let targetId = id;
        
        // If the id is not a number (e.g., 'emergency', 'icu'), find the department first
        if (isNaN(targetId)) {
          const allDeptsRes = await api.get('/departments');
          const matchedDept = allDeptsRes.data.find(d => 
            d.name.toLowerCase().replace(/\s+/g, '-') === targetId.toLowerCase() ||
            d.code?.toLowerCase() === targetId.toLowerCase()
          );
          
          if (!matchedDept) {
            setError('Department not found');
            setLoading(false);
            return;
          }
          targetId = matchedDept.id;
        }

        // Execute parallel requests with numeric ID
        const [deptRes, staffRes, shiftsRes] = await Promise.all([
          api.get(`/departments/${targetId}`),
          api.get(`/staff?departmentId=${targetId}`),
          api.get(`/shifts?departmentId=${targetId}`)
        ]);
        
        setDepartment(deptRes.data);
        setStaff(staffRes.data);
        setShifts(shiftsRes.data);
      } catch (err) {
        console.error('Error fetching department details:', err);
        setError('Failed to load department details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartmentData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{error || 'Department not found'}</h2>
          <button onClick={() => navigate('/departments')} className="text-blue-600 hover:underline">
            &larr; Back to Departments
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate metrics
  const activeShifts = shifts.filter(s => s.status === 'ACTIVE' || s.status === 'SCHEDULED');
  const totalRequiredStaff = activeShifts.reduce((acc, s) => acc + (s.requiredStaffCount || 0), 0);
  const totalAssignedStaff = activeShifts.reduce((acc, s) => acc + (s.assignedStaffCount || 0), 0);
  
  const riskColor = department.riskLevel === 'HIGH' ? 'text-red-600' 
                  : department.riskLevel === 'MEDIUM' ? 'text-amber-600' 
                  : 'text-teal-600';
  const riskBg = department.riskLevel === 'HIGH' ? 'bg-red-50' 
               : department.riskLevel === 'MEDIUM' ? 'bg-amber-50' 
               : 'bg-teal-50';

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-slate-900 pt-16 pb-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <Link to="/departments" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 text-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Departments
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">{department.name}</h1>
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${riskBg} ${riskColor}`}>
                  {department.riskLevel || 'STANDARD'} RISK
                </span>
              </div>
              <p className="text-lg text-slate-300 max-w-2xl">
                {department.description || "Critical workforce visibility and operational risk intelligence."}
              </p>
            </div>
            
            <div className="flex gap-4">
              <Link to="/contact" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
                Contact Unit Lead
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* SUMMARY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase">Unit Status</h3>
              <Activity className="w-5 h-5 text-teal-500" />
            </div>
            <p className="text-3xl font-black text-slate-900">{department.status || 'ACTIVE'}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase">Total Staff Pool</h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-black text-slate-900">{staff.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase">Req vs Assigned</h3>
              <Clock className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-slate-900">{totalAssignedStaff}</p>
              <span className="text-slate-500 font-medium">/ {totalRequiredStaff}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase">Operational Risk</h3>
              <ShieldAlert className={`w-5 h-5 ${riskColor}`} />
            </div>
            <p className={`text-3xl font-black ${riskColor}`}>{department.riskLevel || 'STANDARD'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CURRENT SHIFTS */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Current & Upcoming Shifts</h3>
              </div>
              <div className="p-6">
                {activeShifts.length === 0 ? (
                  <p className="text-slate-500 italic text-center py-8">No active shifts scheduled for this department.</p>
                ) : (
                  <div className="space-y-4">
                    {activeShifts.slice(0, 5).map(shift => (
                      <div key={shift.id} className="border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-900">{format(parseISO(shift.startTime), 'MMM dd, yyyy')}</p>
                          <p className="text-sm text-slate-500">
                            {format(parseISO(shift.startTime), 'HH:mm')} - {format(parseISO(shift.endTime), 'HH:mm')} ({shift.type})
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-xs font-bold text-slate-500 uppercase">Staffing</p>
                            <p className="text-sm font-semibold text-slate-900">{shift.assignedStaffCount}/{shift.requiredStaffCount}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${shift.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'}`}>
                            {shift.riskLevel || 'NORMAL'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RISK INTELLIGENCE */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Risk Intelligence Overview</h3>
              </div>
              <div className="p-6">
                {department.riskLevel === 'HIGH' ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <h4 className="font-bold">Elevated Operational Risk Detected</h4>
                    </div>
                    <p className="text-sm">This unit is currently flagged for high operational risk due to potential understaffing or compliance breaches. Login to the platform to view full risk factors.</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-teal-700 bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">No critical risk assessments found. Operations are within safe thresholds.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STAFF */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Assigned Staff Pool</h3>
              </div>
              <div className="p-0">
                {staff.length === 0 ? (
                  <p className="text-slate-500 italic text-center py-8">No staff assigned.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {staff.slice(0, 8).map(s => (
                      <li key={s.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{s.userFirstName} {s.userLastName}</p>
                            <p className="text-xs text-slate-500">{s.designation}</p>
                          </div>
                          {s.isActive ? (
                            <span className="w-2 h-2 rounded-full bg-teal-500" title="Active"></span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-300" title="Inactive"></span>
                          )}
                        </div>
                      </li>
                    ))}
                    {staff.length > 8 && (
                      <li className="p-4 text-center">
                        <span className="text-xs font-bold text-blue-600">+ {staff.length - 8} more staff members</span>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
            
            {/* RECOMMENDED ACTIONS */}
            <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6 text-white">
               <h3 className="text-lg font-bold mb-4">Required Actions</h3>
               <p className="text-slate-300 text-sm mb-6">
                 Authorized personnel must review the shift schedules and adjust allocations.
               </p>
               <div className="space-y-3">
                 <Link to="/login" className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-colors">
                   Review Staffing
                 </Link>
                 <Link to="/login" className="block w-full text-center px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-bold transition-colors">
                   Simulate Replacement
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
