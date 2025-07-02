import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { user } = React.useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // Update navItems to remove Pricing, FAQ, Dashboard
  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Jobs', to: '/jobs' },
    { label: 'Find Workers', to: '/workers' },
    { label: 'About Us', to: '/about' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'Contact', to: '/contact' },
    { label: 'Post Job', to: '/post-job', role: 'client' },
  ];

  // Add Profile Card nav item for workers
  if (user && user.role === 'worker') {
    navItems.push({ label: 'Profile Card', to: '/profile-card' });
  }

  function handleProtectedNav(to) {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    window.location.href = to;
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-blue-700 hover:opacity-80">WorkMatch</Link>
        </div>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex flex-1 justify-center gap-4 items-center text-base font-semibold">
          {navItems.map(item => (
            <Link
              key={item.label}
              to={item.to}
              className="hover:text-blue-600 transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={item.protected ? (e => { e.preventDefault(); handleProtectedNav(item.to); }) : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {!user && <Link to="/register" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Register</Link>}
          {!user && <Link to="/login" className="px-4 py-2 rounded-lg border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 transition">Login</Link>}
          {user && <ProfileDropdown />}
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 8h16M4 16h16'} />
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur px-6 pb-4 pt-2 space-y-2 font-semibold text-base shadow-lg border-t border-blue-100">
          {navItems.map(item => (
            <Link
              key={item.label}
              to={item.to}
              className="block py-2 hover:text-blue-600"
              onClick={item.protected ? (e => { e.preventDefault(); handleProtectedNav(item.to); setMenuOpen(false); }) : (() => setMenuOpen(false))}
            >
              {item.label}
            </Link>
          ))}
          {!user && <Link to="/register" className="block py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Register</Link>}
          {!user && <Link to="/login" className="block py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Login</Link>}
          {user && <div className="pt-2"><ProfileDropdown /></div>}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 