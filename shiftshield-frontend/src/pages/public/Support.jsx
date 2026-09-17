import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/public/Header';
import Footer from '../../components/public/Footer';
import { LifeBuoy, Book, MessageCircle, ShieldCheck, Mail, FileText, ArrowRight } from 'lucide-react';

export default function Support() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-slate-900 pt-24 pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
            <LifeBuoy className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-teal-400 font-bold tracking-wider text-sm uppercase mb-4">Support Center</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">ShiftShield Support Center</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Find documentation, contact technical support, or report an issue. We're here to ensure your hospital operations run smoothly.
          </p>
        </div>
      </div>

      {/* Support Options */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Book className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Product Documentation</h3>
              <p className="text-slate-600 mb-6">Detailed guides on using the risk engine, simulator, and configuring hospital rules.</p>
              <Link to="/contact" className="text-blue-600 font-bold flex items-center hover:text-blue-700">
                View Documentation <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Technical Support</h3>
              <p className="text-slate-600 mb-6">Direct access to our engineering team for troubleshooting API and integration issues.</p>
              <Link to="/contact" className="text-blue-600 font-bold flex items-center hover:text-blue-700">
                Contact Support <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Report an Issue</h3>
              <p className="text-slate-600 mb-6">Experience a bug or service interruption? Report it directly to our incident response team.</p>
              <Link to="/contact" className="text-blue-600 font-bold flex items-center hover:text-blue-700">
                Report Issue <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Other Resources</h2>
              <p className="text-slate-600">Quick links to important operational and security documentation for IT administrators.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/contact" className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group">
                <ShieldCheck className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mr-3" />
                <span className="font-bold text-slate-700">Security Support</span>
              </Link>
              <Link to="/contact" className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group">
                <Mail className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mr-3" />
                <span className="font-bold text-slate-700">Account Support</span>
              </Link>
              <Link to="/contact" className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group">
                <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mr-3" />
                <span className="font-bold text-slate-700">Frequently Asked Questions</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function AlertCircle(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}
