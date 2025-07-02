import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserTie, FaUsers, FaBriefcase, FaHandshake, FaShieldAlt, FaBolt, FaComments, FaStar, FaCheckCircle, FaQuestionCircle, FaTools, FaSearch, FaRegSmile, FaUser, FaMapMarkerAlt, FaMoneyBillWave, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';

const categories = [
  { name: 'Electrical', icon: <FaBolt /> },
  { name: 'Plumbing', icon: <FaTools /> },
  { name: 'Cleaning', icon: <FaRegSmile /> },
  { name: 'Masonry', icon: <FaUserTie /> },
  { name: 'Painting', icon: <FaStar /> },
  { name: 'Delivery', icon: <FaBriefcase /> },
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

const HeroSection = () => (
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
        <img src="/public/images/img1.jpg" alt="Hero" className="w-full max-w-md rounded-3xl shadow-2xl border-4 border-blue-100 object-cover" />
      </div>
    </div>
  </section>
);

const FeaturedWorkersSection = () => {
  const [workers, setWorkers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axios.get('/api/user/workers');
        setWorkers(res.data.slice(0, 4)); // Show only 4 workers
      } catch {
        setWorkers([]);
      }
      setLoading(false);
    };
    fetchWorkers();
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Featured Workers</h2>
      {loading ? <div className="text-center text-blue-600">Loading...</div> : workers.length === 0 ? <div className="text-center text-gray-400">No workers found.</div> : (
        <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-2">
          {workers.map(worker => {
            const card = worker.profileCard || {};
            const image = card.profileImage || worker.profilePic || '/public/images/default-profile.png';
            return (
              <div key={worker._id} className="w-full max-w-full sm:max-w-2xl bg-cyan-50 rounded-2xl shadow-xl p-2 xs:p-3 sm:p-6 grid grid-cols-2 gap-2 sm:gap-4 border border-gray-100 hover:shadow-2xl transition-all duration-200 relative mx-auto min-h-[180px] xs:min-h-[220px] sm:min-h-[320px]">
                {/* Left Section */}
                <div className="flex flex-col items-center sm:items-start w-full gap-2 xs:gap-3 sm:gap-4 min-w-0">
                  {/* Name & Pic */}
                  <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 w-full min-w-0">
                    <img src={image} alt="Profile" className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-400 shadow shrink-0" />
                    <div className="font-bold truncate text-base xs:text-lg sm:text-2xl md:text-3xl text-blue-800 min-w-0">{worker.name}</div>
                  </div>
                  {/* Address, Salary, Available */}
                  <div className="flex flex-col gap-1 xs:gap-2 sm:gap-3 w-full mt-4 xs:mt-2 min-w-0">
                    <div className="flex items-center gap-3 xs:gap-2 text-gray-600 text-xs xs:text-sm sm:text-base min-w-0"><FaMapMarkerAlt className="text-blue-400" /> <span className="font-medium truncate">{card.address || 'N/A'}</span></div>
                    <div className="flex items-center gap-3 xs:gap-2 text-gray-600 text-xs xs:text-sm sm:text-base min-w-0"><FaMoneyBillWave className="text-green-500" /> <span className="font-medium truncate">{card.salaryDemand ? `৳${card.salaryDemand}` : 'Not set'}</span></div>
                    <div className="flex items-center gap-3 xs:gap-2 text-gray-600 text-xs xs:text-sm sm:text-base min-w-0">
                      {card.available ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-400" />}
                      <span className="font-medium truncate">{card.available ? 'Available' : 'Not Available'}</span>
                    </div>
                  </div>
                </div>
                {/* Right Section */}
                <div className="flex flex-col w-full gap-2 xs:gap-3 sm:gap-4 justify-between min-w-0">
                  {/* Rating at top right */}
                  <div className="flex items-center justify-end w-full">
                    <span className="flex items-center gap-1 text-yellow-500 font-bold text-sm xs:text-base sm:text-lg"><FaStar /> {worker.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  {/* Skills vertically with bg */}
                  <div className="flex flex-col gap-1 xs:gap-2 mt-1 xs:mt-2 bg-pink-50 rounded-lg p-2 xs:p-3 sm:p-4 min-w-0">
                    <div className="text-gray-700 font-semibold mb-1 text-xs xs:text-sm sm:text-base">Skills:</div>
                    {card.skills && card.skills.length > 0 ? (
                      <ul className="flex flex-col gap-2">
                        {card.skills.map(skill => (
                          <li key={skill} className="flex items-center gap-3 xs:gap-2 text-blue-700 font-medium text-xs xs:text-sm sm:text-base"><span className="w-2 h-2 bg-blue-400 rounded-full inline-block"></span>{skill}</li>
                        ))}
                      </ul>
                    ) : <div className="text-gray-400 text-xs xs:text-sm sm:text-base">N/A</div>}
                  </div>
                </div>
                {/* View Profile button at bottom left, responsive */}
                <div className="absolute left-2 xs:left-3 sm:left-6 bottom-2 xs:bottom-3 sm:bottom-6 flex justify-start">
                  <a href={`/worker/${worker._id}`} className="px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow text-center text-xs xs:text-sm sm:text-base">View Profile and Contact</a>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-8 flex justify-center">
        <Link to="/workers" className="px-6 py-3 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 transition shadow">See All Workers</Link>
      </div>
    </section>
  );
};

const HomePage = () => {
  const [openFaq, setOpenFaq] = React.useState(null);
  return (
    <main className="min-h-screen w-full flex flex-col bg-blue-50">
      <HeroSection />
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
      {/* Featured Workers Section */}
      <FeaturedWorkersSection />
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

export default HomePage;
