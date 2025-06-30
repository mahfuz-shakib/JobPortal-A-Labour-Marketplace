import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

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

  if (loading) return <div className="text-center mt-10 text-lg text-blue-600 font-semibold">Loading jobs...</div>;

  return (
    <section className="w-full max-w-7xl mx-auto mt-10 px-2 sm:px-4">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">Job Listings</h2>
      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => {
            const client = job.client || {};
            const ownerName = client.organizationName || client.name || 'Unknown';
            const ownerPic = client.profilePic || '/public/images/default-profile.png';
            return (
              <div key={job._id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-3 hover:shadow-2xl transition border border-gray-100 relative">
                <div className="flex items-center gap-3 mb-2">
                  <img src={ownerPic} alt="Owner" className="w-12 h-12 rounded-full object-cover border-2 border-blue-200" />
                  <div>
                    <div className="font-bold text-blue-700 text-lg leading-tight">{ownerName}</div>
                    <div className="text-xs text-gray-400">{client.organizationType || ''}</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-1">{job.title}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Location: {job.location}</span>
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">Budget: ${job.budget}</span>
                  {job.workCategory && <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">{job.workCategory}</span>}
                  {job.workDuration && <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full">{job.workDuration}</span>}
                  {job.workersNeeded > 1 && <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full">{job.workersNeeded} workers</span>}
                  {job.deadline && <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">Deadline: {job.deadline.slice(0,10)}</span>}
                  {job.applicationDeadline && <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full">Apply by: {job.applicationDeadline.slice(0,10)}</span>}
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition text-base"
                    onClick={() => setBidModal({ open: true, job })}
                  >
                    Bid
                  </button>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="flex-1 bg-white border border-blue-200 text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-blue-50 transition text-base text-center"
                  >
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
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