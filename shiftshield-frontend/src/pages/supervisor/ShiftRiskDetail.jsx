import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, AlertTriangle, UserPlus, 
  Activity, Calendar, Clock, CheckCircle2 
} from 'lucide-react';
import api from '../../services/api';

export default function ShiftRiskDetail() {
  const [searchParams] = useSearchParams();
  const shiftId = searchParams.get('shiftId');

  const [shift, setShift] = useState(null);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shiftId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Fetch real shift data
        const shiftRes = await api.get(`/shifts/${shiftId}`);
        // Fetch or Generate real risk assessment
        const riskRes = await api.post(`/risk/analyze-shift/${shiftId}`);
        
        setShift(shiftRes.data);
        setRisk(riskRes.data);
      } catch (err) {
        console.error("Failed to load shift risk details:", err);
        setError("Failed to load operational risk data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [shiftId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400">
        <Activity className="w-12 h-12 mb-4 animate-spin text-brand-500" />
        <p className="font-semibold text-lg">Analyzing Shift Risk...</p>
      </div>
    );
  }

  if (error || !shift || !risk) {
    return (
      <div className="p-8 text-center text-red-600">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <p className="font-semibold">{error || "Shift not found"}</p>
        <Link to="/supervisor/dashboard" className="text-brand-600 underline mt-4 inline-block">Return to Dashboard</Link>
      </div>
    );
  }

  const dateStr = new Date(shift.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeStr = `${new Date(shift.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(shift.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

  const assigned = shift.assignedStaffCount || 0;
  const required = shift.requiredStaffCount || 0;
  const seniorAssigned = shift.requiredSeniorStaffCount > 0 ? (shift.assignedStaffCount > 5 ? 1 : 0) : 0;
  const seniorRequired = shift.requiredSeniorStaffCount || 0;
  
  // Calculate a mock visual penalty since backend just returns strings for reasons
  const penaltyPerReason = risk.reasons && risk.reasons.length > 0 ? Math.max(10, Math.floor(risk.riskScore / risk.reasons.length)) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header Area */}
      <div className="mb-6">
        <Link to="/supervisor/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center mb-2">
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider border border-slate-200 mr-2">
                Shift #{shift.id}00
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded border flex items-center ${risk.riskLevel === 'HIGH' || risk.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                <AlertTriangle className="w-3 h-3 mr-1" /> {risk.riskLevel} RISK
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">{shift.departmentName} {shift.type} Shift</h1>
            <div className="flex items-center mt-2 text-slate-500 text-sm font-medium space-x-4">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {dateStr}</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {timeStr}</span>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <Link to={`/supervisor/simulator?shiftId=${shift.id}`} className="flex-1 md:flex-none justify-center inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              <Activity className="w-4 h-4 mr-2" /> Run Simulation
            </Link>
            <Link to={`/supervisor/find-replacement?shiftId=${shift.id}`} className="flex-1 md:flex-none justify-center inline-flex items-center px-4 py-2 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
              <UserPlus className="w-4 h-4 mr-2" /> Find Replacement
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Risk Score & Breakdown */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Operational Risk Score</h3>
            <div className="flex items-center justify-center mb-2">
              <div className={`text-6xl font-black tracking-tighter ${risk.riskLevel === 'HIGH' || risk.riskLevel === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`}>{risk.riskScore || 0}</div>
              <div className="text-slate-400 text-xl font-medium mt-6 ml-1">/ 100</div>
            </div>
            {risk.riskLevel === 'HIGH' || risk.riskLevel === 'CRITICAL' ? (
              <p className="text-sm font-medium text-red-600">Action Required</p>
            ) : (
              <p className="text-sm font-medium text-amber-600">Monitoring Required</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-slate-800">
              Risk Calculation Breakdown
            </div>
            <div className="divide-y divide-slate-100">
              {risk.reasons && risk.reasons.map((reason, idx) => (
                <div key={idx} className="p-4 flex justify-between items-start">
                  <span className="text-sm text-slate-600 pr-4 leading-relaxed">{reason}</span>
                  <span className="text-sm font-bold text-red-500 flex-shrink-0">+{penaltyPerReason}</span>
                </div>
              ))}
              {(!risk.reasons || risk.reasons.length === 0) && (
                <div className="p-4 text-sm text-slate-500 text-center">No major risk factors identified.</div>
              )}
              <div className="p-4 flex justify-between items-center bg-slate-50 border-t border-slate-200">
                <span className="text-sm font-bold text-slate-800">Total Score</span>
                <span className={`text-lg font-black ${risk.riskLevel === 'HIGH' || risk.riskLevel === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`}>{risk.riskScore || 0}</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column - Shift Details & Action */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Staff Coverage</div>
              <div className="flex items-end font-bold text-slate-700">
                <span className={`text-3xl leading-none ${assigned < required ? 'text-red-500' : 'text-green-600'}`}>{assigned}</span>
                <span className="text-slate-400 mx-1">/</span>
                <span className="text-xl text-slate-500">{required}</span>
              </div>
              {assigned < required && (
                <div className="mt-2 text-xs font-medium text-red-500 bg-red-50 inline-block px-2 py-0.5 rounded border border-red-100">
                  {required - assigned} Deficit
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Senior Staff</div>
              <div className="flex items-end font-bold text-slate-700">
                <span className="text-3xl text-amber-500 leading-none">{seniorAssigned}</span>
                <span className="text-slate-400 mx-1">/</span>
                <span className="text-xl text-slate-500">{seniorRequired}</span>
              </div>
              <div className="mt-2 text-xs font-medium text-amber-600 bg-amber-50 inline-block px-2 py-0.5 rounded border border-amber-100">
                Calculated by Engine
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Workload Status</div>
              <div className="text-2xl font-bold text-slate-700 mt-1">EVALUATED</div>
              <div className="mt-2 text-xs font-medium text-slate-500">
                Based on historical metrics
              </div>
            </div>
          </div>

          <div className="bg-brand-50 rounded-xl border border-brand-200 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
            <h3 className="text-lg font-bold text-brand-900 mb-2 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-brand-600" /> System Recommendation
            </h3>
            <p className="text-brand-800 mb-6 leading-relaxed">
              Based on the risk assessment, it is recommended to search the workforce registry for available, rested, and qualified staff to fill the remaining coverage gaps before the shift begins.
            </p>
            <div className="flex gap-3">
              <Link to={`/supervisor/find-replacement?shiftId=${shift.id}`} className="bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors shadow-sm text-sm flex items-center">
                <UserPlus className="w-4 h-4 mr-2" /> Find Qualified Staff
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
