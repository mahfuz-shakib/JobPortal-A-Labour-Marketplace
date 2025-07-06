import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { createApiUrl, API_ENDPOINTS } from '../config/api';

const SubmittedBids = () => {
  const { user } = useContext(AuthContext);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get(createApiUrl(API_ENDPOINTS.BIDS_MY));
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
        case 'jobTitle':
          aValue = a.job?.title?.toLowerCase() || '';
          bValue = b.job?.title?.toLowerCase() || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'budget':
          aValue = parseFloat(a.job?.budget) || 0;
          bValue = parseFloat(b.job?.budget) || 0;
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
          <h1 className="text-4xl font-bold text-gray-900 mb-3">My Submitted Bids</h1>
          {/* <p className="text-gray-600 text-lg">Track the status of all your job applications</p> */}
        </div>

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
            message.includes('successfully') 
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
                    { key: 'jobTitle', label: 'Job Title', icon: '📝' },
                    { key: 'budget', label: 'Job Budget', icon: '💵' },
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
            <div className="text-gray-600 text-lg">Loading your bids...</div>
          </div>
        ) : bids.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 max-w-md mx-auto">
              <div className="text-6xl mb-4">📨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bids Submitted Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't submitted any bids yet. Start browsing available jobs and submit your first bid!
              </p>
              <Link 
                to="/jobs"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                <span className="mr-2">🔍</span>
                Browse Available Jobs
              </Link>
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
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2">
                          <Link to={`/jobs/${bid.job?._id}`} className="hover:text-blue-600 transition-colors">
                            {bid.job?.title || 'Job Title Not Available'}
                          </Link>
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <span className="mr-4">📍 {bid.job?.location || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-4">💵 Budget: ${bid.job?.budget || 'Not specified'}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color} flex items-center`}>
                        <span className="mr-1">{statusConfig.icon}</span>
                        {bid.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">💰</span>
                        <div>
                          <p className="text-sm text-gray-600">Your Bid</p>
                          <p className="text-xl font-bold text-gray-900">${bid.amount}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Submitted</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(bid.createdAt)}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      {bid.message && (
                        <button
                          onClick={() => {
                            setSelectedProposal(bid.message);
                            setShowProposalModal(true);
                          }}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg text-center transition-colors"
                        >
                          📄 View Your Proposal
                        </button>
                      )}
                      
                      <div className="flex gap-2">
                        <Link
                          to={`/jobs/${bid.job?._id}`}
                          className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-4 rounded-lg text-center transition-colors"
                        >
                          👁️ View Job
                        </Link>
                        {bid.status === 'Accepted' && (
                          <Link
                            to={`/jobs/${bid.job?._id}`}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
                          >
                            🚀 Start Work
                          </Link>
                        )}
                      </div>
                    </div>
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
                <h2 className="text-2xl font-bold text-gray-900">Your Job Proposal</h2>
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

export default SubmittedBids; 