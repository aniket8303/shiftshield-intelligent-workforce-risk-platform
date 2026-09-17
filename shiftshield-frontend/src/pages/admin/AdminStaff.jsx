import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Search,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  employeeId: '',
  phone: '',
  departmentId: '',
  role: 'STAFF',
  designation: '',
  employmentStatus: 'FULL_TIME',
  experienceLevel: 0,
  isActive: true,
  password: ''
};

const ROLE_OPTIONS = [
  'STAFF',
  'SUPERVISOR',
  'DEPARTMENT_HEAD',
  'NURSING_SUPERINTENDENT',
  'HR'
];

const EMPLOYMENT_OPTIONS = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'TEMPORARY'
];

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchStaffAndDepartments();
  }, []);

  const fetchStaffAndDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      const [staffRes, deptRes] = await Promise.all([
        api.get('/staff'),
        api.get('/departments')
      ]);

      setStaff(staffRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to load staff data.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddStaff = () => {
    setError(null);
    setSuccess(null);
    setEditingId(null);
    setFormData({ ...EMPTY_FORM });
    setShowForm(true);
  };

  const handleEdit = (member) => {
    setError(null);
    setSuccess(null);

    setEditingId(member.id);

    setFormData({
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      email: member.email || '',
      employeeId: member.employeeId || '',
      phone: member.phone || '',
      departmentId: member.departmentId || '',
      role: member.role || 'STAFF',
      designation: member.designation || '',
      employmentStatus: member.employmentStatus || 'FULL_TIME',
      experienceLevel: member.experienceLevel ?? 0,
      isActive: member.isActive ?? true,
      password: ''
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const buildPayload = () => {
    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      employeeId: formData.employeeId.trim(),
      phone: formData.phone.trim(),
      departmentId: Number(formData.departmentId),
      role: formData.role,
      designation: formData.designation.trim(),
      employmentStatus: formData.employmentStatus,
      experienceLevel: Number(formData.experienceLevel || 0),
      isActive: Boolean(formData.isActive)
    };

    if (!editingId && formData.password.trim()) {
      payload.password = formData.password.trim();
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (!formData.departmentId) {
      setError('Please select a department.');
      return;
    }

    if (!formData.designation.trim()) {
      setError('Designation is required.');
      return;
    }

    if (Number(formData.experienceLevel) < 0) {
      setError('Experience level cannot be negative.');
      return;
    }

    try {
      setSaving(true);

      const payload = buildPayload();

      if (editingId) {
        await api.put(`/staff/${editingId}`, payload);

        setSuccess('Staff member updated successfully.');
      } else {
        await api.post('/staff', payload);

        setSuccess(
          'Staff member created successfully. A user account was also created.'
        );
      }

      resetForm();
      await fetchStaffAndDepartments();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to save staff member.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (member) => {
    const confirmed = window.confirm(
      `Deactivate ${member.firstName} ${member.lastName}?\n\n` +
      `The staff record will be retained for historical records, but the staff member will become inactive.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(member.id);
      setError(null);
      setSuccess(null);

      await api.delete(`/staff/${member.id}`);

      setSuccess(
        `${member.firstName} ${member.lastName} has been deactivated.`
      );

      await fetchStaffAndDepartments();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to deactivate staff member.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async (member) => {
    const confirmed = window.confirm(
      `Reactivate ${member.firstName} ${member.lastName}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(member.id);
      setError(null);
      setSuccess(null);

      const payload = {
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        email: member.email || '',
        employeeId: member.employeeId || '',
        phone: member.phone || '',
        departmentId: Number(member.departmentId),
        role: member.role || 'STAFF',
        designation: member.designation || 'Staff',
        employmentStatus: member.employmentStatus || 'FULL_TIME',
        experienceLevel: Number(member.experienceLevel || 0),
        isActive: true
      };

      await api.put(`/staff/${member.id}`, payload);

      setSuccess(
        `${member.firstName} ${member.lastName} has been reactivated.`
      );

      await fetchStaffAndDepartments();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to reactivate staff member.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const filteredStaff = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return staff.filter((member) => {
      const matchesSearch =
        !search ||
        `${member.firstName || ''} ${member.lastName || ''}`
          .toLowerCase()
          .includes(search) ||
        (member.email || '').toLowerCase().includes(search) ||
        (member.employeeId || '').toLowerCase().includes(search) ||
        (member.designation || '').toLowerCase().includes(search) ||
        (member.departmentName || '').toLowerCase().includes(search);

      const matchesDepartment =
        departmentFilter === 'ALL' ||
        String(member.departmentId) === String(departmentFilter);

      const matchesRole =
        roleFilter === 'ALL' ||
        member.role === roleFilter;

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && member.isActive === true) ||
        (statusFilter === 'INACTIVE' && member.isActive === false);

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    staff,
    searchTerm,
    departmentFilter,
    roleFilter,
    statusFilter
  ]);

  const activeCount = staff.filter((member) => member.isActive).length;
  const inactiveCount = staff.filter((member) => !member.isActive).length;

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-slate-200 rounded"></div>
          <div className="h-20 bg-slate-100 rounded-xl"></div>
          <div className="h-96 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-50 rounded-xl">
              <Users className="w-6 h-6 text-brand-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Workforce / Staff
              </h1>

              <p className="text-slate-500 text-sm mt-1">
                Manage hospital staff records and workforce status.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={showForm ? resetForm : handleAddStaff}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </>
          )}
        </button>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start border border-red-200">
          <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm">{error}</div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-start border border-green-200">
          <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm">{success}</div>
        </div>
      )}

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Staff</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {staff.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active Staff</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {activeCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">Inactive Staff</p>
          <p className="text-2xl font-bold text-slate-500 mt-1">
            {inactiveCount}
          </p>
        </div>

      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? 'Edit Staff' : 'New Staff'}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {editingId
                  ? 'Update the staff member information.'
                  : 'Create a new staff member and associated user account.'}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* FIRST NAME */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                First Name *
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            {/* LAST NAME */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Last Name *
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email *
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            {/* EMPLOYEE ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Employee ID *
              </label>

              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            {/* DEPARTMENT */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department *
              </label>

              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">-- Select Department --</option>

                {departments.map((department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ROLE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                System Role *
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white focus:ring-brand-500 focus:border-brand-500"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* DESIGNATION */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Designation *
              </label>

              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="e.g. Senior Nurse"
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            {/* EMPLOYMENT STATUS */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Employment Status
              </label>

              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white focus:ring-brand-500 focus:border-brand-500"
              >
                {EMPLOYMENT_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* EXPERIENCE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Experience Level (Years)
              </label>

              <input
                type="number"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            {/* PASSWORD */}
            {!editingId && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Initial Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Leave blank for backend default"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500"
                />

                <p className="text-xs text-slate-500 mt-1">
                  Creating staff also creates a login account.
                </p>
              </div>
            )}

            {/* ACTIVE */}
            {editingId && (
              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-brand-600 rounded border-slate-300"
                />

                <label className="ml-2 text-sm text-slate-700">
                  Staff account is active
                </label>
              </div>
            )}

            {/* FORM ACTIONS */}
            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">

              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium"
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Staff'
                    : 'Create Staff'}
              </button>

            </div>
          </form>
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          {/* DEPARTMENT */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="ALL">All Departments</option>

            {departments.map((department) => (
              <option
                key={department.id}
                value={department.id}
              >
                {department.name}
              </option>
            ))}
          </select>

          {/* ROLE */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="ALL">All Roles</option>

            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role.replaceAll('_', ' ')}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

        </div>

        <div className="mt-3 text-xs text-slate-500">
          Showing {filteredStaff.length} of {staff.length} staff members
        </div>
      </div>

      {/* STAFF TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">

                <th className="p-4 font-semibold">
                  Name / ID
                </th>

                <th className="p-4 font-semibold">
                  Email
                </th>

                <th className="p-4 font-semibold">
                  Role
                </th>

                <th className="p-4 font-semibold">
                  Department
                </th>

                <th className="p-4 font-semibold">
                  Designation
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

              {filteredStaff.map((member) => (

                <tr
                  key={member.id}
                  className="hover:bg-slate-50 transition-colors"
                >

                  {/* NAME */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">
                        {member.firstName} {member.lastName}
                      </span>

                      <span className="text-xs text-slate-500">
                        {member.employeeId || 'No Employee ID'}
                      </span>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="p-4 text-sm text-slate-600">
                    {member.email}
                  </td>

                  {/* ROLE */}
                  <td className="p-4 text-sm text-slate-600">
                    {member.role?.replaceAll('_', ' ')}
                  </td>

                  {/* DEPARTMENT */}
                  <td className="p-4 text-sm text-slate-600">
                    {member.departmentName || 'N/A'}
                  </td>

                  {/* DESIGNATION */}
                  <td className="p-4 text-sm text-slate-600">
                    {member.designation || 'N/A'}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">

                    {member.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        Inactive
                      </span>
                    )}

                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 text-right whitespace-nowrap">

                    <button
                      type="button"
                      onClick={() => handleEdit(member)}
                      disabled={actionLoading === member.id}
                      title="Edit staff"
                      className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors mr-1 disabled:opacity-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {member.isActive ? (

                      <button
                        type="button"
                        onClick={() => handleDeactivate(member)}
                        disabled={actionLoading === member.id}
                        title="Deactivate staff"
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {actionLoading === member.id ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>

                    ) : (

                      <button
                        type="button"
                        onClick={() => handleReactivate(member)}
                        disabled={actionLoading === member.id}
                        title="Reactivate staff"
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {actionLoading === member.id ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <RotateCcw className="w-4 h-4" />
                        )}
                      </button>

                    )}

                  </td>

                </tr>

              ))}

              {filteredStaff.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-12 text-center"
                  >
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-3" />

                    <p className="font-medium text-slate-600">
                      No staff found
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Try changing your search or filters.
                    </p>
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