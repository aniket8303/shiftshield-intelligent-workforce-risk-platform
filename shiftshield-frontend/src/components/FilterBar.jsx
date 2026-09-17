import React from 'react';
import { Filter, Calendar as CalendarIcon, Clock, ShieldAlert, X } from 'lucide-react';

export default function FilterBar({ 
  departments = [], 
  selectedDepartment, 
  setSelectedDepartment,
  selectedDate,
  setSelectedDate,
  selectedShiftType,
  setSelectedShiftType,
  selectedRisk,
  setSelectedRisk,
  onClear
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
      {departments.length > 0 && (
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Department
          </label>
          <select 
            value={selectedDepartment || ''} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      )}

      {setSelectedDate && (
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1" /> Date
          </label>
          <input 
            type="date" 
            value={selectedDate || ''}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      )}

      {setSelectedShiftType && (
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
            <Clock className="w-3 h-3 mr-1" /> Shift
          </label>
          <select 
            value={selectedShiftType || ''} 
            onChange={(e) => setSelectedShiftType(e.target.value)}
            className="w-full h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="">All Shifts</option>
            <option value="MORNING">Morning (07:00-15:00)</option>
            <option value="EVENING">Evening (15:00-23:00)</option>
            <option value="NIGHT">Night (23:00-07:00)</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </div>
      )}

      {setSelectedRisk && (
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
            <ShieldAlert className="w-3 h-3 mr-1" /> Risk Level
          </label>
          <select 
            value={selectedRisk || ''} 
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="">All Risks</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      )}

      {onClear && (
        <div>
          <button 
            onClick={onClear}
            className="h-10 px-4 flex items-center justify-center text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
