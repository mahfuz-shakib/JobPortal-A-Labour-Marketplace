import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaClipboardList, FaCheckDouble, FaUserCheck, FaTools, FaHammer, FaPaintBrush, FaWrench, FaLeaf, FaTruck, FaHandsHelping } from 'react-icons/fa';
import axios from 'axios';
import JobCard from '../components/JobCard';
import BidForm from '../components/BidForm';
import { createApiUrl, API_ENDPOINTS } from '../config/api';
import showNotification from '../utils/notifications';
import { AuthContext } from '../context/AuthContext';

const categories = [
  { name: 'Electrical', icon: <FaSearch /> },
  { name: 'Plumbing', icon: <FaSearch /> },
  { name: 'Cleaning', icon: <FaSearch /> },
  { name: 'Masonry', icon: <FaSearch /> },
  { name: 'Painting', icon: <FaSearch /> },
  { name: 'Delivery', icon: <FaSearch /> },
  { name: 'Gardening', icon: <FaSearch /> },
  { name: 'Other', icon: <FaCheckDouble /> },
];

const WorkerDashboardHero = ({ user, stats, loadingStats }) => (
  <section className="w-full bg-gradient-to-br from-green-800 to-green-800 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Welcome back, <span className="text-green-200">{user.name}</span>! 💪
        </h1>
        <p className="text-xl text-green-100">
          Find great jobs and grow your business with WorkMatch
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">
            {loadingStats ? '...' : stats.submittedBids}
          </div>
          <div className="text-green-100 text-sm">Submitted Bids</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">
            {loadingStats ? '...' : stats.acceptedJobs}
          </div>
          <div className="text-green-100 text-sm">Active Jobs</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">
            {loadingStats ? '...' : stats.completedJobs}
          </div>
          <div className="text-green-100 text-sm">Completed</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">
            {loadingStats ? '...' : stats.averageRating.toFixed(1)}
          </div>
          <div className="text-green-100 text-sm">Rating</div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/jobs" className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition flex items-center gap-2">
          <FaSearch /> Browse Jobs
        </Link>
        <Link to="/submitted-bids" className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition flex items-center gap-2">
          <FaClipboardList /> My Bids
        </Link>
        <Link to="/accepted-jobs" className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
          <FaCheckDouble /> Active Jobs
        </Link>
        <Link to="/profile-card" className="bg-purple-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-600 transition flex items-center gap-2">
          <FaUserCheck /> Update Profile
        </Link>
      </div>
    </div>
  </section>
);

const WorkerHomePage = () => {
  const { user } = useContext(AuthContext);
  
  const [stats, setStats] = useState({ submittedBids: 0, acceptedJobs: 0, completedJobs: 0, averageRating: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const [bidsRes, jobsRes] = await Promise.all([
          axios.get(createApiUrl(API_ENDPOINTS.BIDS_MY)),
          axios.get(createApiUrl(API_ENDPOINTS.JOBS_ACCEPTED))
        ]);
        
        const bids = bidsRes.data;
        const jobs = jobsRes.data;
        
        setStats({
          submittedBids: bids.length,
          acceptedJobs: jobs.filter(job => job.status === 'Assigned' || job.status === 'In Progress').length,
          completedJobs: jobs.filter(job => job.status === 'Completed').length,
          averageRating: user.rating || 0
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        showNotification.error('Failed to load dashboard stats');
        // Keep default stats on error
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [user.rating]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const res = await axios.get(createApiUrl(API_ENDPOINTS.JOBS));
        const data = res.data;
        setFeaturedJobs(data.filter(job => job.status === 'Open').slice(0, 6));
      } catch (err) {
        console.error('Error fetching jobs:', err);
        showNotification.error('Failed to load featured jobs');
        setFeaturedJobs([]);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const handleJobDetails = (job) => {
    navigate(`/jobs/${job._id}`);
  };

  const handleBid = (job) => {
    setSelectedJob(job);
    setShowBidForm(true);
  };

  const handleBidSubmit = async (bidData) => {
    try {
      await axios.post(createApiUrl(API_ENDPOINTS.BIDS), { 
        jobId: selectedJob._id, 
        amount: bidData.amount, 
        message: bidData.message,
        workDuration: bidData.workDuration
      });
      setShowBidForm(false);
      setSelectedJob(null);
      
      // Refresh stats after successful bid
      const refreshStats = async () => {
        try {
          const [bidsRes, jobsRes] = await Promise.all([
            axios.get(createApiUrl(API_ENDPOINTS.BIDS_MY)),
            axios.get(createApiUrl(API_ENDPOINTS.JOBS_ACCEPTED))
          ]);
          
          const bids = bidsRes.data;
          const jobs = jobsRes.data;
          
          setStats({
            submittedBids: bids.length,
            acceptedJobs: jobs.filter(job => job.status === 'Assigned' || job.status === 'In Progress').length,
            completedJobs: jobs.filter(job => job.status === 'Completed').length,
            averageRating: user.rating || 0
          });
        } catch (err) {
          console.error('Error refreshing stats:', err);
        }
      };
      refreshStats();
    } catch (err) {
      console.error('Error submitting bid:', err);
      throw err; // Let BidForm handle the error
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-green-50">
      <WorkerDashboardHero user={user} stats={stats} loadingStats={loadingStats} />
      {/* Featured Jobs Section */}
      <section className="w-full max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Featured Jobs for You</h2>
        {loadingJobs ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <div className="text-green-600">Loading featured jobs...</div>
          </div>
        ) : featuredJobs.length === 0 ? (
          <div className="text-center text-gray-400">No jobs found.</div>
        ) : (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 place-items-center">
            {featuredJobs.map(job => (
              <JobCard key={job._id} job={job} onBid={handleBid} onDetails={handleJobDetails} />
            ))}
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <Link to="/jobs" className="px-6 py-3 rounded-lg bg-green-700 text-white font-bold hover:bg-green-800 transition shadow">
            View All Jobs
          </Link>
        </div>
        {/* Bid Form Modal */}
        <BidForm
          isOpen={showBidForm}
          onClose={() => {
            setShowBidForm(false);
            setSelectedJob(null);
          }}
          onSubmit={handleBidSubmit}
          job={selectedJob}
          showJobInfo={true}
        />
      </section>
      {/* Categories Section for Workers */}
      <section className="w-full max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Job Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link to="/jobs" key={cat.name} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-green-100 hover:bg-green-50 transition">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-bold text-green-700">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default WorkerHomePage; 