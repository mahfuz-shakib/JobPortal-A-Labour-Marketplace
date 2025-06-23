import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to WorkMatch</h1>
    <p className="mb-6 text-lg max-w-xl">
      WorkMatch is a simple job bidding platform connecting clients and skilled workers. Post jobs, bid on opportunities, and build your reputation!
    </p>
    <div className="space-x-4">
      <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Get Started</Link>
      <Link to="/jobs" className="bg-gray-200 text-blue-600 px-4 py-2 rounded hover:bg-gray-300">Browse Jobs</Link>
    </div>
  </div>
);

export default HomePage; 