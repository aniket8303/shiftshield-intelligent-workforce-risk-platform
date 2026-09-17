import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  Users,
  Plus,
  Edit2,
  AlertTriangle,
} from 'lucide-react';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'STAFF',
  status: 'ACTIVE',
  organizationId: '',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersRes, organizationsRes] = await Promise.all([
        api.get('/users'),
        api.get('/organizations'),
      ]);

      setUsers(usersRes.data);
      setOrganizations(organizationsRes.data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users and organizations.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]:
        name === 'organizationId'
          ? Number(value)
          : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      ...EMPTY_FORM,
    });

    setEditingId(null);
  };

  const handleToggleForm = () => {
    setShowForm((current) => !current);
    resetForm();
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!formData.organizationId) {
      setError('Please select an organization.');
      return;
    }

    if (
      !editingId &&
      formData.password !== formData.confirmPassword
    ) {
      setError('Passwords do not match.');
      return;
    }

    try {
      /*
       * Do not send confirmPassword to the backend.
       * It is only a frontend validation field.
       */
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        organization: {
          id: Number(formData.organizationId),
        },
      };

      if (!editingId) {
        payload.password = formData.password;
      }

      if (editingId) {
        await api.put(`/users/${editingId}`, payload);
      } else {
        await api.post('/users', payload);
      }

      await fetchData();

      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Failed to save user:', err);

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data;

      setError(
        typeof backendMessage === 'string'
          ? backendMessage
          : 'Failed to save user. Please check the entered information.'
      );
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);

    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '',
      confirmPassword: '',
      role: user.role || 'STAFF',
      status: user.status || 'ACTIVE',
      organizationId: user.organizationId || '',
    });

    setShowForm(true);
    setError(null);
  };

  if (loading) {
    return (
      <div className="p-8 font-medium text-slate-500">
        Loading users...
      </div>
    );
  }
  
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch = !search || 
      `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(search) ||
      (user.email || '').toLowerCase().includes(search);
      
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            User Management
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Manage system login accounts and roles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleForm}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />

          {showForm ? 'Cancel' : 'Add Login User'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center border border-red-200">
          <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">

          <h2 className="text-lg font-bold text-slate-800 mb-4">
            {editingId ? 'Edit User' : 'New User Login'}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email / Username
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={!!editingId}
                className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-100"
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Organization
              </label>

              <select
                name="organizationId"
                value={formData.organizationId}
                onChange={handleInputChange}
                required
                className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">
                  Select organization
                </option>

                {organizations.map((organization) => (
                  <option
                    key={organization.id}
                    value={organization.id}
                  >
                    {organization.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
                <option value="CEO">CEO</option>
                <option value="COO">COO</option>
                <option value="HR">HR</option>
                <option value="NURSING_SUPERINTENDENT">
                  NURSING_SUPERINTENDENT
                </option>
                <option value="DEPARTMENT_HEAD">
                  DEPARTMENT_HEAD
                </option>
                <option value="SUPERVISOR">SUPERVISOR</option>
                <option value="STAFF">STAFF</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {/* Password */}
            {!editingId && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="8"
                    className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength="8"
                    className="w-full border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </>
            )}

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
              >
                {editingId ? 'Update User' : 'Save User'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="ALL">All Roles</option>
            <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
            <option value="CEO">CEO</option>
            <option value="COO">COO</option>
            <option value="HR">HR</option>
            <option value="NURSING_SUPERINTENDENT">NURSING_SUPERINTENDENT</option>
            <option value="DEPARTMENT_HEAD">DEPARTMENT_HEAD</option>
            <option value="SUPERVISOR">SUPERVISOR</option>
            <option value="STAFF">STAFF</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
                <th className="p-4 font-semibold">
                  Name
                </th>

                <th className="p-4 font-semibold">
                  Email
                </th>

                <th className="p-4 font-semibold">
                  Role
                </th>

                <th className="p-4 font-semibold">
                  Organization
                </th>

                <th className="p-4 font-semibold">
                  Status
                </th>

                <th className="p-4 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-brand-500 mr-2" />

                      <span className="font-semibold text-slate-800">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-sm text-slate-600">
                    {user.email}
                  </td>

                  <td className="p-4 text-sm">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4 text-sm text-slate-600">
                    {user.organizationName || '—'}
                  </td>

                  <td className="p-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      type="button"
                      title="Edit user"
                      onClick={() => handleEdit(user)}
                      className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors mr-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {/* Could add a Deactivate button here later if backend is ready for Deactivate on click, but Edit works for now */}
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-slate-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}