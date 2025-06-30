import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SubmittedBids = () => {
  const { user } = useContext(AuthContext);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get('/api/bids/my');
        setBids(res.data);
      } catch (err) {
        setBids([]);
        setMessage('Failed to fetch your bids.');
      }
      setLoading(false);
    };
    fetchBids();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return '⏳';
      case 'Accepted':
        return '✅';
      case 'Rejected':
        return '❌';
      default:
        return '📋';
    }
  };

  return (
    <section className="min-h-[60vh] bg-gray-900 text-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Submitted Bids</h1>
          <p className="text-gray-400">Track the status of all your job applications</p>
        </div>

        {message && (
          <div className="mb-4 p-4 rounded-lg font-semibold bg-red-900 text-red-300">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-gray-300">Loading your bids...</div>
          </div>
        ) : bids.length === 0 ? (
          <div className="text-center">
            <div className="text-gray-400 text-xl mb-4">
              You haven't submitted any bids yet.
            </div>
            <p className="text-gray-500 mb-6">
              Start browsing available jobs and submit your first bid!
            </p>
            <Link 
              to="/jobs"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Browse Available Jobs
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
            {/* Header */}
            <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
              <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-300">
                <div>Job Details</div>
                <div>Bid Amount</div>
                <div>Proposal</div>
                <div>Status</div>
                <div>Submitted</div>
                <div>Actions</div>
              </div>
            </div>

            {/* Bids List */}
            <div className="divide-y divide-gray-700">
              {bids.map(bid => (
                <div key={bid._id} className="px-6 py-4 hover:bg-gray-750 transition-colors">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    {/* Job Details */}
                    <div className="space-y-1">
                      <div className="text-white font-semibold text-sm cursor-pointer hover:text-blue-300 transition">
                        <Link to={`/jobs/${bid.job?._id}`}>
                          {bid.job?.title || 'Job Title Not Available'}
                        </Link>
                      </div>
                      <div className="text-gray-400 text-xs">
                        {bid.job?.location || 'Location not specified'}
                      </div>
                      <div className="text-gray-500 text-xs">
                        Budget: ${bid.job?.budget || 'Not specified'}
                      </div>
                    </div>

                    {/* Bid Amount */}
                    <div className="text-green-400 font-bold text-lg">
                      ${bid.amount}
                    </div>

                    {/* Proposal */}
                    <div>
                      {bid.message ? (
                        <button
                          onClick={() => {
                            setSelectedProposal(bid.message);
                            setShowProposalModal(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
                        >
                          View Proposal
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">No proposal</span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getStatusIcon(bid.status)}</span>
                      {getStatusBadge(bid.status)}
                    </div>

                    {/* Submitted Date */}
                    <div className="text-gray-400 text-sm">
                      {formatDate(bid.createdAt)}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/jobs/${bid.job?._id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
                      >
                        View Job
                      </Link>
                      {bid.status === 'Accepted' && (
                        <Link
                          to={`/jobs/${bid.job?._id}`}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
                        >
                          Start Work
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {bids.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">{bids.length}</div>
              <div className="text-gray-400 text-sm">Total Bids</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-yellow-400">
                {bids.filter(bid => bid.status === 'Pending').length}
              </div>
              <div className="text-gray-400 text-sm">Pending</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-green-400">
                {bids.filter(bid => bid.status === 'Accepted').length}
              </div>
              <div className="text-gray-400 text-sm">Accepted</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-red-400">
                {bids.filter(bid => bid.status === 'Rejected').length}
              </div>
              <div className="text-gray-400 text-sm">Rejected</div>
            </div>
          </div>
        )}

        {/* Proposal Modal */}
        {showProposalModal && selectedProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Job Proposal</h2>
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

export default SubmittedBids; 