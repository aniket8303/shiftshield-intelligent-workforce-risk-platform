import React from 'react';
import { FileText, Plus, AlertCircle } from 'lucide-react';

export default function StaffRequests() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
            <FileText className="w-6 h-6 mr-2 text-indigo-600" />
            My Requests
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your time-off, shift changes, and HR requests.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> New Request
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
          <AlertCircle className="w-12 h-12 mb-4 text-slate-300" />
          <p className="font-medium text-slate-600">No requests found</p>
          <p className="text-sm mt-1 text-center">You have not submitted any requests yet.<br/>Click "New Request" to create one.</p>
        </div>
      </div>
    </div>
  );
}
