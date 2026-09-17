import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { AlertTriangle, Plus, Edit2, CheckCircle2 } from 'lucide-react';

export default function AdminRiskRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    ruleName: '',
    thresholdValue: 0,
    description: '',
    enabled: true,
    organization: { id: 1 } // Hardcoded for demo, normally dynamic based on org
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await api.get('/risk-rules');
      setRules(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load risk rules.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/risk-rules/${editingId}`, formData);
      } else {
        await api.post('/risk-rules', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ ruleName: '', thresholdValue: 0, description: '', enabled: true, organization: { id: 1 } });
      fetchRules();
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save risk rule.');
    }
  };

  const handleEdit = (rule) => {
    setEditingId(rule.id);
    setFormData({
      ruleName: rule.ruleName,
      thresholdValue: rule.thresholdValue,
      description: rule.description || '',
      enabled: rule.enabled,
      organization: rule.organization
    });
    setShowForm(true);
  };

  if (loading) return <div className="p-8 font-medium text-slate-500">Loading risk rules...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Risk Rules</h1>
          <p className="text-slate-500 text-sm mt-1">Configure threshold values for the Risk Engine.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setEditingId(null); setError(null); }}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Risk Rule'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center border border-red-200">
          <AlertTriangle className="w-5 h-5 mr-3" />
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{editingId ? 'Edit Risk Rule' : 'New Risk Rule'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rule Name</label>
              <input type="text" name="ruleName" value={formData.ruleName} onChange={handleInputChange} required placeholder="e.g. MIN_REST_HOURS" className="w-full border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Threshold Value</label>
              <input type="number" step="0.1" name="thresholdValue" value={formData.thresholdValue} onChange={handleInputChange} required className="w-full border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <input type="text" name="description" value={formData.description} onChange={handleInputChange} className="w-full border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 mt-2">
                <input type="checkbox" name="enabled" checked={formData.enabled} onChange={handleInputChange} className="h-4 w-4 text-amber-600 rounded focus:ring-amber-500" />
                <span className="text-sm font-medium text-slate-700">Rule Enabled</span>
              </label>
            </div>
            
            <div className="md:col-span-2 flex justify-end mt-4">
              <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg text-sm font-medium">
                Save Rule
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
              <th className="p-4 font-semibold">Rule Name</th>
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold">Threshold Value</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rules.map(rule => (
              <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                    <span className="font-semibold text-slate-800">{rule.ruleName}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">{rule.description}</td>
                <td className="p-4 font-mono text-sm text-slate-800 font-semibold">{rule.thresholdValue}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${rule.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(rule)} className="p-1.5 text-slate-400 hover:text-amber-600 transition-colors mr-2"><Edit2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500">No risk rules configured.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
