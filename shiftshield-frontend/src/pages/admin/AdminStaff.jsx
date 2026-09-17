import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Plus, Edit2, AlertTriangle } from 'lucide-react';

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    phone: '',
    departmentId: '',
    role: 'NURSE',
    employmentType: 'FULL_TIME',
    isActive: true,
    createLoginAccount: false,
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchStaffAndDeps();
  }, []);

  const fetchStaffAndDeps = async () => {
    try {
      const [staffRes, deptRes] = await Promise.all([
        api.get('/staff'),
        api.get('/departments')
      ]);
      setStaff(staffRes.data);
      setDepartments(deptRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load staff.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.createLoginAccount && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      if (editingId) {
        await api.put(`/staff/${editingId}`, formData);
      } else {
        await api.post('/staff', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        firstName: '', lastName: '', email: '', employeeId: '', phone: '',
        departmentId: '', role: 'NURSE', employmentType: 'FULL_TIME',
        isActive: true, createLoginAccount: false, password: '', confirmPassword: ''
      });
      fetchStaffAndDeps();
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save staff member.');
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      employeeId: member.employeeId,
      phone: member.phone || '',
      departmentId: member.department ? member.department.id : '',
      role: member.role,
      employmentType: member.employmentType || 'FULL_TIME',
      isActive: member.isActive,
      createLoginAccount: false, // Cannot create account on edit currently
      password: '',
      confirmPassword: ''
    });
    setShowForm(true);
  };

  if (loading) return <div className="p-8 font-medium text-slate-500">Loading staff...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Workforce / Staff</h1>
          <p className="text-slate-500 text-sm mt-1">Manage hospital staff records.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setEditingId(null); setError(null); }}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Staff'}
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
          <h2 className="text-lg font-bold text-slate-800 mb-4">{editingId ? 'Edit Staff' : 'New Staff'}</h2>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
              <input type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} required className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select name="departmentId" value={formData.departmentId} onChange={handleInputChange} className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500">
                <option value="">-- Select Department --</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role / Designation</label>
              <input type="text" name="role" value={formData.role} onChange={handleInputChange} required className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500" />
            </div>
            
            {!editingId && (
              <div className="md:col-span-2 mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="flex items-center space-x-3 mb-4">
                  <input type="checkbox" name="createLoginAccount" checked={formData.createLoginAccount} onChange={handleInputChange} className="h-4 w-4 text-brand-600 rounded" />
                  <span className="text-sm font-medium text-slate-800">Create User Login Account for this Staff Member</span>
                </label>
                
                {formData.createLoginAccount && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} required className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500" />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="md:col-span-2 flex justify-end mt-4">
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg text-sm font-medium">
                Save Staff
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
              <th className="p-4 font-semibold">Name / ID</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Department</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map(member => (
              <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">{member.firstName} {member.lastName}</span>
                    <span className="text-xs text-slate-500">{member.employeeId}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">{member.email}</td>
                <td className="p-4 text-sm text-slate-600">{member.role}</td>
                <td className="p-4 text-sm text-slate-600">{member.department ? member.department.name : 'N/A'}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(member)} className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors mr-2"><Edit2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500">No staff found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
