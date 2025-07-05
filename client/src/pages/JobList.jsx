import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';
import { createApiUrl, API_ENDPOINTS } from '../config/api';
import JobCard from '../components/JobCard';
import BidForm from '../components/BidForm';

const JobList = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const formatDate = (dateString) => {
    if (!dateString || dateString === '') return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString();
    } catch (error) {
      return '';
    }
  };

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
      const res = await axios.get(createApiUrl(API_ENDPOINTS.JOBS));
      setJobs(res.data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

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
          {paginatedJobs.map(job => (
            <JobCard 
              key={job._id} 
              job={job} 
              onBid={handleBid}
              onDetails={(job) => {
                if (!user) {
                  navigate('/login', { state: { from: `/jobs/${job._id}` } });
                  return;
                }
                navigate(`/jobs/${job._id}`);
              }}
            />
          ))}
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
  );
};

export default JobList; 