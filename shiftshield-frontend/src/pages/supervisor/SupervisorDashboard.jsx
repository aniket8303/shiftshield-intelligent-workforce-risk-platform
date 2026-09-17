import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, AlertTriangle, Calendar, Activity, 
  ChevronRight, Clock, ShieldAlert 
} from 'lucide-react';
import api from '../../services/api';

export default function SupervisorDashboard() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // KPIs state
  const [kpiData, setKpiData] = useState({
    totalShifts: 0,
    staffAssigned: 0,
    coverageGaps: 0,
    highRiskShifts: 0
  });

  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all shifts
        const today = new Date().toISOString().split('T')[0];
        const shiftsRes = await api.get(`/shifts?startDate=${today}&endDate=${today}`);
        // Fetch recent risk assessments
        const risksRes = await api.get('/risk/assessments');
        
        const shiftsData = shiftsRes.data;
        const risksData = risksRes.data;
        
        // Map risk data to shifts
        const riskMap = {};
        risksData.forEach(r => {
          riskMap[r.shiftId] = { score: r.totalScore, level: r.riskLevel };
        });

        let staffAssigned = 0;
        let coverageGaps = 0;
        let highRisk = 0;

        const combinedData = shiftsData.map(shift => {
          staffAssigned += (shift.assignedStaffCount || 0);
          if ((shift.assignedStaffCount || 0) < (shift.requiredStaffCount || 0)) {
            coverageGaps++;
          }
          
          const riskInfo = riskMap[shift.id] || { score: 0, level: 'LOW' };
          if (riskInfo.level === 'HIGH' || riskInfo.level === 'CRITICAL') {
            highRisk++;
          }
          
          return {
            id: shift.id,
            department: shift.departmentName,
            time: `${new Date(shift.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(shift.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
            assigned: shift.assignedStaffCount || 0,
            required: shift.requiredStaffCount || 0,
            riskLevel: riskInfo.level,
            riskScore: riskInfo.score
          };
        });

        setShifts(combinedData);
        setKpiData({
          totalShifts: shiftsData.length,
          staffAssigned,
          coverageGaps,
          highRiskShifts: highRisk
        });
        
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load operations data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const kpis = [
    { title: "Today's Shifts", value: kpiData.totalShifts, icon: Calendar, color: "text-brand-500", bg: "bg-brand-50" },
    { title: "Staff Assigned", value: kpiData.staffAssigned, icon: Users, color: "text-medical-teal", bg: "bg-teal-50" },
    { title: "Coverage Gaps", value: kpiData.coverageGaps, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "High Risk Shifts", value: kpiData.highRiskShifts, icon: ShieldAlert, color: "text-red-500", bg: "bg-red-50" }
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW': return 'bg-risk-low/10 text-risk-low border-risk-low/20';
      case 'MEDIUM': return 'bg-risk-medium/10 text-risk-medium border-risk-medium/20';
      case 'HIGH': return 'bg-risk-high/10 text-risk-high border-risk-high/20';
      case 'CRITICAL': return 'bg-risk-critical/10 text-risk-critical border-risk-critical/20';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Today's Operations</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor shift coverage and operational risk across all departments.</p>
        </div>
        <div className="flex gap-4">
          <Link 
            to="/supervisor/schedule-7-days"
            className="flex items-center text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            7-Day Schedule
          </Link>
          <div className="flex items-center text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <Clock className="w-4 h-4 mr-2 text-brand-500" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg shadow-sm">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{kpi.title}</p>
              <h3 className="text-3xl font-bold text-slate-800">
                {loading ? <span className="animate-pulse bg-slate-200 h-8 w-16 rounded block"></span> : kpi.value}
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${kpi.bg}`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Today's Shifts</h2>
          <div className="flex gap-2">
            <select 
              value={selectedDepartment} 
              onChange={e => setSelectedDepartment(e.target.value)}
              className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white text-slate-600 outline-none focus:border-brand-500"
            >
              <option value="">All Departments</option>
              {[...new Set(shifts.map(s => s.department))].map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
              <Activity className="w-8 h-8 mb-4 animate-spin text-brand-500" />
              <p>Loading operational intelligence...</p>
            </div>
          ) : shifts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
              <Calendar className="w-12 h-12 mb-4 text-slate-300" />
              <p>No active shifts scheduled for today.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4 text-center">Coverage</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shifts
                  .filter(shift => selectedDepartment ? shift.department === selectedDepartment : true)
                  .map((shift) => (
                  <tr key={shift.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{shift.department}</div>
                      <div className="text-xs text-slate-500">Shift #{shift.id}00</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-medium text-slate-700">
                        <Clock className="w-4 h-4 mr-2 text-slate-400" />
                        {shift.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <div className="flex items-end font-bold text-slate-700">
                          <span className={`text-lg ${shift.assigned < shift.required ? 'text-red-500' : ''}`}>
                            {shift.assigned}
                          </span>
                          <span className="text-slate-400 text-sm mx-1">/</span>
                          <span className="text-slate-500">{shift.required}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getRiskColor(shift.riskLevel)}`}>
                        {shift.riskLevel === 'HIGH' || shift.riskLevel === 'CRITICAL' ? (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        ) : (
                          <Activity className="w-3 h-3 mr-1" />
                        )}
                        {shift.riskLevel}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {shift.riskLevel === 'HIGH' || shift.riskLevel === 'CRITICAL' ? (
                        <Link 
                          to={`/supervisor/risks?shiftId=${shift.id}`} 
                          className="inline-flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-semibold text-sm rounded-lg transition-colors border border-red-100"
                        >
                          Resolve Risk
                        </Link>
                      ) : (
                        <Link to={`/supervisor/risks?shiftId=${shift.id}`} className="inline-flex items-center justify-center px-4 py-2 text-brand-600 hover:bg-brand-50 font-medium text-sm rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          View Details <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      )}
                    </td>
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
