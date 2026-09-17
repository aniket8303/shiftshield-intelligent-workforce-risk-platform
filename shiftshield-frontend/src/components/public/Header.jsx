import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, Phone, LifeBuoy, Users } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Platform', path: '/platform' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Risk Intelligence', path: '/risk-intelligence' },
    { name: 'Departments', path: '/departments' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      {/* Top Utility Bar */}
      <div className={`w-full py-2 px-4 lg:px-8 flex justify-end items-center text-xs font-semibold transition-colors duration-300 ${isScrolled ? 'bg-slate-50 text-slate-600 border-b border-slate-200' : 'bg-[#0f172a] text-slate-300 border-b border-slate-700/50'}`}>
        <div className="flex items-center space-x-6 max-w-7xl mx-auto w-full justify-end">
          <Link to="/departments/2" className="flex items-center hover:text-teal-400 transition-colors"><Phone className="w-3.5 h-3.5 mr-1.5" /> Emergency Operations</Link>
          <Link to="/support" className="flex items-center hover:text-teal-400 transition-colors"><LifeBuoy className="w-3.5 h-3.5 mr-1.5" /> Support</Link>
          <Link to="/login" className="flex items-center hover:text-teal-400 transition-colors"><Users className="w-3.5 h-3.5 mr-1.5" /> Staff Login</Link>
        </div>
      </div>

      {/* Main Navigation */}
      <div className={`w-full transition-colors duration-300 ${isScrolled ? 'bg-white' : 'bg-[#0f172a]/95 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className={`p-2 rounded-xl transition-colors duration-300 ${isScrolled ? 'bg-blue-600' : 'bg-teal-500/20 group-hover:bg-teal-500/30'}`}>
                  <ShieldCheck className={`w-7 h-7 ${isScrolled ? 'text-white' : 'text-teal-400'}`} />
                </div>
                <span className={`text-2xl font-black tracking-tight transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                  SHIFT<span className={isScrolled ? 'text-blue-600' : 'text-teal-400'}>Shield</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.name} 
                    to={link.path}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      isActive 
                        ? (isScrolled ? 'bg-blue-50 text-blue-700' : 'bg-teal-500/20 text-teal-300')
                        : (isScrolled ? 'text-slate-600 hover:bg-slate-50 hover:text-blue-600' : 'text-slate-300 hover:bg-white/5 hover:text-white')
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link 
                to="/login" 
                className={`text-sm font-bold px-4 py-2 rounded-full transition-colors duration-200 ${isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-200 hover:bg-white/10'}`}
              >
                Login
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md ${isScrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-teal-500 text-slate-900 hover:bg-teal-400'}`}
              >
                Request Demo
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md transition-colors ${isScrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-200 hover:bg-white/10'}`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-2xl absolute w-full top-full left-0">
          <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="border-t border-slate-100 pt-4 mt-4 pb-4">
              <Link
                to="/login"
                className="block px-4 py-3 mb-2 rounded-xl text-base font-bold text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-3 rounded-xl text-base font-bold text-center bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
