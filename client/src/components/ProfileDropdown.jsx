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
        className="w-9 h-9 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold focus:outline-none overflow-hidden border-2 border-blue-300 shadow-md hover:shadow-lg transition"
        onClick={() => setOpen(!open)}
        aria-label="Profile menu"
        tabIndex={0}
      >
        {user.profilePic ? (
          <img src={user.profilePic} alt="Profile" className="w-9 h-9 object-cover rounded-full" />
        ) : (
          <span className="text-base">{initials}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-gray-900 rounded-xl shadow-2xl z-50 py-3 border border-gray-800 animate-fade-in">
          <div className="flex flex-col items-center px-4 pb-3 border-b border-gray-800">
            <div className="w-11 h-11 rounded-full bg-blue-900 flex items-center justify-center overflow-hidden mb-1 ring-2 ring-blue-700 shadow">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-11 h-11 object-cover rounded-full" />
              ) : (
                <span className="text-lg font-bold text-blue-200">{initials}</span>
              )}
            </div>
            <div className="font-bold text-gray-100 text-base mb-0.5 truncate w-full text-center">{user.name}</div>
            <Link to="/profile" className="inline-block bg-blue-700 hover:bg-blue-600 text-white font-medium px-3 py-1 rounded shadow transition mb-1 text-xs" onClick={() => setOpen(false)}>
              View Profile
            </Link>
          </div>
          <div className="py-1 px-1">
            {user.role === 'client' ? (
              <>
                <Link to="/posted-jobs" className="flex items-center gap-2 px-4 py-2 rounded text-gray-200 hover:bg-blue-900 hover:text-blue-300 transition font-medium text-sm" onClick={() => setOpen(false)}>
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Posted Jobs
                </Link>
                <Link to="/incoming-bids" className="flex items-center gap-2 px-4 py-2 rounded text-gray-200 hover:bg-blue-900 hover:text-blue-300 transition font-medium text-sm" onClick={() => setOpen(false)}>
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m-4-5v9" /></svg>
                  Incoming Bids
                </Link>
              </>
            ) : (
              <>
                <Link to="/submitted-bids" className="flex items-center gap-2 px-4 py-2 rounded text-gray-200 hover:bg-blue-900 hover:text-blue-300 transition font-medium text-sm" onClick={() => setOpen(false)}>
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Submitted Bids
                </Link>
                <Link to="/accepted-jobs" className="flex items-center gap-2 px-4 py-2 rounded text-gray-200 hover:bg-blue-900 hover:text-blue-300 transition font-medium text-sm" onClick={() => setOpen(false)}>
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Accepted Jobs
                </Link>
              </>
            )}
          </div>
          <div className="border-t border-gray-800 my-1"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-400 hover:bg-red-900 hover:text-red-200 rounded-b-xl transition font-semibold text-sm"
          >
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 