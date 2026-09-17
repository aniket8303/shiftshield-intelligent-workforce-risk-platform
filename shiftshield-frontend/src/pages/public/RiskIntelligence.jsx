import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/public/Header';
import Footer from '../../components/public/Footer';
import api from '../../services/api';
import { Brain, Activity, ShieldCheck, AlertTriangle, Zap, UserX, Clock, Calendar, Shuffle, Play, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function RiskIntelligence() {
  const [dashboard, setDashboard] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the summary metrics and detailed assessments
        const [dashboardRes, assessmentsRes] = await Promise.all([
          api.get('/risk/dashboard'),
          api.get('/risk/assessments')
        ]);
        
        setDashboard(dashboardRes.data);
        setAssessments(assessmentsRes.data);
      } catch (err) {
        console.error("Error fetching risk data:", err);
        setError("Unable to load risk intelligence data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRiskData();
  }, []);

  const riskFactors = [
    { title: "Understaffing", icon: UserX, desc: "Total assigned staff falls below the required threshold for safe patient care." },
    { title: "Senior Staff Coverage", icon: ShieldCheck, desc: "Inadequate ratio of highly experienced clinical staff on shift." },
    { title: "Excessive Working Hours", icon: Clock, desc: "Staff members approaching or exceeding safe maximum shift durations." },
    { title: "Insufficient Rest", icon: Activity, desc: "Less than required minimum rest periods between scheduled shifts." },
    { title: "Consecutive Shifts", icon: Calendar, desc: "Too many sequential working days, particularly involving night shifts." },
    { title: "High Workload", icon: AlertTriangle, desc: "Historical or predicted patient volume creating acute stress on available staff." },
    { title: "Skill Mismatch", icon: Shuffle, desc: "Available staff lack specific certifications required for the department's current needs." },
    { title: "Availability Conflicts", icon: Zap, desc: "Assigned staff have logged unavailability or overlapping commitments." }
  ];

  const getRiskColor = (level) => {
    switch(level) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'LOW': return 'bg-teal-100 text-teal-700 border-teal-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRiskScoreColor = (level) => {
    switch(level) {
      case 'CRITICAL': return 'text-red-600';
      case 'HIGH': return 'text-orange-500';
      case 'MEDIUM': return 'text-amber-500';
      case 'LOW': return 'text-teal-500';
      default: return 'text-slate-500';
    }
  };

  // Find the highest recent risk assessment to feature
  const topRisk = assessments.length > 0 
    ? [...assessments].sort((a, b) => b.riskScore - a.riskScore)[0] 
    : null;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 flex flex-col">
      <Header />
      
      {/* Page Header */}
      <div className="bg-slate-900 pt-24 pb-32 border-b border-slate-800 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center relative z-10">
          <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
            <Brain className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-teal-400 font-bold tracking-wider text-sm uppercase mb-4">The Risk Intelligence Engine</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">Turn Workforce Data Into<br/>Actionable Risk Intelligence.</h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-10">
            Go beyond basic scheduling. ShiftShield analyzes dozens of hidden clinical and operational variables in real-time to alert you to risks before they impact patient care.
          </p>

          {/* KPI Summary Cards */}
          {dashboard && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
              <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-700">
                <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total Assessments</div>
                <div className="text-3xl font-black text-white">{dashboard.totalAssessments}</div>
              </div>
              <div className="bg-red-900/20 backdrop-blur-md rounded-xl p-4 border border-red-900/50">
                <div className="text-red-400 text-xs font-bold uppercase mb-1">High/Critical Risk</div>
                <div className="text-3xl font-black text-red-400">{dashboard.highRisk}</div>
              </div>
              <div className="bg-amber-900/20 backdrop-blur-md rounded-xl p-4 border border-amber-900/50">
                <div className="text-amber-400 text-xs font-bold uppercase mb-1">Medium Risk</div>
                <div className="text-3xl font-black text-amber-400">{dashboard.mediumRisk}</div>
              </div>
              <div className="bg-teal-900/20 backdrop-blur-md rounded-xl p-4 border border-teal-900/50">
                <div className="text-teal-400 text-xs font-bold uppercase mb-1">Low Risk</div>
                <div className="text-3xl font-black text-teal-400">{dashboard.lowRisk}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading risk intelligence data...</p>
          </div>
        ) : error ? (
          <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Error</h3>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Visual Risk Score Section */}
            {topRisk && (
              <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20 mb-24">
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
                  <div className="p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
                    
                    <div className="text-center md:text-left flex-1">
                      <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-4">
                        Highest Active Risk
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">{topRisk.departmentName || "Department"} - {topRisk.shiftType || "Shift"}</h3>
                      <p className="text-slate-500 mb-6">The engine continuously scores every upcoming shift based on active risk factors.</p>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-slate-700 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">
                          <span>Staffing Coverage</span>
                          <span className={topRisk.assignedStaff < topRisk.requiredStaff ? "text-red-500" : "text-teal-600"}>
                            {topRisk.assignedStaff || 0} / {topRisk.requiredStaff || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold text-slate-700 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">
                          <span>Senior Staff Coverage</span>
                          <span className={topRisk.assignedSeniorStaff < topRisk.requiredSeniorStaff ? "text-amber-500" : "text-teal-600"}>
                            {topRisk.assignedSeniorStaff || 0} / {topRisk.requiredSeniorStaff || 0}
                          </span>
                        </div>
                        {topRisk.reasons && topRisk.reasons.length > 0 && (
                          <div className="flex flex-col text-sm font-bold text-slate-700 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">
                            <span className="mb-2">Key Risk Factors</span>
                            <div className="flex flex-wrap gap-2">
                              {topRisk.reasons.map((r, i) => (
                                <span key={i} className="text-xs bg-white px-2 py-1 border border-slate-200 rounded text-slate-500">{r}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center shrink-0">
                      <div className="relative w-48 h-48 rounded-full border-8 border-slate-100 flex items-center justify-center shadow-inner mb-4">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle cx="96" cy="96" r="88" fill="none" 
                            stroke={topRisk.riskLevel === 'CRITICAL' ? "#ef4444" : topRisk.riskLevel === 'HIGH' ? "#f97316" : topRisk.riskLevel === 'MEDIUM' ? "#f59e0b" : "#14b8a6"} 
                            strokeWidth="16" 
                            strokeDasharray="552.92" 
                            strokeDashoffset={552.92 - (552.92 * (topRisk.riskScore / 100))} 
                            strokeLinecap="round" className="drop-shadow-md transition-all duration-1000"/>
                        </svg>
                        <div className="text-center z-10">
                          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Risk Score</div>
                          <div className={`text-5xl font-black ${getRiskScoreColor(topRisk.riskLevel)}`}>{topRisk.riskScore}</div>
                          <div className={`text-sm font-black px-3 py-1 rounded-full mt-2 inline-block border ${getRiskColor(topRisk.riskLevel)}`}>
                            {topRisk.riskLevel} RISK
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            )}

            {/* Comprehensive Assessments Table */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-24">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Recent Risk Assessments</h2>
                  <p className="text-slate-500 mt-1">Live data from the ShiftShield risk engine.</p>
                </div>
              </div>

              {assessments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                  <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900">No Risk Assessments</h3>
                  <p className="text-slate-500 mt-2">There are currently no risk assessments recorded in the system.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4">Department / Shift</th>
                          <th className="px-6 py-4">Risk Level</th>
                          <th className="px-6 py-4">Score</th>
                          <th className="px-6 py-4">Coverage</th>
                          <th className="px-6 py-4">Assessment Date</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {assessments.map((assessment) => (
                          <tr key={assessment.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">{assessment.departmentName || "Unknown Dept"}</div>
                              <div className="text-slate-500 text-xs mt-1">
                                {assessment.shiftType} • {assessment.shiftDate ? format(parseISO(assessment.shiftDate), 'MMM d, yyyy HH:mm') : 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(assessment.riskLevel)}`}>
                                {assessment.riskLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`font-black ${getRiskScoreColor(assessment.riskLevel)}`}>{assessment.riskScore}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-slate-600">
                                  Staff: {assessment.assignedStaff || 0}/{assessment.requiredStaff || 0}
                                </span>
                                <span className="text-xs font-medium text-slate-600">
                                  Senior: {assessment.assignedSeniorStaff || 0}/{assessment.requiredSeniorStaff || 0}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs">
                              {assessment.calculatedAt ? format(parseISO(assessment.calculatedAt), 'MMM d, HH:mm') : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <Link to={`/departments/${assessment.departmentName?.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                                View Dept
                              </Link>
                              <button className="inline-flex items-center text-xs font-bold text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors">
                                Review Shift
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Risk Factors Grid */}
            <div className="py-24 bg-white border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900">Comprehensive Risk Factors</h2>
                  <p className="text-slate-600 mt-4 max-w-2xl mx-auto">Our engine evaluates dozens of parameters instantly.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {riskFactors.map((factor, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-blue-300 transition-colors">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm text-slate-700">
                        <factor.icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">{factor.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{factor.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scenario Simulator Placeholder */}
            <div className="py-24 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute -top-[50%] -right-[10%] w-[80%] h-[100%] rounded-full bg-teal-500/10 blur-[120px]"></div>
              
              <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                  
                  <div className="w-full lg:w-1/2">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-6 border border-teal-500/30">
                      <Play className="w-3 h-3 mr-2" /> What-If Engine
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">The Scenario Simulator</h2>
                    <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                      Finding a risk is only half the battle. ShiftShield's Scenario Simulator allows supervisors to test staffing replacements in a secure sandbox.
                    </p>
                    <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                      See exactly how assigning a specific staff member will change the risk score. <strong className="text-white">Simulation does NOT change live data</strong> until you explicitly choose to "Apply Scenario".
                    </p>
                    
                    <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-teal-500 text-slate-900 font-bold rounded-full hover:bg-teal-400 transition-colors">
                      Request a Simulator Demo
                    </Link>
                  </div>
                  
                  <div className="w-full lg:w-1/2">
                    <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl relative">
                      
                      <div className="mb-8">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Risk State (LIVE)</div>
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex justify-between items-center">
                          <span className="font-bold text-white">Shift #8200</span>
                          <span className="text-2xl font-black text-red-500">78 <span className="text-sm">HIGH</span></span>
                        </div>
                      </div>
                      
                      <div className="flex justify-center my-4">
                        <div className="bg-slate-700 px-4 py-1 rounded-full text-xs font-bold text-slate-300">
                          + Add Senior Staff (Sarah Jenkins)
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">After Replacement (SIMULATED)</div>
                        <div className="bg-teal-900/30 border border-teal-500/50 rounded-xl p-4 flex justify-between items-center shadow-[0_0_30px_-10px_rgba(20,184,166,0.3)]">
                          <span className="font-bold text-white">Projected Risk</span>
                          <span className="text-2xl font-black text-teal-400">48 <span className="text-sm">MEDIUM</span></span>
                        </div>
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-slate-700 flex justify-end gap-3">
                        <button className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-bold cursor-default opacity-50">Cancel</button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 cursor-default">Apply Scenario</button>
                      </div>
                      
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
