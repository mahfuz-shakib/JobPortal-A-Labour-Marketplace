import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { user } = React.useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-blue-600 text-white shadow-md w-full">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
        <div className="font-extrabold text-2xl tracking-tight">
          <Link to="/" className="hover:opacity-80">WorkMatch</Link>
        </div>
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center font-medium text-lg">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/jobs" className="hover:underline">Jobs</Link>
          {user && user.role === 'client' && (
            <Link to="/post-job" className="hover:underline">Post Job</Link>
          )}
          {!user && <Link to="/register" className="hover:underline">Register</Link>}
          {!user && <Link to="/login" className="hover:underline">Login</Link>}
          {user && <ProfileDropdown />}
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 8h16M4 16h16'} />
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-4 pb-4 pt-2 space-y-2 font-medium text-lg shadow">
          <Link to="/" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/jobs" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Jobs</Link>
          {user && user.role === 'client' && (
            <Link to="/post-job" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Post Job</Link>
          )}
          {!user && <Link to="/register" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Register</Link>}
          {!user && <Link to="/login" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Login</Link>}
          {user && <div className="pt-2"><ProfileDropdown /></div>}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 