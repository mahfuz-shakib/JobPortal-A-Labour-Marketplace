import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaClipboardList, FaBell, FaSearch, FaUserTie, FaStar, FaCheckCircle, FaMapMarkerAlt, FaMoneyBillWave, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import ProfileCard from '../components/ProfileCard';
import { createApiUrl, API_ENDPOINTS } from '../config/api';
import showNotification from '../utils/notifications';

const categories = [
  { name: 'Electrical', icon: <FaUserTie /> },
  { name: 'Plumbing', icon: <FaUserTie /> },
  { name: 'Cleaning', icon: <FaUserTie /> },
  { name: 'Masonry', icon: <FaUserTie /> },
  { name: 'Painting', icon: <FaStar /> },
  { name: 'Delivery', icon: <FaUserTie /> },
  { name: 'Gardening', icon: <FaUserTie /> },
  { name: 'Other', icon: <FaCheckCircle /> },
];

const ClientDashboardHero = ({ user, stats, loadingStats }) => (
  <section className="w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Welcome back, <span className="text-blue-200">{user.name}</span>! 👋
        </h1>
        <p className="text-xl text-blue-100">
          Manage your jobs and find the perfect workers for your projects
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">
            {loadingStats ? '...' : stats.postedJobs}
          </div>
          <div className="text-blue-100 text-sm">Posted Jobs</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">
            {loadingStats ? '...' : stats.activeJobs}
          </div>
          <div className="text-blue-100 text-sm">Active Jobs</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">
            {loadingStats ? '...' : stats.totalBids}
          </div>
          <div className="text-blue-100 text-sm">Total Bids</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">
            {loadingStats ? '...' : stats.completedJobs}
          </div>
          <div className="text-blue-100 text-sm">Completed</div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/post-job" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition flex items-center gap-2">
          <FaPlus /> Post New Job
        </Link>
        <Link to="/posted-jobs" className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
          <FaClipboardList /> View My Jobs
        </Link>
        <Link to="/incoming-bids" className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition flex items-center gap-2">
          <FaBell /> Review Bids
        </Link>
        <Link to="/workers" className="bg-purple-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-600 transition flex items-center gap-2">
          <FaSearch /> Find Workers
        </Link>
      </div>
    </div>
  </section>
);

const ClientHomePage = () => {
  const { user } = useContext(AuthContext);
  
  const [stats, setStats] = useState({ postedJobs: 0, activeJobs: 0, totalBids: 0, completedJobs: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [featuredWorkers, setFeaturedWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingStats(true);
        setLoadingWorkers(true);
        
        const [jobsRes, workersRes] = await Promise.all([
          axios.get(createApiUrl(API_ENDPOINTS.JOBS_MY)),
          axios.get(createApiUrl(API_ENDPOINTS.USER_WORKERS))
        ]);
        
        const jobsData = jobsRes.data;
        const workersData = workersRes.data;
        
        setStats({
          postedJobs: jobsData.length,
          activeJobs: jobsData.filter(job => job.status === 'Open' || job.status === 'Assigned').length,
          totalBids: jobsData.reduce((sum, job) => sum + (job.bids?.length || 0), 0),
          completedJobs: jobsData.filter(job => job.status === 'Completed').length
        });
        
        setFeaturedWorkers(workersData.slice(0, 4));
        
      } catch (err) {
        console.error('Error fetching data:', err);
        showNotification.error('Failed to load dashboard data');
        // Keep default stats on error
      } finally {
        setLoadingStats(false);
        setLoadingWorkers(false);
      }
    };
    fetchData();
  }, []);

  const handleViewProfile = (worker) => {
    navigate(`/worker/${worker._id}`);
  };

  const handleContact = (worker) => {
    // For now, just show a notification
    showNotification.info(`Contact feature coming soon! You can view ${worker.name}'s profile for more details.`);
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-blue-50">
      <ClientDashboardHero user={user} stats={stats} loadingStats={loadingStats} />
      {/* Featured Workers Section */}
      <section className="w-full max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Featured Workers</h2>
        {loadingWorkers ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-blue-600">Loading featured workers...</div>
          </div>
        ) : featuredWorkers.length === 0 ? (
          <div className="text-center text-gray-400">No workers found.</div>
        ) : (
          <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-2">
            {featuredWorkers.map(worker => (
              <ProfileCard 
                key={worker._id} 
                worker={worker} 
                onViewProfile={handleViewProfile}
                onContact={handleContact}
              />
            ))}
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <Link to="/workers" className="px-6 py-3 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 transition shadow">See All Workers</Link>
        </div>
      </section>
      {/* Categories Section for Clients */}
      <section className="w-full max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Popular Job Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link to="/workers" key={cat.name} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-blue-100 hover:bg-blue-50 transition">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-bold text-blue-700">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ClientHomePage; 