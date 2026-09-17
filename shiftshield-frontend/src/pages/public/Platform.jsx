import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/public/Header';
import Footer from '../../components/public/Footer';
import { ShieldCheck, ArrowRight, CheckCircle2, Activity, Users, Clock, AlertTriangle, Layers, Brain, Search, BellRing, Settings } from 'lucide-react';

export default function Platform() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-slate-900 pt-24 pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p className="text-teal-400 font-bold tracking-wider text-sm uppercase mb-4">The ShiftShield Platform</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">One Platform. Complete Workforce Risk Visibility.</h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            An intelligent enterprise solution designed exclusively for hospitals. ShiftShield connects departments, managers, and staff into a single operational brain.
          </p>
        </div>
      </div>

      {/* Workflow Section */}
      <div className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How The Intelligence Engine Works</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">From raw data to actionable clinical decisions in real-time.</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6 text-sm font-bold text-slate-700">
            <span className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">Hospital</span>
            <ArrowRight className="text-teal-500 w-5 h-5" />
            <span className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">Departments</span>
            <ArrowRight className="text-teal-500 w-5 h-5" />
            <span className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">Staff</span>
            <ArrowRight className="text-teal-500 w-5 h-5" />
            <span className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">Shifts</span>
            <ArrowRight className="text-teal-500 w-5 h-5" />
            <span className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">Assignments</span>
            <ArrowRight className="text-teal-500 w-5 h-5 hidden lg:block" />
            <span className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 hidden lg:block">Workload</span>
            
            <div className="w-full text-center py-4 lg:hidden">
               <ArrowRight className="text-teal-500 w-5 h-5 mx-auto rotate-90" />
            </div>

            <ArrowRight className="text-teal-500 w-5 h-5 hidden lg:block" />
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center"><Brain className="w-4 h-4 mr-2" /> Risk Engine</span>
            <ArrowRight className="text-teal-500 w-5 h-5" />
            <span className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">Risk Score</span>
            <ArrowRight className="text-teal-500 w-5 h-5" />
            <span className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 flex items-center text-red-600"><AlertTriangle className="w-4 h-4 mr-2" /> Alert</span>
            <ArrowRight className="text-teal-500 w-5 h-5" />
            <span className="bg-teal-50 px-4 py-2 rounded-lg border border-teal-200 text-teal-700">Recommended Action</span>
            <ArrowRight className="text-teal-500 w-5 h-5" />
            <span className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">Simulation</span>
            <ArrowRight className="text-teal-500 w-5 h-5" />
            <span className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center"><CheckCircle2 className="w-4 h-4 mr-2"/> Decision</span>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Workforce Management</h3>
              <p className="text-slate-600 leading-relaxed">Centralized directory of clinical staff, mapping designations, skill levels, and department affiliations to ensure accurate capacity planning.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Shift Management</h3>
              <p className="text-slate-600 leading-relaxed">Enterprise-grade scheduling that factors in shift times, rest periods, and rolling staff assignments to prevent administrative errors.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Risk Intelligence</h3>
              <p className="text-slate-600 leading-relaxed">Proactive monitoring for every hospital shift, calculating fatigue, staff density, and coverage gaps to score operational risk.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI/Rule-Based Detection</h3>
              <p className="text-slate-600 leading-relaxed">Customizable rules engine that flags consecutive night shifts, skill mismatches, and excess workloads based on hospital policies.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Scenario Simulator</h3>
              <p className="text-slate-600 leading-relaxed">Test staffing changes in a sandbox environment. Evaluate how replacing or adding staff will impact the clinical risk score before applying changes.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <BellRing className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Notifications & Audit Trail</h3>
              <p className="text-slate-600 leading-relaxed">Automated alerts for supervisors and a comprehensive, immutable audit log for compliance, HR, and incident reporting.</p>
            </div>

          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Experience the platform firsthand.</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/risk-intelligence" className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-colors shadow-md">
              Explore Risk Intelligence
            </Link>
            <Link to="/solutions" className="px-8 py-3 bg-slate-100 text-slate-700 rounded-full font-bold hover:bg-slate-200 transition-colors">
              View Solutions
            </Link>
            <Link to="/contact" className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-md">
              Request Demo
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
