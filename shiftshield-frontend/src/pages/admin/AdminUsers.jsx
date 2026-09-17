import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Plus, Edit2, AlertTriangle } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STAFF',
    status: 'ACTIVE',
    organization: { id: 1 } // Hardcoded for demo/simplicity, should come from org list ideally
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load users.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, formData);
      } else {
        await api.post('/users', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'STAFF', status: 'ACTIVE', organization: { id: 1 } });
      fetchUsers();
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to save user.');
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      password: '', // Never show password
      confirmPassword: '',
      organization: user.organization
    });
    setShowForm(true);
  };

  if (loading) return <div className="p-8 font-medium text-slate-500">Loading users...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage system login accounts and roles.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setEditingId(null); setError(null); }}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Login User'}
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
          <h2 className="text-lg font-bold text-slate-800 mb-4">{editingId ? 'Edit User' : 'New User Login'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email / Username</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required disabled={!!editingId} className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select name="role" value={formData.role} onChange={handleInputChange} className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500">
                <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
                <option value="CEO">CEO</option>
                <option value="COO">COO</option>
                <option value="HR">HR</option>
                <option value="NURSING_SUPERINTENDENT">NURSING_SUPERINTENDENT</option>
                <option value="DEPARTMENT_HEAD">DEPARTMENT_HEAD</option>
                <option value="SUPERVISOR">SUPERVISOR</option>
                <option value="STAFF">STAFF</option>
              </select>
            </div>
            
            {!editingId && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            
            <div className="md:col-span-2 flex justify-end mt-4">
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg text-sm font-medium">
                Save User
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email (Username)</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-brand-500 mr-2" />
                    <span className="font-semibold text-slate-800">{user.firstName} {user.lastName}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">{user.email}</td>
                <td className="p-4 text-sm text-slate-600">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">{user.role}</span>
                </td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(user)} className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors mr-2"><Edit2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
