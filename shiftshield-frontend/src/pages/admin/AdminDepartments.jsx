import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Building2, Plus, Edit2, AlertTriangle, Trash2 } from 'lucide-react';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    organizationId: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptsRes, orgsRes] = await Promise.all([
        api.get('/departments'),
        api.get('/organizations')
      ]);
      setDepartments(deptsRes.data);
      setOrganizations(orgsRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load departments.');
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
        await api.put(`/departments/${editingId}`, formData);
      } else {
        await api.post('/departments', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '', organizationId: 1 });
      fetchData();
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save department.');
    }
  };

  const handleEdit = (dept) => {
    setEditingId(dept.id);
    setFormData({
      name: dept.name,
      description: dept.description || '',
      organizationId: dept.organizationId || 1
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await api.delete(`/departments/${id}`);
        fetchData();
      } catch(err) {
        setError("Cannot delete department because it is in use.");
      }
    }
  };

  if (loading) return <div className="p-8 font-medium text-slate-500">Loading departments...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Department Management</h1>
          <p className="text-slate-500 text-sm mt-1">Configure clinical and administrative departments.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setEditingId(null); setError(null); }}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Department'}
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
          <h2 className="text-lg font-bold text-slate-800 mb-4">{editingId ? 'Edit Department' : 'New Department'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization</label>
              <select name="organizationId" value={formData.organizationId} onChange={handleInputChange} required className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500">
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500"></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end mt-4">
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg text-sm font-medium">
                Save Department
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
              <th className="p-4 font-semibold">Department Name</th>
              <th className="p-4 font-semibold">Organization</th>
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {departments.map(dept => {
              const orgName = organizations.find(o => o.id === dept.organizationId)?.name || 'Unknown';
              return (
                <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-brand-500 mr-2" />
                      <span className="font-semibold text-slate-800">{dept.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{orgName}</td>
                  <td className="p-4 text-sm text-slate-600 max-w-xs truncate">{dept.description}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(dept)} className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors mr-2"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(dept.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              );
            })}
            {departments.length === 0 && (
              <tr><td colSpan="4" className="p-8 text-center text-slate-500">No departments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
