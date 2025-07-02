import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useParams, Link, useNavigate } from 'react-router-dom';

const IncomingBids = () => {
  const { user } = useContext(AuthContext);
  const { jobId } = useParams(); // Get jobId from URL if viewing bids for specific job
  const [bids, setBids] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBids = async () => {
      try {
        if (jobId) {
          // Fetch bids for specific job
          const [bidsRes, jobRes] = await Promise.all([
            axios.get(`/api/bids/job/${jobId}`),
            axios.get(`/api/jobs/${jobId}`)
          ]);
          setBids(bidsRes.data);
          setJob(jobRes.data);
        } else {
          // Fetch all incoming bids
          const bidsRes = await axios.get('/api/bids/incoming');
          setBids(bidsRes.data);
        }
      } catch (err) {
        setBids([]);
        setMessage(err.response?.data?.message || 'Failed to fetch bids.');
      }
      setLoading(false);
    };
    fetchBids();
  }, [jobId]);

  const handleAcceptBid = async (bidId) => {
    try {
      await axios.patch(`/api/bids/${bidId}/status`, { status: 'Accepted' });
      
      // Refresh job data to get updated assignment status
      if (jobId) {
        const jobRes = await axios.get(`/api/jobs/${jobId}`);
        setJob(jobRes.data);
        
        // Show appropriate message based on assignment status
        if (jobRes.data.assignedWorkersCount >= jobRes.data.workersNeeded) {
          setMessage('Bid accepted! All workers have been assigned to this job.');
        } else {
          setMessage(`Bid accepted! ${jobRes.data.workersNeeded - jobRes.data.assignedWorkersCount} more worker${jobRes.data.workersNeeded - jobRes.data.assignedWorkersCount !== 1 ? 's' : ''} still needed.`);
        }
      } else {
        setMessage('Bid accepted successfully!');
      }
      
      // Refresh bids
      const bidsRes = await axios.get(jobId ? `/api/bids/job/${jobId}` : '/api/bids/incoming');
      setBids(bidsRes.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to accept bid.');
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      await axios.patch(`/api/bids/${bidId}/status`, { status: 'Rejected' });
      setMessage('Bid rejected successfully!');
      // Refresh bids
      const bidsRes = await axios.get(jobId ? `/api/bids/job/${jobId}` : '/api/bids/incoming');
      setBids(bidsRes.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to reject bid.');
    }
  };

  const showProposal = (proposal) => {
    setSelectedProposal(proposal);
    setShowProposalModal(true);
  };

  const viewWorkerProfile = (workerId) => {
    navigate(`/worker/${workerId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {jobId ? 'Job Bids' : 'Incoming Bids'}
          </h1>
          <p className="text-gray-400">
            {jobId ? `Bids received for "${job?.title}"` : 'Manage bids for your posted jobs'}
          </p>
          {jobId && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Budget:</span>
                  <span className="text-white ml-2">${job?.budget}</span>
                </div>
                <div>
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white ml-2">{job?.location}</span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    job?.status === 'Open' ? 'bg-green-100 text-green-800' :
                    job?.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {job?.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Workers:</span>
                  <span className="text-white ml-2">
                    {job?.workers?.length || 0}/{job?.workersNeeded || 1} assigned
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg font-semibold ${
            message.includes('successfully') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-gray-300">Loading bids...</div>
          </div>
        ) : bids.length === 0 ? (
          <div className="text-center">
            <div className="text-gray-400 text-xl mb-4">
              {jobId ? 'No bids received for this job yet.' : 'No incoming bids yet.'}
            </div>
            {jobId && (
              <Link 
                to="/posted-jobs"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Back to Posted Jobs
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
            {/* Header */}
            <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
              <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-300">
                <div>Worker</div>
                <div>Bid Amount</div>
                <div>Rating</div>
                <div>Proposal</div>
                <div>Submitted</div>
                <div>Actions</div>
              </div>
            </div>

            {/* Bids List */}
            <div className="divide-y divide-gray-700">
              {bids.map(bid => (
                <div key={bid._id} className="px-6 py-4 hover:bg-gray-750 transition-colors">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    {/* Worker Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                          {bid.worker?.name?.charAt(0)?.toUpperCase() || 'W'}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm cursor-pointer hover:text-blue-300 transition" 
                               onClick={() => viewWorkerProfile(bid.worker._id)}>
                            {bid.worker?.name}
                          </div>
                          <div className="text-gray-400 text-xs">{bid.worker?.email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Bid Amount */}
                    <div className="text-green-400 font-bold text-lg">
                      ${bid.amount}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {getRatingStars(bid.worker?.rating || 0)}
                      <span className="text-gray-400 text-xs ml-1">({bid.worker?.rating || 0})</span>
                    </div>

                    {/* Proposal */}
                    <div>
                      <button
                        onClick={() => showProposal(bid.message)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
                      >
                        View Proposal
                      </button>
                    </div>

                    {/* Submitted Date */}
                    <div className="text-gray-400 text-sm">
                      {formatDate(bid.createdAt)}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {bid.status === 'Pending' && job?.status === 'Open' ? (
                        <>
                          <button
                            onClick={() => handleAcceptBid(bid._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectBid(bid._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          bid.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                          bid.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {bid.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {jobId && (
          <div className="mt-6 text-center">
            <Link 
              to="/posted-jobs"
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Back to Posted Jobs
            </Link>
          </div>
        )}

        {/* Proposal Modal */}
        {showProposalModal && selectedProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Worker Proposal</h2>
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-6">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedProposal}
                </p>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default IncomingBids; 