import React from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { user } = React.useContext(AuthContext);

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-blue-600 text-white">
      <div className="font-bold text-2xl">
        <Link to="/">WorkMatch</Link>
      </div>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/jobs" className="hover:underline">Jobs</Link>
        {user && user.role === 'client' && (
          <Link to="/post-job" className="hover:underline">Post Job</Link>
        )}
        {!user && <Link to="/register" className="hover:underline">Register</Link>}
        {!user && <Link to="/login" className="hover:underline">Login</Link>}
        {user && <ProfileDropdown />}
      </div>
    </nav>
  );
};

export default Navbar; 