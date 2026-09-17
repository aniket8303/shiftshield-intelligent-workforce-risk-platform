import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-12">
          
          {/* Column 1: Brand & Desc */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="p-2 bg-blue-600 rounded-xl group-hover:bg-blue-500 transition-colors">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                SHIFT<span className="text-teal-400">Shield</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Hospital Workforce & Operational Risk Intelligence. Transform raw staffing data into proactive operational decisions before problems affect patient care.
            </p>
            <div className="space-y-3">
              <div className="flex items-start text-sm text-slate-400">
                <Phone className="w-4 h-4 mr-3 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>1-800-SHIFT-00</span>
              </div>
              <div className="flex items-start text-sm text-slate-400">
                <Mail className="w-4 h-4 mr-3 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>contact@shiftshield.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/platform" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Workforce Visibility</Link></li>
              <li><Link to="/platform" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Shift Management</Link></li>
              <li><Link to="/risk-intelligence" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Risk Intelligence</Link></li>
              <li><Link to="/platform" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Scenario Simulator</Link></li>
              <li><Link to="/platform" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Analytics</Link></li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Solutions</h4>
            <ul className="space-y-4">
              <li><Link to="/solutions" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">For CEOs</Link></li>
              <li><Link to="/solutions" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">For COOs</Link></li>
              <li><Link to="/solutions" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">For HR</Link></li>
              <li><Link to="/solutions" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Nursing Superintendents</Link></li>
              <li><Link to="/solutions" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Department Heads</Link></li>
            </ul>
          </div>

          {/* Column 4: Departments */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Departments</h4>
            <ul className="space-y-4">
              <li><Link to="/departments/emergency" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Emergency</Link></li>
              <li><Link to="/departments/icu" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Intensive Care</Link></li>
              <li><Link to="/departments/cardiology" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Cardiology</Link></li>
              <li><Link to="/departments/pediatrics" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Pediatrics</Link></li>
              <li><Link to="/departments" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">View All Departments</Link></li>
            </ul>
          </div>

          {/* Column 5: Company */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">About Us</Link></li>
              <li><Link to="/support" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Support Center</Link></li>
              <li><Link to="/security" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Security Details</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-teal-400 text-sm font-medium transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} SHIFTShield Enterprise. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/about" className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors">Privacy Policy</Link>
            <Link to="/about" className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors">Terms of Service</Link>
            <Link to="/security" className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
