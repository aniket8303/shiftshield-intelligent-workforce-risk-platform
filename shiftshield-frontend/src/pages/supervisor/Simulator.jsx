import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Activity, ArrowRight, Play, RotateCcw,
  UserPlus, CheckCircle2, ShieldCheck, AlertTriangle
} from 'lucide-react';
import api from '../../services/api';

export default function Simulator() {
  const [searchParams] = useSearchParams();
  const shiftId = searchParams.get('shiftId');
  const staffId = searchParams.get('staffId');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [runningSim, setRunningSim] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);
  
  const [baselineRisk, setBaselineRisk] = useState(null);
  const [simulatedRisk, setSimulatedRisk] = useState(null);
  const [staffDetails, setStaffDetails] = useState(null);

  useEffect(() => {
    if (!shiftId) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // 1. Get current baseline risk
        const riskRes = await api.post(`/risk/analyze-shift/${shiftId}`);
        setBaselineRisk(riskRes.data);

        // 2. If staff is selected, fetch their details (from eligible staff list or direct)
        // We'll just fetch all eligible and find the one to get their name
        if (staffId) {
          const staffRes = await api.get(`/shifts/${shiftId}/eligible-staff`);
          const found = staffRes.data.find(s => s.id === parseInt(staffId));
          if (found) setStaffDetails(found);
        }
      } catch (err) {
        console.error("Failed to load simulator data:", err);
        setError("Failed to load scenario baseline.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [shiftId, staffId]);

  const handleRunSimulation = async () => {
    if (!shiftId || !staffId) return;
    try {
      setRunningSim(true);
      setError(null);
      const res = await api.post(`/risk/simulate-assignment/${shiftId}?staffId=${staffId}`);
      setSimulatedRisk(res.data);
    } catch (err) {
      console.error("Simulation failed:", err);
      setError("Failed to run scenario simulation.");
    } finally {
      setRunningSim(false);
    }
  };

  const handleApplyScenario = async () => {
    if (!shiftId || !staffId) return;
    try {
      setApplying(true);
      setError(null);
      await api.post(`/shifts/${shiftId}/assignments`, { staffId: parseInt(staffId), shiftId: parseInt(shiftId) });
      // Redirect to Dashboard after success
      navigate('/supervisor/dashboard');
    } catch (err) {
      console.error("Apply failed:", err);
      setError("Failed to apply scenario to live schedule.");
    } finally {
      setApplying(false);
    }
  };

  if (loading || !baselineRisk) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400">
        <Activity className="w-12 h-12 mb-4 animate-spin text-brand-500" />
        <p className="font-semibold text-lg">Initializing Simulator...</p>
      </div>
    );
  }

  const riskReduction = simulatedRisk ? Math.max(0, baselineRisk.riskScore - simulatedRisk.riskScore) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link to="/supervisor/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Shift Scenario Simulator</h1>
            <p className="text-slate-500 text-sm mt-1">Test staffing changes and evaluate risk impact before modifying the live schedule.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current State */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-slate-800 flex justify-between items-center">
            <span>Current State</span>
            <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded">LIVE</span>
          </div>
          <div className="p-5 flex-1">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Shift #{shiftId}00</h3>
            
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-sm text-slate-600">Current Risk Score</span>
                <span className={`font-bold ${baselineRisk.riskLevel === 'HIGH' || baselineRisk.riskLevel === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`}>
                  {baselineRisk.riskScore} {baselineRisk.riskLevel}
                </span>
              </div>
              <div className="mt-4 text-xs text-slate-500 uppercase font-semibold">Active Risk Factors:</div>
              <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                {baselineRisk.reasons && baselineRisk.reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
                {(!baselineRisk.reasons || baselineRisk.reasons.length === 0) && (
                  <li>No major risk factors.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center space-y-4">
          <ArrowRight className="hidden lg:block w-8 h-8 text-slate-300" />
          
          <div className="w-full bg-white rounded-xl border border-brand-200 shadow-sm p-5 text-center">
            <h3 className="text-sm font-bold text-brand-900 mb-4">Simulation Actions</h3>
            
            {!staffId || !staffDetails ? (
              <Link 
                to={`/supervisor/find-replacement?shiftId=${shiftId}`}
                className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-brand-300 rounded-lg text-brand-600 font-medium hover:bg-brand-50 transition-colors mb-3"
              >
                <UserPlus className="w-4 h-4 mr-2" /> Select Staff for Simulator
              </Link>
            ) : (
              <div className="mb-4 bg-brand-50 border border-brand-100 rounded-lg p-3 text-left flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-brand-900">{staffDetails.firstName} {staffDetails.lastName}</div>
                  <div className="text-xs text-brand-700">{staffDetails.designation || staffDetails.role}</div>
                </div>
                <Link 
                  to={`/supervisor/find-replacement?shiftId=${shiftId}`}
                  className="text-slate-400 hover:text-brand-500"
                  title="Change Staff"
                >
                  <RotateCcw className="w-4 h-4" />
                </Link>
              </div>
            )}

            <button 
              disabled={!staffId || runningSim || simulatedRisk}
              onClick={handleRunSimulation}
              className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-bold transition-colors ${
                !staffId 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : simulatedRisk
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'
              }`}
            >
              {runningSim ? (
                <><Activity className="w-4 h-4 mr-2 animate-spin" /> Simulating...</>
              ) : simulatedRisk ? (
                <><CheckCircle2 className="w-5 h-5 mr-2" /> Simulation Complete</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Run Scenario</>
              )}
            </button>
          </div>
          
          <ArrowRight className="hidden lg:block w-8 h-8 text-slate-300" />
        </div>

        {/* Simulated State */}
        <div className={`lg:col-span-1 rounded-xl border shadow-sm overflow-hidden flex flex-col transition-all duration-500 ${simulatedRisk ? 'bg-white border-brand-200 ring-2 ring-brand-500 ring-opacity-20' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
          <div className={`px-4 py-3 border-b font-bold flex justify-between items-center ${simulatedRisk ? 'bg-brand-50 border-brand-100 text-brand-900' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
            <span>Simulated Result</span>
            <span className="text-xs font-semibold bg-brand-100 text-brand-700 px-2 py-1 rounded border border-brand-200">DRAFT</span>
          </div>
          
          <div className="p-5 flex-1 flex flex-col relative">
            {!simulatedRisk ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
                <Activity className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Add staff and run the scenario to see projected risk reduction.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Shift #{shiftId}00</h3>
                
                <div className="space-y-4 mb-6 mt-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-600">Projected Risk Score</span>
                    <span className={`font-bold ${simulatedRisk.riskLevel === 'LOW' ? 'text-green-600' : simulatedRisk.riskLevel === 'MEDIUM' ? 'text-amber-500' : 'text-red-500'}`}>
                      {simulatedRisk.riskScore} {simulatedRisk.riskLevel}
                    </span>
                  </div>
                </div>

                <div className={`rounded-lg p-3 mb-6 flex items-start border ${riskReduction > 0 ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                  {riskReduction > 0 ? (
                    <>
                      <ShieldCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-green-800">Risk Reduced by {riskReduction} Points</div>
                        <div className="text-xs text-green-700 mt-1">Assigning {staffDetails?.firstName} reduces operational risk successfully.</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-slate-700">No Risk Reduction</div>
                        <div className="text-xs text-slate-500 mt-1">This assignment does not significantly lower the risk score.</div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-auto">
                  <button 
                    onClick={handleApplyScenario}
                    disabled={applying}
                    className="w-full flex items-center justify-center px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors shadow-sm disabled:opacity-50"
                  >
                    {applying ? (
                      <><Activity className="w-4 h-4 mr-2 animate-spin" /> Applying...</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4 mr-2" /> Apply Scenario to Schedule</>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center">
                    <AlertTriangle className="w-3 h-3 mr-1" /> This action will update the live roster
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
