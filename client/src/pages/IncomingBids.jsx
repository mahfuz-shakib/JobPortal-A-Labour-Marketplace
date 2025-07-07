import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createApiUrl, API_ENDPOINTS } from '../config/api';

const IncomingBids = () => {
  const { user } = useContext(AuthContext);
  const { jobId } = useParams(); // Get jobId from URL if viewing bids for specific job
  const [bids, setBids] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBids = async () => {
      try {
        if (jobId) {
          // Fetch bids for specific job
          const [bidsRes, jobRes] = await Promise.all([
            axios.get(createApiUrl(API_ENDPOINTS.BIDS_JOB(jobId))),
            axios.get(createApiUrl(API_ENDPOINTS.JOB_DETAILS(jobId)))
          ]);
          setBids(bidsRes.data);
          setJob(jobRes.data);
        } else {
          // Fetch all incoming bids
          const bidsRes = await axios.get(createApiUrl(API_ENDPOINTS.BIDS_INCOMING));
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
      await axios.patch(createApiUrl(API_ENDPOINTS.BID_STATUS(bidId)), { status: 'Accepted' });
      
      // Refresh job data to get updated assignment status
      if (jobId) {
        const jobRes = await axios.get(createApiUrl(API_ENDPOINTS.JOB_DETAILS(jobId)));
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
      const bidsRes = await axios.get(jobId ? createApiUrl(API_ENDPOINTS.BIDS_JOB(jobId)) : createApiUrl(API_ENDPOINTS.BIDS_INCOMING));
      setBids(bidsRes.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to accept bid.');
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      await axios.patch(createApiUrl(API_ENDPOINTS.BID_STATUS(bidId)), { status: 'Rejected' });
      setMessage('Bid rejected successfully!');
      // Refresh bids
      const bidsRes = await axios.get(jobId ? createApiUrl(API_ENDPOINTS.BIDS_JOB(jobId)) : createApiUrl(API_ENDPOINTS.BIDS_INCOMING));
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
    if (!dateString || dateString === '') return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '⏳',
          bg: 'bg-yellow-50'
        };
      case 'Accepted':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: '✅',
          bg: 'bg-emerald-50'
        };
      case 'Rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: '❌',
          bg: 'bg-red-50'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '⚪',
          bg: 'bg-gray-50'
        };
    }
  };

  // Sort function
  const sortBids = (bidsToSort) => {
    return [...bidsToSort].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'amount':
          aValue = parseFloat(a.amount) || 0;
          bValue = parseFloat(b.amount) || 0;
          break;
        case 'rating':
          aValue = a.worker?.rating || 0;
          bValue = b.worker?.rating || 0;
          break;
        case 'workerName':
          aValue = a.worker?.name?.toLowerCase() || '';
          bValue = b.worker?.name?.toLowerCase() || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const getSortedBids = () => {
    return sortBids(bids);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {jobId ? 'Job Bids' : 'Incoming Bids'}
          </h1>
          <p className="text-gray-600 text-lg">
            {jobId ? `Bids received for "${job?.title}"` : 'Manage bids for your posted jobs'}
          </p>
        </div>

        {/* Job Info Card */}
        {jobId && job && (
          <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">💰</span>
                    <div>
                      <p className="text-gray-600">Budget</p>
                      <p className="font-semibold text-gray-900">৳{job.budget}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">📍</span>
                    <div>
                      <p className="text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">👥</span>
                    <div>
                      <p className="text-gray-600">Workers</p>
                      <p className="font-semibold text-gray-900">
                        {job.workers?.length || 0}/{job.workersNeeded || 1} assigned
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">🏷️</span>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        job.status === 'Open' ? 'bg-emerald-100 text-emerald-800' :
                        job.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Link 
                to="/posted-jobs"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                ← Back to Jobs
              </Link>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {bids.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📨</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Bids</p>
                  <p className="text-2xl font-bold text-gray-900">{bids.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bids.filter(bid => bid.status === 'Pending').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bids.filter(bid => bid.status === 'Accepted').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-2xl">❌</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bids.filter(bid => bid.status === 'Rejected').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className={`mb-6 p-4 rounded-xl font-semibold shadow-sm ${
            message.includes('successfully') || message.includes('accepted') || message.includes('assigned')
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Sort Controls */}
        {bids.length > 0 && (
          <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-700 mr-3">Sort by:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'createdAt', label: 'New/Old', icon: '🆕' },
                    { key: 'amount', label: 'Bid Amount', icon: '💰' },
                    { key: 'rating', label: 'Worker Rating', icon: '⭐' },
                    { key: 'workerName', label: 'Worker Name', icon: '👤' },
                    { key: 'status', label: 'Status', icon: '🏷️' }
                  ].map(({ key, label, icon }) => (
                    <button
                      key={key}
                      onClick={() => handleSort(key)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        sortBy === key
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      <span className="mr-1">{icon}</span>
                      {label}
                      {sortBy === key && (
                        <span className="ml-1 text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {bids.length} bid{bids.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-gray-600 text-lg">Loading bids...</div>
          </div>
        ) : bids.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 max-w-md mx-auto">
              <div className="text-6xl mb-4">📨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {jobId ? 'No Bids Yet' : 'No Incoming Bids'}
              </h3>
              <p className="text-gray-600 mb-6">
                {jobId 
                  ? 'No workers have submitted bids for this job yet. Check back later!' 
                  : 'You haven\'t received any bids for your posted jobs yet.'
                }
              </p>
              {jobId ? (
                <Link 
                  to="/posted-jobs"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  ← Back to Posted Jobs
                </Link>
              ) : (
                <Link 
                  to="/post-job"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <span className="mr-2">➕</span>
                  Post a New Job
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {getSortedBids().map(bid => {
              const statusConfig = getStatusConfig(bid.status);
              
              return (
                <div key={bid._id} className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${statusConfig.bg}`}>
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                          {bid.worker?.name?.charAt(0)?.toUpperCase() || 'W'}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" 
                               onClick={() => viewWorkerProfile(bid.worker._id)}>
                            {bid.worker?.name}
                          </h3>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color} flex items-center`}>
                        <span className="mr-1">{statusConfig.icon}</span>
                        {bid.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">💰</span>
                        <div>
                          <p className="text-sm text-gray-600">Bid Amount</p>
                          <p className="text-xl font-bold text-gray-900">৳{bid.amount}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          {getRatingStars(bid.worker?.rating || 0)}
                          <span className="text-gray-600 text-sm ml-1">({bid.worker?.rating || 0})</span>
                        </div>
                        <p className="text-xs text-gray-500">Worker Rating</p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <span className="mr-4">📅 Submitted: {formatDate(bid.createdAt)}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <button
                        onClick={() => showProposal(bid.message)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg text-center transition-colors"
                      >
                        📄 View Proposal
                      </button>
                    </div>

                    {/* Actions */}
                    {bid.status === 'Pending' && job?.status === 'Open' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptBid(bid._id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                        >
                          ✅ Accept Bid
                        </button>
                        <button
                          onClick={() => handleRejectBid(bid._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${statusConfig.color}`}>
                          {statusConfig.icon} {bid.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Proposal Modal */}
        {showProposalModal && selectedProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-4 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Worker Proposal</h2>
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedProposal}
                </p>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-xl transition-colors"
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