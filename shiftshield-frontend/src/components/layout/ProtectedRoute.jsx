import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { token, role, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Verifying session...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // If not allowed, send them to their default dashboard
    switch(role) {
      case 'CEO': return <Navigate to="/ceo/dashboard" replace />;
      case 'SUPERVISOR': return <Navigate to="/supervisor/dashboard" replace />;
      case 'COO': return <Navigate to="/coo/dashboard" replace />;
      case 'NURSING_SUPERINTENDENT': return <Navigate to="/nursing/dashboard" replace />;
      case 'HR': return <Navigate to="/hr/dashboard" replace />;
      case 'DEPARTMENT_HEAD': return <Navigate to="/department/dashboard" replace />;
      case 'SYSTEM_ADMIN': return <Navigate to="/admin/dashboard" replace />;
      case 'STAFF': default: return <Navigate to="/staff/dashboard" replace />;
    }
  }

  return <Outlet />;
}
