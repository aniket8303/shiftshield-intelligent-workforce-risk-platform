import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Lazy Loaded Components
const MainDashboard = lazy(() => import('./pages/MainDashboard'));
const Placeholder = lazy(() => import('./pages/Placeholder'));
const CeoDashboard = lazy(() => import('./pages/ceo/CeoDashboard'));
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const Platform = lazy(() => import('./pages/public/Platform'));
const Solutions = lazy(() => import('./pages/public/Solutions'));
const DepartmentsPublic = lazy(() => import('./pages/public/DepartmentsPublic'));
const RiskIntelligence = lazy(() => import('./pages/public/RiskIntelligence'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Security = lazy(() => import('./pages/public/Security'));
const DepartmentDetailPage = lazy(() => import('./pages/public/DepartmentDetailPage'));
const Support = lazy(() => import('./pages/public/Support'));
const Login = lazy(() => import('./components/Login'));
const AppLayout = lazy(() => import('./components/layout/AppLayout'));
const ProtectedRoute = lazy(() => import('./components/layout/ProtectedRoute'));

// New Role Dashboards
const CooDashboard = lazy(() => import('./pages/coo/CooDashboard'));
const HrDashboard = lazy(() => import('./pages/hr/HrDashboard'));
const NursingDashboard = lazy(() => import('./pages/nursing/NursingDashboard'));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrganizations = lazy(() => import('./pages/admin/AdminOrganizations'));
const AdminDepartments = lazy(() => import('./pages/admin/AdminDepartments'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminStaff = lazy(() => import('./pages/admin/AdminStaff'));
const AdminRiskRules = lazy(() => import('./pages/admin/AdminRiskRules'));
const MyShifts = lazy(() => import('./pages/staff/MyShifts'));
const StaffDashboard = lazy(() => import('./pages/staff/StaffDashboard'));
const DepartmentDashboard = lazy(() => import('./pages/department/DepartmentDashboard'));
const Notifications = lazy(() => import('./pages/Notifications'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));

// Intelligence Components
const DepartmentIntelligence = lazy(() => import('./pages/intelligence/DepartmentIntelligence'));
const AnalyticsIntelligence = lazy(() => import('./pages/intelligence/AnalyticsIntelligence'));
const WorkforceIntelligence = lazy(() => import('./pages/intelligence/WorkforceIntelligence'));
const ActionIntelligence = lazy(() => import('./pages/intelligence/ActionIntelligence'));
const MyWorkload = lazy(() => import('./pages/staff/MyWorkload'));
const StaffRequests = lazy(() => import('./pages/staff/StaffRequests'));

// Supervisor Components
const SupervisorDashboard = lazy(() => import('./pages/supervisor/SupervisorDashboard'));
const Schedule7Days = lazy(() => import('./pages/supervisor/Schedule7Days'));
const ShiftRiskDetail = lazy(() => import('./pages/supervisor/ShiftRiskDetail'));
const FindReplacement = lazy(() => import('./pages/supervisor/FindReplacement'));
const Simulator = lazy(() => import('./pages/supervisor/Simulator'));

export default function App() {
  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
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
      </Suspense>
    </Router>
  );
}
