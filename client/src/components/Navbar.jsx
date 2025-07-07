import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { user } = React.useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Define all possible nav items
  const allNavItems = [
    { label: 'হোম', to: '/' },
    { label: 'চাকরি', to: '/jobs' },
    { label: 'কর্মী খুঁজুন', to: '/workers' },
    { label: 'কিভাবে কাজ কর', to: '/how-it-works' },
    { label: 'চাকরি পোস্ট করুন', to: '/post-job', role: 'client' },
    { label: 'প্রোফাইল কার্ড', to: '/profile-card', role: 'worker' },
  ];

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => {
    // Always show items without role restriction
    if (!item.role) return true;
    // Only show role-specific items if user has that role
    return user && user.role === item.role;
  });

  // Handle logo click - navigate to home and scroll to top
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-white via-blue-50/90 to-purple-50/90 backdrop-blur-md shadow-lg border-b border-blue-100/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <button 
          onClick={handleLogoClick}
          className="flex items-center gap-3 transition-all duration-300 group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent group-hover:from-blue-800 group-hover:to-purple-800 transition-all duration-300">
          ওয়ার্কম্যাচ
          </span>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex flex-1 justify-center gap-6 items-center text-base font-semibold">
          {navItems.map(item => (
            <Link
              key={item.label}
              to={item.to}
              className="relative px-4 py-2 text-gray-700 hover:text-blue-700 transition-all duration-300 rounded-lg hover:bg-white/60 hover:shadow-sm group"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {!user && (
            <>
              <Link 
                to="/login" 
                className="px-6 py-2.5 rounded-xl border-2 border-blue-600 text-blue-700 font-semibold hover:bg-blue-600 hover:text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                লগইন
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                রেজিস্টার
              </Link>
            </>
          )}
          {user && <ProfileDropdown />}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 8h16M4 16h16'} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-white/95 to-blue-50/95 backdrop-blur-md px-6 pb-6 pt-4 space-y-3 font-semibold text-base shadow-xl border-t border-blue-100/50">
          {navItems.map(item => (
            <Link
              key={item.label}
              to={item.to}
              className="block py-3 px-4 text-gray-700 hover:text-blue-700 hover:bg-white/60 rounded-xl transition-all duration-300"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {!user && (
            <div className="pt-4 space-y-3 border-t border-blue-100/50">
              <Link 
                to="/login" 
                className="block py-3 px-4 text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-300" 
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="block py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300" 
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
          {user && <div className="pt-4 border-t border-blue-100/50"><ProfileDropdown /></div>}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 