import React, { useContext } from 'react';
import { FaUserTie, FaUsers, FaSearch, FaHandshake, FaStar, FaCheckCircle, FaRocket, FaBriefcase, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HowItWorks = () => {
  const { user } = useContext(AuthContext);

  return (
    <main className="min-h-screen w-full flex flex-col bg-blue-50">
      <section className="w-full bg-gradient-to-r from-blue-200 to-blue-100 py-16 mb-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 mb-4">How It Works</h1>
          <p className="text-lg sm:text-xl text-blue-900/80 mb-6 font-medium">
            {user ? (
              user.role === 'client' 
                ? "As a client, here's how you can find and hire skilled workers on WorkMatch."
                : "As a worker, here's how you can find jobs and grow your business on WorkMatch."
            ) : (
              "WorkMatch makes it easy for clients to find skilled workers and for workers to get hired. Here's how the platform works for everyone."
            )}
          </p>
        </div>
      </section>
      
      <section className="w-full max-w-5xl mx-auto py-8 px-4">
        <div className="grid md:grid-cols-2 gap-10">
          {/* For Clients */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">
              <FaUserTie className="text-blue-400" /> 
              {user?.role === 'client' ? 'Your Process' : 'For Clients'}
            </h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Register and create your client profile.</li>
              <li>Post a job with details and requirements.</li>
              <li>Review bids from skilled workers.</li>
              <li>Hire, chat, and track job progress.</li>
              <li>Rate your experience and build your network.</li>
            </ol>
          </div>
          {/* For Workers */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-green-700 mb-2 flex items-center gap-2">
              <FaUsers className="text-green-400" /> 
              {user?.role === 'worker' ? 'Your Process' : 'For Workers'}
            </h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>Register and complete your worker profile card.</li>
              <li>Browse jobs and submit bids.</li>
              <li>Get hired and communicate with clients.</li>
              <li>Complete jobs and earn ratings.</li>
              <li>Grow your reputation and income.</li>
            </ol>
          </div>
        </div>
      </section>
      
      <section className="w-full max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl shadow-lg p-10">
          {user ? (
            user.role === 'client' ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Ready to Post Your First Job?</h2>
                <p className="text-blue-100 mb-6 text-lg">Start finding skilled workers for your projects today.</p>
                <Link to="/post-job" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition text-lg">Post a Job</Link>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Ready to Find Work?</h2>
                <p className="text-blue-100 mb-6 text-lg">Browse available jobs and start earning with your skills.</p>
                <Link to="/jobs" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition text-lg">Browse Jobs</Link>
              </>
            )
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-blue-100 mb-6 text-lg">Join WorkMatch today and connect with Bangladesh's best talent and opportunities.</p>
              <Link to="/register" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition text-lg">Sign Up Now</Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default HowItWorks; 