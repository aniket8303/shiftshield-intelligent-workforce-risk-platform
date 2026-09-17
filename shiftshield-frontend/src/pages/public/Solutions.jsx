import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/public/Header';
import Footer from '../../components/public/Footer';
import { Briefcase, Building2, Users, HeartPulse, Activity, UserCog, UserCheck, ArrowRight } from 'lucide-react';

export default function Solutions() {
  const roles = [
    {
      title: "For CEOs",
      icon: Briefcase,
      color: "blue",
      description: "Organization-wide workforce risk visibility and strategic analytics.",
      features: ["Enterprise risk metrics", "Hospital-wide coverage trends", "Financial and operational liability reduction"]
    },
    {
      title: "For COOs",
      icon: Building2,
      color: "slate",
      description: "Operational risk monitoring and recommended actions across all clinical departments.",
      features: ["Live departmental risk scores", "Cross-department staffing insights", "Efficiency optimization"]
    },
    {
      title: "For HR",
      icon: Users,
      color: "teal",
      description: "Workforce, staff, department and shift management with comprehensive audit trails.",
      features: ["Staff workload tracking", "Burnout risk identification", "Compliance and certification monitoring"]
    },
    {
      title: "Nursing Superintendents",
      icon: HeartPulse,
      color: "rose",
      description: "Nursing workforce and staffing risk visibility tailored for patient safety.",
      features: ["Nursing staff coverage monitoring", "Senior nurse distribution", "Fatigue and consecutive shift tracking"]
    },
    {
      title: "Department Heads",
      icon: Activity,
      color: "indigo",
      description: "Department-specific workforce and shift oversight for specialized care units.",
      features: ["Unit-specific risk rules", "Specialized skill monitoring", "Local workload management"]
    },
    {
      title: "Supervisors",
      icon: UserCog,
      color: "amber",
      description: "Daily shift operations, assignment management, replacement detection and scenario simulation.",
      features: ["Live shift modification", "What-if scenario simulator", "Automated gap alerts"]
    },
    {
      title: "Staff",
      icon: UserCheck,
      color: "emerald",
      description: "Personal shifts, workload, requests and notifications for clinical professionals.",
      features: ["Personal schedule view", "Workload health tracking", "Shift assignment notifications"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-slate-900 pt-24 pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p className="text-teal-400 font-bold tracking-wider text-sm uppercase mb-4">ShiftShield Solutions</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">Built For Every Role in the Hospital</h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            From the boardroom to the bedside, ShiftShield provides tailored insights and tools for every stakeholder involved in hospital operations.
          </p>
        </div>
      </div>

      {/* Role Cards */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {roles.map((role, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 hover:shadow-lg transition-all group">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-${role.color}-100 text-${role.color}-600`}>
                  <role.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{role.title}</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  {role.description}
                </p>
                <div className="space-y-2 mb-6">
                  {role.features.map((feature, i) => (
                    <div key={i} className="flex items-start text-xs font-semibold text-slate-500">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-2 bg-${role.color}-500`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* CTA Card embedded in grid */}
            <div className="bg-blue-600 rounded-2xl border border-blue-500 shadow-md p-8 flex flex-col justify-center text-center">
              <h3 className="text-2xl font-bold text-white mb-4">See how it works for your team.</h3>
              <p className="text-blue-100 text-sm mb-8">Request a personalized demonstration of ShiftShield configured for your specific operational roles.</p>
              <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-slate-50 transition-colors">
                Request Demo <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
