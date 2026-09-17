import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainDashboard from './pages/MainDashboard';
import Placeholder from './pages/Placeholder';
import CeoDashboard from './pages/ceo/CeoDashboard';
import LandingPage from './pages/public/LandingPage';
import Platform from './pages/public/Platform';
import Solutions from './pages/public/Solutions';
import DepartmentsPublic from './pages/public/DepartmentsPublic';
import RiskIntelligence from './pages/public/RiskIntelligence';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Security from './pages/public/Security';
import DepartmentDetailPage from './pages/public/DepartmentDetailPage';
import Support from './pages/public/Support';
import Login from './components/Login';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// New Role Dashboards
import CooDashboard from './pages/coo/CooDashboard';
import HrDashboard from './pages/hr/HrDashboard';
import NursingDashboard from './pages/nursing/NursingDashboard';
import AuditLogs from './pages/admin/AuditLogs';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrganizations from './pages/admin/AdminOrganizations';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStaff from './pages/admin/AdminStaff';
import AdminRiskRules from './pages/admin/AdminRiskRules';
import MyShifts from './pages/staff/MyShifts';
import StaffDashboard from './pages/staff/StaffDashboard';
import DepartmentDashboard from './pages/department/DepartmentDashboard';
import Notifications from './pages/Notifications';
import ProfileSettings from './pages/ProfileSettings';

// Intelligence Components
import DepartmentIntelligence from './pages/intelligence/DepartmentIntelligence';
import AnalyticsIntelligence from './pages/intelligence/AnalyticsIntelligence';
import WorkforceIntelligence from './pages/intelligence/WorkforceIntelligence';
import ActionIntelligence from './pages/intelligence/ActionIntelligence';
import MyWorkload from './pages/staff/MyWorkload';
import StaffRequests from './pages/staff/StaffRequests';

// Supervisor Components
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import Schedule7Days from './pages/supervisor/Schedule7Days';
import ShiftRiskDetail from './pages/supervisor/ShiftRiskDetail';
import FindReplacement from './pages/supervisor/FindReplacement';
import Simulator from './pages/supervisor/Simulator';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/departments" element={<DepartmentsPublic />} />
        <Route path="/risk-intelligence" element={<RiskIntelligence />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/security" element={<Security />} />
        <Route path="/departments/:id" element={<DepartmentDetailPage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/login" element={<Login />} />

        {/* Authenticated Routes wrapped in AppLayout */}
        <Route element={<AppLayout />}>
          
          {/* CEO Routes */}
          <Route element={<ProtectedRoute allowedRoles={['CEO', 'SYSTEM_ADMIN']} />}>
            <Route path="/ceo/dashboard" element={<CeoDashboard />} />
            <Route path="/ceo/risk" element={<CeoDashboard />} />
            <Route path="/ceo/departments" element={<DepartmentIntelligence />} />
            <Route path="/ceo/analytics" element={<AnalyticsIntelligence />} />
            <Route path="/ceo/reports" element={<AnalyticsIntelligence />} />
          </Route>
          
          {/* COO Routes */}
          <Route element={<ProtectedRoute allowedRoles={['COO', 'SYSTEM_ADMIN']} />}>
            <Route path="/coo/dashboard" element={<CooDashboard />} />
            <Route path="/coo/risks" element={<CooDashboard />} />
            <Route path="/coo/actions" element={<ActionIntelligence />} />
            <Route path="/coo/departments" element={<DepartmentIntelligence />} />
            <Route path="/coo/reports" element={<AnalyticsIntelligence />} />
          </Route>
          
          {/* HR Routes */}
          <Route element={<ProtectedRoute allowedRoles={['HR', 'SYSTEM_ADMIN']} />}>
            <Route path="/hr/dashboard" element={<HrDashboard />} />
            <Route path="/hr/staff" element={<HrDashboard />} />
            <Route path="/hr/workforce" element={<WorkforceIntelligence />} />
            <Route path="/hr/shifts" element={<ActionIntelligence />} />
          </Route>
          
          {/* NURSING Routes */}
          <Route element={<ProtectedRoute allowedRoles={['NURSING_SUPERINTENDENT', 'SYSTEM_ADMIN']} />}>
            <Route path="/nursing/dashboard" element={<NursingDashboard />} />
            <Route path="/nursing/staff" element={<WorkforceIntelligence />} />
            <Route path="/nursing/shifts" element={<Schedule7Days />} />
            <Route path="/nursing/risk" element={<NursingDashboard />} />
            <Route path="/nursing/analytics" element={<AnalyticsIntelligence />} />
          </Route>
          
          {/* DEPARTMENT Routes */}
          <Route element={<ProtectedRoute allowedRoles={['DEPARTMENT_HEAD', 'SYSTEM_ADMIN']} />}>
            <Route path="/department/dashboard" element={<DepartmentDashboard />} />
            <Route path="/department/staff" element={<WorkforceIntelligence />} />
            <Route path="/department/shifts" element={<Schedule7Days />} />
            <Route path="/department/assignments" element={<Schedule7Days />} />
            <Route path="/department/risk" element={<DepartmentDashboard />} />
            <Route path="/department/analytics" element={<AnalyticsIntelligence />} />
          </Route>
          
          {/* SUPERVISOR Routes */}
          <Route element={<ProtectedRoute allowedRoles={['SUPERVISOR', 'NURSING_SUPERINTENDENT', 'DEPARTMENT_HEAD', 'SYSTEM_ADMIN']} />}>
            <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
            <Route path="/supervisor/schedule-7-days" element={<Schedule7Days />} />
            <Route path="/supervisor/today" element={<SupervisorDashboard />} />
            <Route path="/supervisor/shifts" element={<Schedule7Days />} />
            <Route path="/supervisor/assignments" element={<SupervisorDashboard />} />
            <Route path="/supervisor/risks" element={<ShiftRiskDetail />} />
            <Route path="/supervisor/find-replacement" element={<FindReplacement />} />
            <Route path="/supervisor/simulator" element={<Simulator />} />
          </Route>
          
          {/* STAFF Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STAFF', 'SUPERVISOR', 'SYSTEM_ADMIN']} />}>
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/my-shifts" element={<MyShifts />} />
            <Route path="/staff/hours" element={<MyWorkload />} />
            <Route path="/staff/my-workload" element={<MyWorkload />} />
            <Route path="/staff/requests" element={<StaffRequests />} />
          </Route>
          
          {/* ADMIN Routes */}
          <Route element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/organizations" element={<AdminOrganizations />} />
            <Route path="/admin/departments" element={<AdminDepartments />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/staff" element={<AdminStaff />} />
            <Route path="/admin/risk-rules" element={<AdminRiskRules />} />
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
          </Route>
          
          {/* GLOBAL Authenticated Routes */}
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<ProfileSettings />} />

        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
