import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
      <div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-700 mb-4 leading-tight drop-shadow-sm">
          Welcome to <span className="text-blue-500">WorkMatch</span>
        </h1>
        <p className="mb-6 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium">
          WorkMatch is a modern job bidding platform connecting clients and skilled workers. Post jobs, bid on opportunities, and build your reputation in a seamless, professional environment.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:justify-center">
        <Link to="/register" className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">Get Started</Link>
        <Link to="/jobs" className="flex-1 sm:flex-none bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-semibold px-8 py-3 rounded-lg shadow transition text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2">Browse Jobs</Link>
      </div>
    </div>
  </section>
);

export default HomePage; 