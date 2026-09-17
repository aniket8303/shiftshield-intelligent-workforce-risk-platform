import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      // Update AuthContext (which handles normalization and localStorage)
      login(token, user);

      // We need to route based on the normalized role locally since state update might not be synchronous for the current render
      let normalizedRole = user.role?.toUpperCase() || '';
      if (normalizedRole.startsWith('ROLE_')) {
        normalizedRole = normalizedRole.substring(5);
      }

      // Route based on real backend roles
      switch(normalizedRole) {
        case 'CEO':
          navigate('/ceo/dashboard');
          break;
        case 'SUPERVISOR':
          navigate('/supervisor/dashboard');
          break;
        case 'COO':
          navigate('/coo/dashboard');
          break;
        case 'NURSING_SUPERINTENDENT':
          navigate('/nursing/dashboard');
          break;
        case 'HR':
          navigate('/hr/dashboard');
          break;
        case 'DEPARTMENT_HEAD':
          navigate('/department/dashboard');
          break;
        case 'STAFF':
          navigate('/staff/dashboard');
          break;
        case 'SYSTEM_ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/staff/dashboard'); // safe fallback
      }
    } catch (err) {
      console.error('Login error', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Invalid email or password.');
        } else if (err.response.status === 403) {
          setError('You are not authorized to access this resource.');
        } else if (err.response.status >= 500) {
          setError('Server error. Please try again.');
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection to the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT 55% - Branding & Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[55%] bg-brand-950 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-brand-500/20 blur-[120px]"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="p-1.5 bg-brand-600 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              SHIFT<span className="text-brand-400">Shield</span>
            </span>
          </Link>

          <div className="max-w-lg mt-20">
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              Operational Intelligence for Healthcare Command Centers.
            </h1>
            <p className="text-lg text-brand-200 mb-8 leading-relaxed">
              Securely access your hospital's live workforce data, manage critical shift risks, and run operational simulations.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center text-brand-100">
                <CheckCircle2 className="w-5 h-5 text-brand-400 mr-3" />
                <span>Enterprise-grade role-based access control</span>
              </div>
              <div className="flex items-center text-brand-100">
                <CheckCircle2 className="w-5 h-5 text-brand-400 mr-3" />
                <span>Secure JWT authentication protocol</span>
              </div>
              <div className="flex items-center text-brand-100">
                <CheckCircle2 className="w-5 h-5 text-brand-400 mr-3" />
                <span>End-to-end operational audit logging</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-brand-400 text-sm">
          © {new Date().getFullYear()} SHIFTShield Enterprise. All rights reserved.
        </div>
      </div>

      {/* RIGHT 45% - Login Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12 lg:hidden">
            <div className="p-1.5 bg-brand-600 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              SHIFT<span className="text-brand-600">Shield</span>
            </span>
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Sign in to access your operational dashboard.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Enterprise Email or ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
                  placeholder="name@hospital.edu"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <button type="button" className="text-sm font-semibold text-brand-600 hover:text-brand-500 bg-transparent border-none p-0 cursor-pointer">Forgot password?</button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                Remember me on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Sign In <ArrowRight className="ml-2 w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            <p>Authorized personnel only. Access is heavily monitored.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
