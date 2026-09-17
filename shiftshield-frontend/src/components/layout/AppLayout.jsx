import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, LayoutDashboard, Users, Clock, AlertTriangle, 
  Settings, LogOut, Bell, Search, Activity, HeartPulse, Building2,
  FileText, Briefcase, Menu, X
} from 'lucide-react';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { role, user, logout } = useAuth();
  
  // Define navigation based on role.
  const getNavItems = () => {
    switch(role) {
      case 'SYSTEM_ADMIN':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Organizations', path: '/admin/organizations', icon: Building2 },
          { name: 'Users', path: '/admin/users', icon: Users },
          { name: 'Departments', path: '/admin/departments', icon: Building2 },
          { name: 'Staff', path: '/admin/staff', icon: Users },
          { name: 'Risk Rules', path: '/admin/risk-rules', icon: AlertTriangle },
          { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileText }
        ];
      case 'CEO':
        return [
          { name: 'Dashboard', path: '/ceo/dashboard', icon: LayoutDashboard },
          { name: 'Risk Overview', path: '/ceo/risk', icon: Activity },
          { name: 'Departments', path: '/ceo/departments', icon: Building2 },
          { name: 'Analytics', path: '/ceo/analytics', icon: Activity },
          { name: 'Reports', path: '/ceo/reports', icon: FileText }
        ];
      case 'COO':
        return [
          { name: 'Dashboard', path: '/coo/dashboard', icon: LayoutDashboard },
          { name: 'Risk Overview', path: '/coo/risks', icon: Activity },
          { name: 'Actions', path: '/coo/actions', icon: AlertTriangle },
          { name: 'Departments', path: '/coo/departments', icon: Building2 },
          { name: 'Reports', path: '/coo/reports', icon: FileText }
        ];
      case 'HR':
        return [
          { name: 'Dashboard', path: '/hr/dashboard', icon: LayoutDashboard },
          { name: 'Staff Management', path: '/hr/staff', icon: Users },
          { name: 'Workforce', path: '/hr/workforce', icon: Users },
          { name: 'Shifts', path: '/hr/shifts', icon: Clock }
        ];
      case 'NURSING_SUPERINTENDENT':
        return [
          { name: 'Dashboard', path: '/nursing/dashboard', icon: LayoutDashboard },
          { name: 'Nursing Staff', path: '/nursing/staff', icon: Users },
          { name: 'Shifts', path: '/nursing/shifts', icon: Clock },
          { name: 'Risk Overview', path: '/nursing/risk', icon: Activity },
          { name: 'Analytics', path: '/nursing/analytics', icon: Activity }
        ];
      case 'DEPARTMENT_HEAD':
        return [
          { name: 'Dashboard', path: '/department/dashboard', icon: LayoutDashboard },
          { name: 'Department Staff', path: '/department/staff', icon: Users },
          { name: 'Shifts', path: '/department/shifts', icon: Clock },
          { name: 'Assignments', path: '/department/assignments', icon: Briefcase },
          { name: 'Risk Overview', path: '/department/risk', icon: Activity },
          { name: 'Analytics', path: '/department/analytics', icon: Activity }
        ];
      case 'SUPERVISOR':
        return [
          { name: 'Dashboard', path: '/supervisor/dashboard', icon: LayoutDashboard },
          { name: 'Today', path: '/supervisor/today', icon: Clock },
          { name: 'Shifts', path: '/supervisor/shifts', icon: Clock },
          { name: 'Assignments', path: '/supervisor/assignments', icon: Users },
          { name: 'Risk Overview', path: '/supervisor/risks', icon: Activity },
          { name: 'Simulator', path: '/supervisor/simulator', icon: HeartPulse }
        ];
      case 'STAFF':
      default:
        return [
          { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
          { name: 'My Shifts', path: '/staff/my-shifts', icon: Clock },
          { name: 'Hours This Week', path: '/staff/hours', icon: Activity },
          { name: 'My Workload', path: '/staff/my-workload', icon: Briefcase },
          { name: 'My Requests', path: '/staff/requests', icon: FileText }
        ];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get initials for avatar
  const getInitials = () => {
    if (user && user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return "U";
  };
  
  const getFullName = () => {
    if (user && user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return "Current User";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-brand-400" />
          <span className="text-xl font-bold tracking-tight">SHIFT<span className="text-brand-400">Shield</span></span>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300 hover:text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile Overlay) */}
      <aside className={`
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        fixed md:sticky top-0 left-0 z-40 w-64 h-screen
        bg-slate-900 border-r border-slate-800
        flex flex-col transition-transform duration-300 ease-in-out
      `}>
        {/* Brand */}
        <div className="h-16 hidden md:flex items-center px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 group">
            <ShieldCheck className="w-6 h-6 text-brand-500 group-hover:text-brand-400 transition-colors" />
            <span className="text-xl font-bold tracking-tight text-white">
              SHIFT<span className="text-brand-500">Shield</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Command Center</div>
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path.split('/')[1]) && location.pathname.includes(item.path.split('/')[2]);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group
                  ${isActive 
                    ? 'bg-brand-500/10 text-brand-400' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-brand-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User profile / Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-medical-teal flex items-center justify-center text-white font-bold shadow-lg">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{getFullName()}</p>
              <p className="text-xs text-brand-400 truncate">{role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-2 w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 text-slate-500 group-hover:text-red-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen bg-slate-50">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 hidden md:flex">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search staff, shifts, or departments..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <Link to="/notifications" className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              {/* Optional: Add a fetch for unread count here later, currently a static dot for visual */}
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </Link>
            <Link to="/profile" className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto pb-12">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}
