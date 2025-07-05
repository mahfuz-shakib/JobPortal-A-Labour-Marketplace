import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserTie, FaUsers, FaQuestionCircle, FaUserPlus, FaFileAlt, FaHandshake, FaStar, FaNetworkWired, FaUserCheck, FaSearch, FaPaperPlane, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import JobCard from '../components/JobCard';
import ProfileCard from '../components/ProfileCard';
import BidForm from '../components/BidForm';
import { createApiUrl, API_ENDPOINTS } from '../config/api';
import showNotification from '../utils/notifications';
import { AuthContext } from '../context/AuthContext';
import heroPhoto from '../assets/HeroImage.jpg';
import callToActionPhoto from '../assets/callToAction.png';
const categories = [
  { name: 'Electrical', icon: '⚡' },
  { name: 'Plumbing', icon: '🔧' },
  { name: 'Cleaning', icon: '🧹' },
  { name: 'Masonry', icon: '🧱' },
  { name: 'Painting', icon: '🎨' },
  { name: 'Delivery', icon: '🚚' },
  { name: 'Gardening', icon: '🌱' },
  { name: 'Other', icon: '🔧' },
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
  <section
    className="w-screen relative left-1/2 right-1/2 -mx-[50vw] px-0 bg-cover bg-center bg-no-repeat flex items-center justify-center min-h-[320px] sm:min-h-[520px] lg:min-h-[465px]"
    style={{ backgroundImage: 'url(${heroPhoto})' }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-gray-800 bg-opacity-60"></div>
    {/* Content */}
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
      <span className="inline-block bg-yellow-400 text-blue-900 font-bold rounded-full px-5 py-2 mb-6 text-base shadow-lg tracking-wide animate-pulse">
        #1 Job Bidding Platform in Bangladesh
      </span>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
        Connect with <span className="text-yellow-300">Bangladesh's</span>
        <br />
        <span className="text-white">Best Talent</span>
      </h1>
      <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
        Post jobs, find skilled workers, and get quality work done—fast, easy, and secure.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/register"
          className="bg-yellow-400 text-blue-900 font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-yellow-300 transition text-lg"
        >
          Get Started
        </Link>
        <Link
          to="/how-it-works"
          className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-blue-700 transition text-lg"
        >
          Learn More
        </Link>
      </div>
    </div>
  </section>
);

const PublicHomePage = () => {
  const [openFaq, setOpenFaq] = useState(null);
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
      
      {/* How It Works - Redesigned */}
      <section className="w-full max-w-7xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Simple steps to connect clients with skilled workers</p>
        </div>

        {/* Client Flow - First Row */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
              <FaUserTie className="text-xl" />
              <span className="text-lg">For Clients</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-center space-x-4 lg:space-x-6">
              {/* Step 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 w-40 lg:w-44 h-32">
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <FaUserPlus className="text-2xl text-white" />
                  </div>
                  <h3 className="font-bold text-blue-800 text-base">Register</h3>
                </div>
              </div>

              {/* Dotted Arrow Direction 1 */}
              <div className="hidden md:flex items-center text-yellow-500 text-lg font-bold animate-pulse">
                - - - - &gt;
              </div>

              {/* Step 2 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 w-40 lg:w-44 h-32">
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <FaFileAlt className="text-2xl text-white" />
                  </div>
                  <h3 className="font-bold text-blue-800 text-base">Post Job</h3>
                </div>
              </div>

              {/* Dotted Arrow Direction 2 */}
              <div className="hidden md:flex items-center text-yellow-500 text-lg font-bold animate-pulse">
                - - - - &gt;
              </div>

              {/* Step 3 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 w-40 lg:w-44 h-32">
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <FaSearch className="text-2xl text-white" />
                  </div>
                  <h3 className="font-bold text-blue-800 text-base">Review Bids</h3>
                </div>
              </div>

              {/* Dotted Arrow Direction 3 */}
              <div className="hidden md:flex items-center text-yellow-500 text-lg font-bold animate-pulse">
                - - - - &gt;
              </div>

              {/* Step 4 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 w-40 lg:w-44 h-32">
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <FaHandshake className="text-2xl text-white" />
                  </div>
                  <h3 className="font-bold text-blue-800 text-base">Hire & Track</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Worker Flow - Second Row */}
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
              <FaUsers className="text-xl" />
              <span className="text-lg">For Workers</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-center space-x-4 lg:space-x-6">
              {/* Step 1 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 w-40 lg:w-44 h-32">
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <FaUserCheck className="text-2xl text-white" />
                  </div>
                  <h3 className="font-bold text-green-800 text-base">Complete Profile</h3>
                </div>
              </div>

              {/* Dotted Arrow Direction 1 */}
              <div className="hidden md:flex items-center text-red-500 text-lg font-bold animate-pulse">
                - - - - &gt;
              </div>

              {/* Step 2 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 w-40 lg:w-44 h-32">
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <FaSearch className="text-2xl text-white" />
                  </div>
                  <h3 className="font-bold text-green-800 text-base">Browse Jobs</h3>
                </div>
              </div>

              {/* Dotted Arrow Direction 2 */}
              <div className="hidden md:flex items-center text-red-500 text-lg font-bold animate-pulse">
                - - - - &gt;
              </div>

              {/* Step 3 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 w-40 lg:w-44 h-32">
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <FaPaperPlane className="text-2xl text-white" />
                  </div>
                  <h3 className="font-bold text-green-800 text-base">Submit Bids</h3>
                </div>
              </div>

              {/* Dotted Arrow Direction 3 */}
              <div className="hidden md:flex items-center text-red-500 text-lg font-bold animate-pulse">
                - - - - &gt;
              </div>

              {/* Step 4 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 w-40 lg:w-44 h-32">
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <FaCheckCircle className="text-2xl text-white" />
                  </div>
                  <h3 className="font-bold text-green-800 text-base">Get Hired</h3>
                </div>
              </div>
            </div>
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
      <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-r from-green-400 via-yellow-200 to-yellow-300 py-6 px-0 flex flex-col md:flex-row items-center justify-center overflow-hidden">
        {/* Image */}
        <div className="flex-1 flex justify-center items-center min-w-[180px] relative py-4">
          {/* Decorative blurred circle behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-green-300 via-yellow-200 to-yellow-400 rounded-full blur-2xl opacity-60 z-0"></div>
          {/* Gradient ring */}
          <div className="relative z-10 bg-gradient-to-tr from-green-400 via-yellow-300 to-yellow-500 p-2 rounded-full shadow-2xl">
            <div className="bg-white rounded-full p-4">
              <img
                src={callToActionPhoto}
                alt="Get Started"
                className="w-44 h-44 sm:w-56 sm:h-56 object-contain rounded-full shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left px-4 py-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900 mb-2 drop-shadow-lg">
            Ready to Get Started?
          </h2>
          <p className="text-green-900 text-base sm:text-lg mb-4 max-w-xl drop-shadow">
            Join WorkMatch today and connect with Bangladesh's best talent and opportunities.
          </p>
          <Link
            to="/register"
            className="bg-green-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-green-700 transition text-lg"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PublicHomePage; 