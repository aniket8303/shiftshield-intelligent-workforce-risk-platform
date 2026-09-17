import React, { useState, useEffect } from 'react';
import { Search, Filter, Shield, Info, X } from 'lucide-react';
import api from '../../services/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/audit-logs');
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
      setError("Failed to load audit logs. You may not have permission.");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const term = searchTerm.toLowerCase();
    return (
      (log.action && log.action.toLowerCase().includes(term)) ||
      (log.details && log.details.toLowerCase().includes(term)) ||
      (log.entityType && log.entityType.toLowerCase().includes(term))
    );
  });

  const getBadgeColor = (action) => {
    if (!action) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (action.includes('APPLY_SCENARIO') || action.includes('CREATE')) return 'bg-green-50 text-green-700 border-green-200';
    if (action.includes('UPDATE') || action.includes('ASSIGN')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (action.includes('DELETE') || action.includes('UNASSIGN')) return 'bg-red-50 text-red-700 border-red-200';
    if (action.includes('RISK') || action.includes('SIMULATE')) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
            <Shield className="w-6 h-6 mr-2 text-indigo-600" />
            Audit Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track important changes and operational actions across ShiftShield.</p>
        </div>
        
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all" 
            />
          </div>
          <button className="px-3 py-2 border border-slate-200 rounded-md bg-white text-slate-600 hover:bg-slate-50 transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-12 text-red-500 text-center">
            <p>{error}</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
            <Shield className="w-12 h-12 mb-4 text-slate-300" />
            <p>No audit logs found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 cursor-pointer transition-colors" onClick={() => setSelectedLog(log)}>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">{log.entityType}</div>
                      <div className="text-xs text-slate-400">ID: {log.entityId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                      {log.details}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-50 transition-colors">
                        <Info className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                Audit Log Details
              </h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              
              <div className="flex items-center justify-between">
                <div>
                  <span className={`px-3 py-1 rounded-md text-sm font-bold border ${getBadgeColor(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                </div>
                <div className="text-sm text-slate-500 font-medium">
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Entity Type</div>
                  <div className="font-medium text-slate-800">{selectedLog.entityType}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Entity ID</div>
                  <div className="font-medium text-slate-800">{selectedLog.entityId}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</div>
                <div className="text-sm text-slate-700 bg-white border border-slate-200 p-4 rounded-lg leading-relaxed">
                  {selectedLog.details}
                </div>
              </div>
              
              {(selectedLog.oldValue || selectedLog.newValue) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedLog.oldValue && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                      <div className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2">Old Value</div>
                      <pre className="text-xs text-red-900 whitespace-pre-wrap font-mono">{selectedLog.oldValue}</pre>
                    </div>
                  )}
                  {selectedLog.newValue && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                      <div className="text-xs font-bold text-green-800 uppercase tracking-wider mb-2">New Value</div>
                      <pre className="text-xs text-green-900 whitespace-pre-wrap font-mono">{selectedLog.newValue}</pre>
                    </div>
                  )}
                </div>
              )}

            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
