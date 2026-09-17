import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/public/Header';
import Footer from '../../components/public/Footer';
import { ShieldCheck, Lock, Database, FileKey, Activity, FileText } from 'lucide-react';

export default function Security() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-slate-900 pt-24 pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <div className="mx-auto w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-6 border border-teal-500/30">
            <ShieldCheck className="w-8 h-8 text-teal-400" />
          </div>
          <p className="text-teal-400 font-bold tracking-wider text-sm uppercase mb-4">Enterprise Security</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">Uncompromising Data Protection.</h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            ShiftShield is built for healthcare environments where operational data security is non-negotiable. Learn how we protect your workforce intelligence.
          </p>
        </div>
      </div>

      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-6 flex-shrink-0">
                <FileKey className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">JWT Authentication</h3>
                <p className="text-slate-600 leading-relaxed">
                  ShiftShield employs strict stateless JWT (JSON Web Token) authentication for all API access. Tokens are cryptographically signed, short-lived, and securely validated by the backend filters on every single request to prevent session hijacking.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mr-6 flex-shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Role-Based Access Control</h3>
                <p className="text-slate-600 leading-relaxed">
                  Permissions are hardcoded at the controller level using Spring Security's <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-sm">@PreAuthorize</code> annotations. A Supervisor cannot access HR endpoints, and HR cannot bypass CEO restrictions. Frontend rendering explicitly respects these backend boundaries.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mr-6 flex-shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Tenant Data Isolation</h3>
                <p className="text-slate-600 leading-relaxed">
                  Enterprise hospital networks require strict partitioning. All entity queries mandate an <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-sm">organizationId</code> constraint at the repository level, ensuring that data never bleeds across different hospital networks.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mr-6 flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Immutable Audit Logging</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every significant action—shift assignments, risk simulation runs, user creation, and logins—is durably recorded in the Audit Logs. System Administrators can query these logs to re-create the exact sequence of events during an incident.
                </p>
              </div>
            </div>

          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Request a Security Audit Report</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              For IT and compliance officers, we provide detailed architectural diagrams, penetration testing summaries, and compliance documentation.
            </p>
            <Link to="/contact" className="inline-flex px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-md">
              Contact Security Team
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
