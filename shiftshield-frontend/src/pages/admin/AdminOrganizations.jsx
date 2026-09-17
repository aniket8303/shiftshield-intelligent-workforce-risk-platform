import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    hospitalCode: '',
    location: '',
    subscriptionPlan: 'Enterprise',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await api.get('/organizations');
      setOrganizations(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load organizations.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/organizations/${editingId}`, formData);
      } else {
        await api.post('/organizations', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', hospitalCode: '', location: '', subscriptionPlan: 'Enterprise', status: 'ACTIVE' });
      fetchOrganizations();
    } catch (err) {
      console.error(err);
      setError('Failed to save organization. Ensure hospital code is unique.');
    }
  };

  const handleEdit = (org) => {
    setEditingId(org.id);
    setFormData({
      name: org.name,
      hospitalCode: org.hospitalCode,
      location: org.location || '',
      subscriptionPlan: org.subscriptionPlan || 'Enterprise',
      status: org.status
    });
    setShowForm(true);
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading Organizations...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Organizations</h1>
          <p className="text-slate-500 text-sm mt-1">Manage platform tenants and hospital configurations.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setEditingId(null); }}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Organization'}
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
          <h2 className="text-lg font-bold text-slate-800 mb-4">{editingId ? 'Edit Organization' : 'New Organization'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Code</label>
              <input type="text" name="hospitalCode" value={formData.hospitalCode} onChange={handleInputChange} required disabled={!!editingId} className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end mt-4">
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg text-sm font-medium">
                Save Organization
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {organizations.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No organizations found.</td>
              </tr>
            ) : (
              organizations.map((org) => (
                <tr key={org.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{org.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{org.hospitalCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{org.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${org.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(org)} className="text-brand-600 hover:text-brand-900 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
