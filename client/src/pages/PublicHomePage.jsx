import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserTie, FaUsers, FaStar, FaCheckCircle, FaQuestionCircle, FaTools, FaSearch, FaRegSmile, FaMapMarkerAlt, FaMoneyBillWave, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import photo1 from '../assets/img1.jpg';
import JobCard from '../components/JobCard';
import ProfileCard from '../components/ProfileCard';
import BidForm from '../components/BidForm';
import { AuthContext } from '../context/AuthContext';
import { createApiUrl, API_ENDPOINTS } from '../config/api';
import showNotification from '../utils/notifications';

const categories = [
  { name: 'Electrical', icon: <FaTools /> },
  { name: 'Plumbing', icon: <FaTools /> },
  { name: 'Cleaning', icon: <FaRegSmile /> },
  { name: 'Masonry', icon: <FaUserTie /> },
  { name: 'Painting', icon: <FaStar /> },
  { name: 'Delivery', icon: <FaTools /> },
  { name: 'Gardening', icon: <FaSearch /> },
  { name: 'Other', icon: <FaCheckCircle /> },
];

const faqs = [
  {
    q: 'How do I post a job?',
    a: 'Register as a client, go to Post Job, fill in the details, and submit. Your job will be visible to all workers.',
  },
  {
    q: 'How do I get hired as a worker?',
    a: 'Register as a worker, complete your profile card, and start bidding on jobs that match your skills.',
  },
  {
    q: 'Is WorkMatch free to use?',
    a: 'Yes, registration and browsing are free. Some premium features may be introduced in the future.',
  },
  {
    q: 'How are payments handled?',
    a: 'Clients and workers agree on payment terms. WorkMatch encourages secure, transparent transactions.',
  },
];

const GenericHeroSection = () => (
  <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] px-0 pt-12 pb-20 bg-blue-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center gap-10 md:gap-20">
      {/* Left: Text */}
      <div className="flex-1 flex flex-col items-start justify-center text-left z-10 max-w-xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-800 mb-6 leading-tight drop-shadow-sm">
          Bangladesh's #1 <span className="text-blue-500">Labour Marketplace</span>
        </h1>
        <p className="mb-8 text-lg md:text-xl text-blue-900/80 max-w-lg font-medium">
          Find trusted workers, post jobs, and get hired. Fast, secure, and professional—WorkMatch connects talent with opportunity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/register" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">Get Started</Link>
          <Link to="/jobs" className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-semibold px-8 py-3 rounded-lg shadow-lg transition text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2">Browse Jobs</Link>
        </div>
      </div>
      {/* Right: Illustration */}
      <div className="flex-1 flex items-center justify-center z-10">
        <img src={photo1} alt="Hero" className="w-full max-w-md rounded-3xl shadow-2xl border-4 border-blue-100 object-cover" />
      </div>
    </div>
  </section>
);

const PublicHomePage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredWorkers, setFeaturedWorkers] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingJobs(true);
        setLoadingWorkers(true);
        
        const [jobsRes, workersRes] = await Promise.all([
          axios.get(createApiUrl(API_ENDPOINTS.JOBS)),
          axios.get(createApiUrl(API_ENDPOINTS.USER_WORKERS))
        ]);
        
        const jobsData = jobsRes.data;
        const workersData = workersRes.data;
        
        setJobs(jobsData.slice(0, 6)); // Show only 6 jobs
        setWorkers(workersData.slice(0, 6)); // Show only 6 workers
        
      } catch (err) {
        console.error('Error fetching data:', err);
        showNotification.error('Failed to load featured content');
        setJobs([]);
        setWorkers([]);
      } finally {
        setLoading(false);
        setLoadingJobs(false);
        setLoadingWorkers(false);
      }
    };
    fetchData();
  }, []);

  const handleJobDetails = (job) => {
    if (!user) {
      navigate('/login', { state: { from: `/jobs/${job._id}` } });
      return;
    }
    navigate(`/jobs/${job._id}`);
  };

  const handleBid = (job) => {
    if (!user || user.role !== 'worker') {
      navigate('/login');
      return;
    }
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
      // Refresh jobs to show updated bid count
      const res = await axios.get(createApiUrl(API_ENDPOINTS.JOBS));
      setJobs(res.data);
    } catch (err) {
      console.error('Error submitting bid:', err);
      throw err; // Let BidForm handle the error
    }
  };

  const handleViewProfile = (worker) => {
    navigate(`/worker/${worker._id}`);
  };

  const handleContact = (worker) => {
    if (!user) {
      navigate('/login', { state: { from: `/worker/${worker._id}` } });
      return;
    }
    navigate(`/worker/${worker._id}`);
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-blue-50">
      <GenericHeroSection />
      {/* How It Works */}
      <section className="w-full max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-10">
          {/* For Clients */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2"><FaUserTie className="text-blue-400" /> For Clients</h3>
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
            <h3 className="text-xl font-bold text-green-700 mb-2 flex items-center gap-2"><FaUsers className="text-green-400" /> For Workers</h3>
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
      {/* Featured Jobs Section */}
      <section className="w-full max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Featured Jobs</h2>
        {loading ? <div className="text-center text-blue-600">Loading jobs...</div> : jobs.length === 0 ? <div className="text-center text-gray-400">No jobs found.</div> : (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 place-items-center">
            {jobs.map(job => (
              <JobCard key={job._id} job={job} onBid={handleBid} onDetails={handleJobDetails} />
            ))}
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <Link to="/jobs" className="px-6 py-3 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 transition shadow">See All Jobs</Link>
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
      {/* Featured Workers Section */}
      <section className="w-full max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Featured Workers</h2>
        {loading ? <div className="text-center text-blue-600">Loading...</div> : workers.length === 0 ? <div className="text-center text-gray-400">No workers found.</div> : (
          <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-2">
            {workers.map(worker => (
              <ProfileCard key={worker._id} worker={worker} onViewProfile={handleViewProfile} onContact={handleContact} />
            ))}
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <Link to="/workers" className="px-6 py-3 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 transition shadow">See All Workers</Link>
        </div>
      </section>
      {/* Categories Section */}
      <section className="w-full max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Explore Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link to="/jobs" key={cat.name} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-blue-100 hover:bg-blue-50 transition">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-bold text-blue-700">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>
      {/* FAQ Section */}
      <section className="w-full max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 border border-blue-100">
              <button className="flex items-center w-full text-left gap-2 font-semibold text-blue-700 focus:outline-none" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <FaQuestionCircle className="text-blue-400" />
                {faq.q}
              </button>
              {openFaq === i && <div className="mt-2 text-gray-700">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>
      {/* Call to Action */}
      <section className="w-full max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl shadow-lg p-10">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-6 text-lg">Join WorkMatch today and connect with Bangladesh's best talent and opportunities.</p>
          <Link to="/register" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition text-lg">Sign Up Now</Link>
        </div>
      </section>
    </main>
  );
};

export default PublicHomePage; 