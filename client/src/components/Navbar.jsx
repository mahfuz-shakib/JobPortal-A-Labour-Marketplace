import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="flex justify-between items-center px-8 py-4 bg-blue-600 text-white">
    <div className="font-bold text-2xl">
      <Link to="/">WorkMatch</Link>
    </div>
    <div className="space-x-4">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/jobs" className="hover:underline">Jobs</Link>
      <Link to="/post-job" className="hover:underline">Post Job</Link>
      <Link to="/register" className="hover:underline">Register</Link>
      <Link to="/login" className="hover:underline">Login</Link>
    </div>
  </nav>
);

export default Navbar; 