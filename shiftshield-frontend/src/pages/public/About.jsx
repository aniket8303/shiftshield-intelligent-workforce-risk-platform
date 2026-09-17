import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/public/Header';
import Footer from '../../components/public/Footer';
import { ShieldCheck, HeartPulse, Shield, Globe, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-slate-900 pt-24 pb-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p className="text-teal-400 font-bold tracking-wider text-sm uppercase mb-4">About ShiftShield</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6">Securing the People Who Save Lives.</h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            We build enterprise workforce intelligence that helps hospitals identify operational risks before they compromise patient care.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="prose prose-lg prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Workforce Risk Matters</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Every day, hospitals face the immense challenge of staffing highly complex, volatile environments. When a critical care nurse calls in sick, or when an emergency department experiences an unexpected surge, the operational risk spikes instantly. Unmanaged fatigue, skill mismatches, and inadequate senior coverage are not just administrative headaches—they are direct threats to patient safety.
            </p>
            
            <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">Our Approach</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              ShiftShield was built on a simple premise: clinical managers should not have to manually calculate fatigue rules or guess the impact of a staffing change. Our platform acts as an intelligent layer over your existing workforce data, continuously analyzing shifts and applying complex risk algorithms to detect vulnerabilities.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 my-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 text-blue-600 mr-2" /> The Risk Intelligence Philosophy
              </h3>
              <p className="text-slate-600 mb-0">
                We believe that risk intelligence must be <strong>proactive</strong>, <strong>simulatable</strong>, and <strong>secure</strong>. Alerting a supervisor to a staffing gap is good; allowing them to instantly simulate the risk impact of three different replacement options before making a decision is transformative.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mt-12 mb-6">Enterprise Architecture & Security</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Healthcare data requires uncompromising security. ShiftShield is engineered from the ground up for the modern hospital enterprise. We employ rigid multi-tenant data isolation, granular role-based access controls, and comprehensive, immutable audit logging for every single action taken within the platform.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Tenets</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                <HeartPulse className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Clinical First</h3>
              <p className="text-slate-400">Our algorithms are designed around patient safety and clinical reality, not just administrative convenience.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-teal-500/20 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Uncompromising Security</h3>
              <p className="text-slate-400">We treat hospital operational data with the same rigorous security protocols as electronic health records.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Scale</h3>
              <p className="text-slate-400">Built to handle the complexity of multi-facility hospital networks and thousands of concurrent clinical staff.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
