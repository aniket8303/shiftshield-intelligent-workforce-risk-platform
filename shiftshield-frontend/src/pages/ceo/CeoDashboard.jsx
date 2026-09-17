import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  AlertTriangle, Users, TrendingUp, DollarSign, Activity, Bell, ChevronRight
} from 'lucide-react';
import api from '../../services/api';

export default function CeoDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [risks, setRisks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        const [resMetrics, resShifts, resDepts, resRisks] = await Promise.all([
          api.get('/dashboard/metrics'),
          api.get('/shifts'),
          api.get('/departments'),
          api.get('/risk/assessments')
        ]);
        setMetrics(resMetrics.data);
        setShifts(resShifts.data);
        setDepartments(resDepts.data);
        setRisks(resRisks.data);
      } catch (err) {
        console.error("Failed to load CEO dashboard metrics:", err);
        setError("Failed to load enterprise metrics");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const KpiCard = ({ title, value, subtext, icon: Icon, trend, trendUp, colorClass }) => (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/50 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        <div className={`text-sm font-semibold flex items-center ${trendUp ? 'text-red-400' : 'text-emerald-400'}`}>
          {trend}
          {trendUp ? <TrendingUp className="w-4 h-4 ml-1" /> : <Activity className="w-4 h-4 ml-1" />}
        </div>
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <div className="text-3xl font-bold text-slate-100">{value}</div>
        <p className="text-slate-500 text-xs mt-2">{subtext}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 p-8 font-sans">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Executive Overview
            </h1>
            <p className="text-slate-400 mt-1">Loading Operations & Risk Intelligence...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="h-32 bg-slate-800/50 rounded-2xl"></div>
             <div className="h-32 bg-slate-800/50 rounded-2xl"></div>
             <div className="h-32 bg-slate-800/50 rounded-2xl"></div>
             <div className="h-32 bg-slate-800/50 rounded-2xl"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 h-72 bg-slate-800/50 rounded-2xl"></div>
             <div className="h-72 bg-slate-800/50 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-500">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  const criticalRisks = metrics?.criticalRiskShifts || 0;
  const coverageGaps = metrics?.totalOpenShifts || 0;

  // Dynamic Department Risk Data
  const deptRiskMap = {};
  departments.forEach(d => {
    deptRiskMap[d.id] = { name: d.name, riskScore: 0, count: 0 };
  });

  risks.forEach(r => {
    const shift = shifts.find(s => s.id === r.shiftId);
    if (shift && deptRiskMap[shift.departmentId]) {
      deptRiskMap[shift.departmentId].riskScore += r.riskScore;
      deptRiskMap[shift.departmentId].count += 1;
    }
  });

  const dynamicDeptRisk = Object.values(deptRiskMap)
    .filter(d => d.count > 0)
    .map(d => ({
      name: d.name,
      riskScore: Math.round(d.riskScore / d.count) // Average risk score
    }))
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5); // Top 5

  // Dynamic Staffing Allocation Data (Based on required vs assigned in upcoming shifts)
  let fullyStaffedCount = 0;
  let underStaffedCount = 0;
  let criticalShortageCount = 0;

  shifts.forEach(s => {
    const ratio = s.requiredStaffCount > 0 ? (s.assignedStaffCount || 0) / s.requiredStaffCount : 1;
    if (ratio >= 1) fullyStaffedCount++;
    else if (ratio >= 0.75) underStaffedCount++;
    else criticalShortageCount++;
  });

  const dynamicStaffingPie = [
    { name: 'Fully Staffed', value: fullyStaffedCount, color: '#10b981' },
    { name: 'Understaffed', value: underStaffedCount, color: '#f59e0b' },
    { name: 'Critical Shortage', value: criticalShortageCount, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Use dynamic action feed based on High/Critical Risks
  const highRiskAlerts = risks.filter(r => r.riskLevel === 'HIGH' || r.riskLevel === 'CRITICAL').slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Executive Overview
          </h1>
          <p className="text-slate-400 mt-1">Live Hospital Operations & Risk Intelligence</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-slate-700 shadow-lg">
            <span className="font-bold text-white">CEO</span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard 
          title="Active Critical Risks" 
          value={criticalRisks} 
          subtext="Immediate action required"
          icon={AlertTriangle} 
          trend={criticalRisks > 0 ? "+12%" : "0%"} 
          trendUp={criticalRisks > 0}
          colorClass={criticalRisks > 0 ? "bg-red-500 text-red-500" : "bg-green-500 text-green-500"}
        />
        <KpiCard 
          title="Shift Coverage Deficit" 
          value={`${coverageGaps} Shifts`} 
          subtext="Uncovered in the next 24 hours"
          icon={Users} 
          trend="-3" 
          trendUp={false}
          colorClass="bg-amber-500 text-amber-500"
        />
        <KpiCard 
          title="Staff Burnout Warning" 
          value={`${Math.round(metrics?.highRiskShifts * 1.5 || 0)}%`} 
          subtext="Approaching critical limits"
          icon={Activity} 
          trend="+2%" 
          trendUp={true}
          colorClass="bg-orange-500 text-orange-500"
        />
        <KpiCard 
          title="Projected Overtime Cost" 
          value={`+$${coverageGaps * 2.1}k`} 
          subtext="Expected for current week"
          icon={DollarSign} 
          trend="+$5k" 
          trendUp={true}
          colorClass="bg-indigo-500 text-indigo-500"
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Department Risk Breakdown */}
        <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-100">Top Departments by Risk Score</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicDeptRisk} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" axisLine={false} tickLine={false} width={100} />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.4}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="riskScore" name="Risk Score" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actionable Alerts Feed */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
          <h2 className="text-lg font-semibold text-slate-100 mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
            Critical Insights
          </h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            
            {highRiskAlerts.length === 0 ? (
               <div className="text-slate-400 text-sm mt-4 text-center">No critical insights. Operations are stable.</div>
            ) : highRiskAlerts.map(alert => {
              const s = shifts.find(sh => sh.id === alert.shiftId);
              return (
                <div key={alert.id} className={`p-4 rounded-xl ${alert.riskLevel === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20' : 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20'} border transition-colors cursor-pointer group`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-bold ${alert.riskLevel === 'CRITICAL' ? 'text-red-400 bg-red-950' : 'text-amber-400 bg-amber-950'} px-2 py-1 rounded`}>
                      {s?.departmentName?.toUpperCase() || 'GENERAL'} {alert.riskLevel}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 mt-2 font-medium">
                    {alert.reasons?.length > 0 ? alert.reasons[0] : `High risk detected for shift #${alert.shiftId}`}
                  </p>
                </div>
              );
            })}

          </div>
        </div>

      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Staffing Overview Pie */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">Current Staffing Allocation (Shift Ratio)</h2>
          <div className="h-64 w-full flex items-center justify-center">
            {dynamicStaffingPie.length === 0 ? (
               <div className="text-slate-400">No shift data available.</div>
            ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dynamicStaffingPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {dynamicStaffingPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Custom Legend */}
              <div className="ml-8 flex flex-col space-y-4 min-w-[150px]">
                {dynamicStaffingPie.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: entry.color }}></div>
                    <div>
                      <div className="text-sm font-medium text-slate-200">{entry.name}</div>
                      <div className="text-xs text-slate-400">{entry.value} Shifts</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
