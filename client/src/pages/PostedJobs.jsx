import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { createApiUrl, API_ENDPOINTS } from '../config/api';

const PostedJobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, jobId: null, jobTitle: '' });
  const [message, setMessage] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(createApiUrl(API_ENDPOINTS.JOBS_MY));
        // Fetch bid counts for each job
        const jobsWithBidCounts = await Promise.all(
          res.data.map(async (job) => {
            try {
              const bidsRes = await axios.get(createApiUrl(API_ENDPOINTS.BIDS_JOB(job._id)));
              return { ...job, bidCount: bidsRes.data.length };
            } catch (err) {
              return { ...job, bidCount: 0 };
            }
          })
        );
        setJobs(jobsWithBidCounts);
      } catch (err) {
        setJobs([]);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const handleDelete = async () => {
    if (!deleteConfirm.jobId) return;
    
    setDeleting(true);
    setMessage('');
    
    try {
      await axios.delete(createApiUrl(API_ENDPOINTS.JOB_DETAILS(deleteConfirm.jobId)));
      setJobs(jobs.filter(job => job._id !== deleteConfirm.jobId));
      setMessage('Job deleted successfully!');
      setDeleteConfirm({ show: false, jobId: null, jobTitle: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete job.');
    }
    
    setDeleting(false);
  };

  const confirmDelete = (jobId, jobTitle) => {
    setDeleteConfirm({ show: true, jobId, jobTitle });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, jobId: null, jobTitle: '' });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Open':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: '🟢',
          bg: 'bg-emerald-50'
        };
      case 'Assigned':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: '🔵',
          bg: 'bg-blue-50'
        };
      case 'Completed':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '✅',
          bg: 'bg-gray-50'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '⚪',
          bg: 'bg-gray-50'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === '') return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const isDeadlineNear = (deadline) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isDeadlineExpired = (deadline) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate < today;
  };

  // Sort function
  const sortJobs = (jobsToSort) => {
    return [...jobsToSort].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'budget':
          aValue = parseFloat(a.budget) || 0;
          bValue = parseFloat(b.budget) || 0;
          break;
        case 'bidCount':
          aValue = a.bidCount || 0;
          bValue = b.bidCount || 0;
          break;
        case 'applicationDeadline':
          aValue = a.applicationDeadline ? new Date(a.applicationDeadline).getTime() : 0;
          bValue = b.applicationDeadline ? new Date(b.applicationDeadline).getTime() : 0;
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

  const getSortedJobs = () => {
    return sortJobs(jobs);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Your Posted Jobs</h1>
          {/* <p className="text-gray-600 text-lg">Manage and track your labor job postings</p> */}
        </div>

        {/* Stats Summary */}
        {jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-yellow-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <span className="text-2xl">🟢</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Open</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.filter(job => job.status === 'Open').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">🔵</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Assigned</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.filter(job => job.status === 'Assigned').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.filter(job => job.status === 'Completed').length}
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
        {jobs.length > 0 && (
          <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-700 mr-3">Sort by:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'createdAt', label: 'New/Old', icon: '🆕' },
                    { key: 'title', label: 'Job Title', icon: '📝' },
                    { key: 'status', label: 'Status', icon: '🏷️' },
                    { key: 'budget', label: 'Budget', icon: '💰' },
                    { key: 'bidCount', label: 'Bids', icon: '📨' },
                    { key: 'applicationDeadline', label: 'Deadline', icon: '⏰' }
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
                {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-gray-600 text-lg">Loading your jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Posted Yet</h3>
              <p className="text-gray-600 mb-6">Start by posting your first labor job to find skilled workers.</p>
              <Link 
                to="/post-job"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                <span className="mr-2">➕</span>
                Post Your First Job
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {getSortedJobs().map(job => {
              const statusConfig = getStatusConfig(job.status);
              const deadlineNear = isDeadlineNear(job.applicationDeadline);
              const deadlineExpired = isDeadlineExpired(job.applicationDeadline);
              
              return (
                <div key={job._id} className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${statusConfig.bg}`}>
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight pr-2">
                        {job.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color} flex items-center`}>
                        <span className="mr-1">{statusConfig.icon}</span>
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <span className="mr-4">📅 Posted: {formatDate(job.createdAt)}</span>
                    </div>

                    {job.applicationDeadline && (
                      <div className={`flex items-center text-sm ${
                        deadlineExpired ? 'text-red-600' : 
                        deadlineNear ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        <span className="mr-1">⏰</span>
                        <span className="font-medium">
                          {deadlineExpired ? 'Deadline Expired' : 'Deadline'}: {formatDate(job.applicationDeadline)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">💰</span>
                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="font-semibold text-gray-900">৳{job.budget}</p>
                        </div>
                      </div>
                      
                      <Link
                        to={`/incoming-bids/${job._id}`}
                        className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          job.bidCount > 0 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                        title={`View ${job.bidCount} bid${job.bidCount !== 1 ? 's' : ''}`}
                      >
                        <span className="mr-1">📨</span>
                        {job.bidCount} Bid{job.bidCount !== 1 ? 's' : ''}
                      </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg text-center transition-colors"
                      >
                        👁️ View Details
                      </Link>
                      <button
                        onClick={() => confirmDelete(job._id, job.title)}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors"
                        title="Delete job"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-gray-200">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete "<span className="text-gray-900 font-semibold">{deleteConfirm.jobTitle}</span>"? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
                >
                  {deleting ? '🗑️ Deleting...' : '🗑️ Delete Job'}
                </button>
                <button
                  onClick={cancelDelete}
                  disabled={deleting}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PostedJobs; 