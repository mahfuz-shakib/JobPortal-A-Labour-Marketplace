import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <main className="min-h-screen w-full flex flex-col">
    <div className="w-full max-w-7xl mx-auto px-6">
      {/* Hero Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between gap-12 pt-10 pb-20 md:pb-28 relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-3xl shadow-lg min-h-[420px] md:min-h-[480px] mb-12">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg width="100%" height="100%" className="absolute left-0 top-0 opacity-20" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="500" cy="100" r="120" fill="#3B82F6" fillOpacity="0.08" />
            <circle cx="100" cy="350" r="80" fill="#2563EB" fillOpacity="0.07" />
            <rect x="200" y="50" width="200" height="200" rx="100" fill="#60A5FA" fillOpacity="0.04" />
          </svg>
        </div>
        {/* Left: Text */}
        <div className="flex-1 flex flex-col items-start justify-center text-left z-10 max-w-xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-800 mb-6 leading-tight drop-shadow-sm">
            Empowering <span className="text-blue-500">Talent</span>,
            <br className="hidden md:block" />
            <span className="text-blue-500">Connecting</span> Opportunities
          </h1>
          <p className="mb-8 text-lg md:text-xl text-blue-900/80 max-w-lg font-medium">
            WorkMatch is the next-generation job bidding platform for clients and skilled workers. Post jobs, bid, and get hired—all in one seamless experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/register" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">Get Started</Link>
            <Link to="/jobs" className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-semibold px-8 py-3 rounded-lg shadow-lg transition text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2">Browse Jobs</Link>
          </div>
        </div>
        {/* Right: Illustration/Pattern */}
        <div className="flex-1 flex items-center justify-center z-10">
          <img src="/public/images/img1.jpg" alt="Hero" className="w-full max-w-md rounded-3xl shadow-2xl border-4 border-blue-100 object-cover" />
        </div>
      </section>
      {/* Main Content Section (white background) */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto py-12 px-0 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center border border-blue-100">
            <div className="bg-blue-100 rounded-full p-3 mb-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">Post or Find Jobs</h3>
            <p className="text-gray-600">Clients post jobs, workers browse and bid. Find the right match for any project or service.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center border border-blue-100">
            <div className="bg-blue-100 rounded-full p-3 mb-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">Bid & Connect</h3>
            <p className="text-gray-600">Workers submit proposals, clients review and select. Built-in chat and notifications keep you connected.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center border border-blue-100">
            <div className="bg-blue-100 rounded-full p-3 mb-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">Get Work Done</h3>
            <p className="text-gray-600">Track job progress, rate your experience, and build your reputation on WorkMatch.</p>
          </div>
        </div>
      </section>
    </div>
  </main>
);

export default HomePage; 