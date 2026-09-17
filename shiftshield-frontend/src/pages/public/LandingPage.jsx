import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/public/Header';
import Footer from '../../components/public/Footer';
import { 
  ShieldCheck, Activity, Users, Clock, AlertTriangle, 
  ChevronRight, ArrowRight, BarChart2, HeartPulse, Stethoscope, Building2
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function LandingPage() {
  const trendData = [
    { time: '08:00', risk: 24 },
    { time: '12:00', risk: 35 },
    { time: '16:00', risk: 42 },
    { time: '20:00', risk: 68 },
    { time: '00:00', risk: 85 },
    { time: '04:00', risk: 78 }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* 11. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-950">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800"></div>
        
        {/* Subtle grid and glow */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-brand-500/20 blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Left Column: Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <p className="text-brand-300 font-bold tracking-wider text-sm uppercase mb-4">
                Enterprise Hospital Operations Platform
              </p>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                Intelligent Workforce Operations<br className="hidden lg:block"/> for Modern Hospitals
              </h1>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                SHIFTShield helps hospital leaders understand workforce risk, optimize shift coverage, and make safer operational decisions before problems affect patient care.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link to="/platform" className="btn btn-primary bg-brand-500 border-brand-500 hover:bg-brand-400 py-3 px-8 text-base shadow-lg shadow-brand-500/30">
                  Explore Platform
                </Link>
                <Link to="/contact" className="btn bg-white/10 text-white border-white/20 hover:bg-white/20 py-3 px-8 text-base backdrop-blur-sm">
                  Request Demo
                </Link>
              </div>
            </div>

            {/* Right Column: Realistic Dashboard Preview */}
            <div className="w-full lg:w-1/2 relative hidden md:block">
              <div className="glass-card bg-slate-900/60 border-slate-700/50 p-6 shadow-2xl relative overflow-hidden transform rotate-1 lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                
                {/* Mockup Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700/50">
                  <h3 className="text-white font-bold flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-brand-400" />
                    Live Risk Dashboard
                  </h3>
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded flex items-center border border-red-500/30">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1.5"></div>
                    LIVE
                  </span>
                </div>

                {/* Mockup Content */}
                <div className="mb-4">
                  <div className="flex justify-between text-slate-300 text-sm mb-1">
                    <span>Department</span>
                    <span className="font-bold text-white">ICU</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-sm mb-4">
                    <span>Shift</span>
                    <span className="font-bold text-white">Night Shift (23:00 – 07:00)</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700 mb-4 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Risk Status</div>
                    <div className="text-red-400 font-bold flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" /> HIGH RISK
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Risk Score</div>
                    <div className="text-3xl font-black text-red-500">78<span className="text-sm text-slate-500 font-medium">/100</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Staffing Coverage</div>
                    <div className="text-xl font-bold text-white">6 / 8 <span className="text-xs text-red-400 ml-1 font-medium bg-red-500/10 px-1 py-0.5 rounded">-2</span></div>
                  </div>
                  <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Senior Coverage</div>
                    <div className="text-xl font-bold text-white">1 / 2 <span className="text-xs text-red-400 ml-1 font-medium bg-red-500/10 px-1 py-0.5 rounded">-1</span></div>
                  </div>
                </div>

                <div className="bg-brand-900/50 border border-brand-500/30 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute left-0 top-0 w-1 h-full bg-brand-500"></div>
                  <div className="text-xs font-bold text-brand-300 uppercase tracking-wider mb-2">Recommended Action</div>
                  <p className="text-sm text-brand-100/80 leading-relaxed">
                    Assign qualified senior staff before shift start to mitigate critical care risk.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 14. CAPABILITY METRICS */}
      <section className="bg-white border-b border-slate-100 py-12 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left border-r-0 md:border-r border-slate-100 last:border-0">
              <div className="text-3xl font-black text-brand-600 mb-1">99.2%</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Schedule Visibility</div>
            </div>
            <div className="text-center md:text-left border-r-0 md:border-r border-slate-100 last:border-0">
              <div className="text-3xl font-black text-brand-600 mb-1">24/7</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Operational Monitoring</div>
            </div>
            <div className="text-center md:text-left border-r-0 md:border-r border-slate-100 last:border-0">
              <div className="text-3xl font-black text-brand-600 mb-1">7</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Management Roles</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl font-black text-brand-600 mb-1">Live</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Risk Intelligence</div>
            </div>
          </div>
        </div>
      </section>

      {/* 15. WHY SHIFTSHIELD */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Hospital operations are complex.<br/>Your workforce intelligence shouldn't be.
            </h2>
            <p className="text-lg text-slate-600">
              Transform raw staffing data into proactive operational decisions with an enterprise-grade platform built specifically for healthcare environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Workforce Visibility", icon: Users, desc: "See exactly who is working, where they are assigned, and their current workload status across the entire hospital network." },
              { num: "02", title: "Shift Intelligence", icon: Clock, desc: "Identify staffing gaps, senior coverage deficits, and skill imbalances days before a critical shift begins." },
              { num: "03", title: "Risk Detection", icon: AlertTriangle, desc: "Our engine automatically flags dangerous conditions like consecutive night shifts, inadequate rest, and extreme workloads." },
              { num: "04", title: "Decision Support", icon: ShieldCheck, desc: "Receive immediate, actionable recommendations to resolve operational risks safely and compliantly." }
            ].map((feature, idx) => (
              <div key={idx} className="card p-8 card-hover relative group border-slate-200 bg-white">
                <div className="text-6xl font-black text-slate-50 absolute top-4 right-4 z-0 transition-colors group-hover:text-brand-50">{feature.num}</div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-6 text-brand-600 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 17. RISK INTELLIGENCE SECTION */}
      <section className="py-24 bg-white border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                See operational risk<br/>before it becomes a disruption.
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Our proprietary intelligence engine analyzes every shift, staff assignment, and historical metric to pinpoint exact vulnerabilities in your clinical coverage.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-slate-700 font-medium"><ShieldCheck className="w-5 h-5 text-brand-500 mr-3" /> Real-time fatigue monitoring</li>
                <li className="flex items-center text-slate-700 font-medium"><ShieldCheck className="w-5 h-5 text-brand-500 mr-3" /> Configurable hospital workload rules</li>
                <li className="flex items-center text-slate-700 font-medium"><ShieldCheck className="w-5 h-5 text-brand-500 mr-3" /> Automated gap alerts</li>
              </ul>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Critical</div>
                    <div className="text-2xl font-black text-red-500">2</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">High</div>
                    <div className="text-2xl font-black text-amber-500">5</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Medium</div>
                    <div className="text-2xl font-black text-brand-500">8</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Low</div>
                    <div className="text-2xl font-black text-green-500">21</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">Operational Risk Trend</h4>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} dot={{r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 18. WHAT-IF SIMULATOR SECTION */}
      <section className="py-24 bg-brand-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Test the decision<br/>before changing the schedule.
            </h2>
            <p className="text-lg text-brand-200">
              The What-If Simulator allows you to model staffing changes instantly. Add or remove staff in a sandbox environment and see the projected impact on your clinical risk score.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
            {/* Current State */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full md:w-5/12 shadow-2xl relative">
              <div className="absolute -top-3 left-6 bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-600">CURRENT STATE</div>
              
              <div className="flex justify-between items-end border-b border-slate-800 pb-4 mb-4">
                <span className="text-slate-400 font-medium">Risk Score</span>
                <span className="text-4xl font-black text-red-500">78 <span className="text-sm font-bold ml-1">HIGH</span></span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-slate-300">
                  <span>Staff Coverage</span>
                  <span className="font-bold text-white">6 / 8</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Senior Coverage</span>
                  <span className="font-bold text-white">1 / 2</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex flex-col items-center text-brand-500">
              <ArrowRight className="w-12 h-12" />
            </div>
            
            <div className="md:hidden flex flex-col items-center text-brand-500">
              <ArrowRight className="w-8 h-8 rotate-90" />
            </div>

            {/* Simulated State */}
            <div className="bg-brand-900 border-2 border-brand-500 rounded-2xl p-8 w-full md:w-5/12 shadow-[0_0_50px_-12px_rgba(14,165,233,0.5)] relative transform md:scale-105">
              <div className="absolute -top-3 left-6 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">SIMULATED STATE</div>
              
              <div className="flex justify-between items-end border-b border-brand-800 pb-4 mb-4">
                <span className="text-brand-200 font-medium">Projected Risk</span>
                <span className="text-4xl font-black text-amber-400">48 <span className="text-sm font-bold ml-1">MEDIUM</span></span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-brand-100">
                  <span>Staff Coverage</span>
                  <span className="font-bold text-white">7 / 8</span>
                </div>
                <div className="flex justify-between text-brand-100">
                  <span>Senior Coverage</span>
                  <span className="font-bold text-white">2 / 2</span>
                </div>
              </div>
              
              <div className="bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-bold p-3 rounded-lg text-center flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 mr-2" /> Risk Reduction: 30 Points
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/contact" className="btn btn-primary bg-brand-500 border-brand-500 hover:bg-brand-400 py-3 px-8 text-base">
              Run a Live Scenario
            </Link>
          </div>
        </div>
      </section>

      {/* 20. DEPARTMENTS */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tailored for every department.</h2>
            <p className="text-slate-600 text-lg">Hospital operations differ wildly by unit. SHIFTShield adapts its risk rules accordingly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Intensive Care (ICU)", icon: HeartPulse, risk: "CRITICAL", cov: "92%" },
              { name: "Emergency", icon: Activity, risk: "HIGH", cov: "85%" },
              { name: "Cardiology", icon: Stethoscope, risk: "LOW", cov: "100%" },
              { name: "Operation Theatre", icon: Building2, risk: "MEDIUM", cov: "95%" }
            ].map((dept, idx) => (
              <div key={idx} className="card p-6 border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                    <dept.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900">{dept.name}</h3>
                </div>
                <div className="flex justify-between text-sm pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Status</div>
                    <span className={`font-bold ${
                      dept.risk === 'CRITICAL' ? 'text-red-500' :
                      dept.risk === 'HIGH' ? 'text-amber-500' :
                      dept.risk === 'MEDIUM' ? 'text-brand-500' : 'text-green-500'
                    }`}>{dept.risk}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-500 text-xs mb-1">Coverage</div>
                    <span className="font-bold text-slate-800">{dept.cov}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 22. SECURITY SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Built for controlled hospital operations.</h2>
            <p className="text-lg text-slate-600">
              Healthcare data requires uncompromising security. SHIFTShield is designed with enterprise-grade authorization and data isolation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-l-4 border-brand-500 pl-6 py-2">
              <h3 className="font-bold text-slate-900 text-lg mb-2">Role-Based Authorization</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Granular access control ensuring staff, supervisors, and executives only see the data they are permitted to view.</p>
            </div>
            <div className="border-l-4 border-brand-500 pl-6 py-2">
              <h3 className="font-bold text-slate-900 text-lg mb-2">Organization Isolation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Multi-tenant architecture that strictly partitions hospital networks and their respective department data sets.</p>
            </div>
            <div className="border-l-4 border-brand-500 pl-6 py-2">
              <h3 className="font-bold text-slate-900 text-lg mb-2">Comprehensive Audit Logging</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Every shift modification, simulation, and login is recorded securely for compliance and internal investigations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 23. FINAL CTA */}
      <section className="py-24 bg-brand-50 border-t border-brand-100">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
            Ready to secure your shifts?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Join the leading hospitals using operational risk intelligence to protect their workforce and patients.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="btn btn-primary py-3 px-8 text-base">
              Request a Demo
            </Link>
            <Link to="/login" className="btn btn-secondary py-3 px-8 text-base">
              Staff Portal Login
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
