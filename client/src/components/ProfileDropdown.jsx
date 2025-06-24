import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProfileDropdown = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold focus:outline-none overflow-hidden border-2 border-blue-300 shadow-md hover:shadow-lg transition"
        onClick={() => setOpen(!open)}
        aria-label="Profile menu"
        tabIndex={0}
      >
        {user.profilePic ? (
          <img src={user.profilePic} alt="Profile" className="w-10 h-10 object-cover rounded-full" />
        ) : (
          <span className="text-lg">{initials}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl z-50 py-2 border border-gray-100 animate-fade-in">
          <Link to="/profile" className="block px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-t-xl transition" onClick={() => setOpen(false)}>
            Profile
          </Link>
          <Link to="/dashboard" className="block px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-b-xl transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 