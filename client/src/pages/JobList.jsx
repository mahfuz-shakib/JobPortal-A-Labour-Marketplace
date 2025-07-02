import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';

const JobList = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidModal, setBidModal] = useState({ open: false, job: null });
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filtering
  const filteredJobs = jobs.filter(job => {
    const searchLower = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      (job.workCategory || '').toLowerCase().includes(searchLower)
    );
  });

  // Sorting
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'budgetHigh') return b.budget - a.budget;
    if (sortBy === 'budgetLow') return a.budget - b.budget;
    return 0;
  });

  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const paginatedJobs = sortedJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const handleBid = async (jobId) => {
    if (!user || user.role !== 'worker') {
      navigate('/login');
      return;
    }
    setBidError('');
    setBidSuccess('');
    try {
      await axios.post('/api/bids', { jobId, amount: bidAmount, message: bidMessage });
      setBidSuccess('Bid submitted successfully!');
      setBidAmount('');
      setBidMessage('');
    } catch (err) {
      setBidError(err?.response?.data?.message || 'Failed to submit bid.');
    }
  };

  if (loading) return <div className="text-center text-lg text-blue-600 font-semibold">Loading jobs...</div>;

  return (
    <section className="min-h-screen w-full max-w-7xl mx-auto px-2 sm:px-4 bg-blue-50">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center py-5">Job Listings</h2>
      {/* Modern Filter Bar */}
      <div className="flex justify-center mb-10">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl bg-gray-50 rounded-2xl shadow-lg px-6 py-4 border border-gray-200">
          {/* Search Box */}
          <div className="flex items-center flex-1 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-200 transition">
            <FaSearch className="text-blue-400 mr-3 text-lg" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search jobs by title, location, or category..."
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-base font-semibold"
            />
          </div>
          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-56">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-base font-semibold shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none pr-8 cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="budgetHigh">Budget: High to Low</option>
              <option value="budgetLow">Budget: Low to High</option>
            </select>
            <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>
        </div>
      </div>
      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 place-items-center">
          {paginatedJobs.map(job => {
            const client = job.client || {};
            const ownerName = client.organizationName || client.name || 'Unknown';
            const ownerPic = client.profilePic || '/public/images/default-profile.png';
            return (
              <div key={job._id} className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 relative group w-full max-w-lg">
                {/* Header: Image left, title and owner stacked right */}
                <div className="flex items-center gap-4 mb-1">
                  {job.jobImage ? (
                    <img src={job.jobImage} alt="Job" className="w-14 h-14 rounded-lg object-cover border-2 border-blue-200 shadow-sm" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 border-2 border-blue-200 shadow-sm">
                      {ownerName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col justify-center gap-y-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug">{job.title}</span>
                    <span className="font-semibold text-blue-700 text-base leading-tight group-hover:text-blue-600 transition-colors">{ownerName}</span>
                    <span className="text-xs text-gray-400 italic">{client.organizationType || ''}</span>
                  </div>
                </div>
                {/* Job Description Preview (one line) */}
                <p className="text-gray-500 text-sm mb-2 truncate">{job.description}</p>
                {/* Job Attributes */}
                <div className="flex flex-wrap gap-2 text-xs mb-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">{job.location}</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">${job.budget}</span>
                  {job.workCategory && <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">{job.workCategory}</span>}
                  {job.workDuration && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">{job.workDuration}</span>}
                  {job.workersNeeded > 1 && <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-semibold">{job.workersNeeded} workers</span>}
                  {job.deadline && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">Deadline: {job.deadline.slice(0,10)}</span>}
                  {job.applicationDeadline && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">Apply by: {job.applicationDeadline.slice(0,10)}</span>}
                </div>
                {/* Status Tag */}
                <div className="absolute top-5 right-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-gray-200 ${
                    job.status === 'Open' ? 'bg-green-50 text-green-700' :
                    job.status === 'Assigned' ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status}
                  </span>
                </div>
                {/* Actions */}
                <div className="flex gap-3 mt-auto pt-2">
                  <button
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => setBidModal({ open: true, job })}
                  >
                    Bid
                  </button>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="flex-1 bg-white border border-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-50 transition text-base text-center focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-semibold text-gray-700">Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      {/* Bid Modal */}
      {bidModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl" onClick={() => setBidModal({ open: false, job: null })}>&times;</button>
            <h3 className="text-xl font-bold text-blue-700 mb-4">Bid on: {bidModal.job.title}</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Bid Amount</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={bidAmount}
                onChange={e => setBidAmount(e.target.value)}
                placeholder="Enter your bid amount"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Message (optional)</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={bidMessage}
                onChange={e => setBidMessage(e.target.value)}
                placeholder="Add a message for the client"
              />
            </div>
            {bidError && <div className="text-red-500 font-semibold mb-2">{bidError}</div>}
            {bidSuccess && <div className="text-green-600 font-semibold mb-2">{bidSuccess}</div>}
            <button
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg shadow transition text-lg mt-2"
              onClick={() => handleBid(bidModal.job._id)}
              disabled={!bidAmount || !!bidSuccess}
            >
              Submit Bid
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default JobList; 