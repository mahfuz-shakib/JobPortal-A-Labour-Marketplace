import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AcceptedJobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/api/jobs/accepted');
        setJobs(res.data);
      } catch (err) {
        setJobs([]);
        setMessage('Failed to fetch your accepted jobs.');
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Open': 'bg-yellow-100 text-yellow-800',
      'Assigned': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open':
        return '⏳';
      case 'Assigned':
        return '📋';
      case 'In Progress':
        return '🔄';
      case 'Completed':
        return '✅';
      case 'Cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  const handleStatusUpdate = async (jobId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [jobId]: true }));
    setMessage('');
    
    try {
      const res = await axios.patch(`/api/jobs/${jobId}/worker-status`, { status: newStatus });
      
      // Update the job in the local state
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job._id === jobId ? res.data : job
        )
      );
      
      setMessage(`Job status updated to ${newStatus} successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update job status.');
    }
    
    setUpdatingStatus(prev => ({ ...prev, [jobId]: false }));
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Open':
        return 'In Progress'; // Worker can start work even if job is still open
      case 'Assigned':
        return 'In Progress';
      case 'In Progress':
        return 'Completed';
      default:
        return null;
    }
  };

  const getActionButton = (job) => {
    const nextStatus = getNextStatus(job.status);
    if (!nextStatus) return null;

    const buttonConfig = {
      'In Progress': {
        text: 'Start Work',
        color: 'bg-green-600 hover:bg-green-700',
        icon: '🚀'
      },
      'Completed': {
        text: 'Mark Complete',
        color: 'bg-blue-600 hover:bg-blue-700',
        icon: '✅'
      }
    };

    const config = buttonConfig[nextStatus];
    if (!config) return null;

    return (
      <button
        onClick={() => handleStatusUpdate(job._id, nextStatus)}
        disabled={updatingStatus[job._id]}
        className={`${config.color} text-white px-3 py-1 rounded text-xs font-semibold transition disabled:opacity-50`}
      >
        {updatingStatus[job._id] ? 'Updating...' : `${config.icon} ${config.text}`}
      </button>
    );
  };

  return (
    <section className="min-h-[60vh] bg-gray-900 text-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Accepted Jobs</h1>
          <p className="text-gray-400">Manage and track all jobs where your bid has been accepted</p>
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
            <div className="text-gray-300">Loading your accepted jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center">
            <div className="text-gray-400 text-xl mb-4">
              You haven't been accepted for any jobs yet.
            </div>
            <p className="text-gray-500 mb-6">
              Start submitting bids on available jobs to get accepted!
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
                <div>Your Bid</div>
                <div>Proposal</div>
                <div>Status</div>
                <div>Assigned</div>
                <div>Actions</div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="divide-y divide-gray-700">
              {jobs.map(job => (
                <div key={job._id} className="px-6 py-4 hover:bg-gray-750 transition-colors">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    {/* Job Details */}
                    <div className="space-y-1">
                      <div className="text-white font-semibold text-sm cursor-pointer hover:text-blue-300 transition">
                        <Link to={`/jobs/${job._id}`}>
                          {job.title}
                        </Link>
                      </div>
                      <div className="text-gray-400 text-xs">
                        {job.location || 'Location not specified'}
                      </div>
                      <div className="text-gray-500 text-xs">
                        Budget: ${job.budget} | {job.workCategory || 'Category not specified'}
                      </div>
                      {job.deadline && (
                        <div className="text-gray-500 text-xs">
                          Deadline: {formatDate(job.deadline)}
                        </div>
                      )}
                    </div>

                    {/* Your Bid Amount */}
                    <div className="text-blue-400 font-bold text-lg">
                      ${job.bidDetails?.amount || 'N/A'}
                    </div>

                    {/* Proposal */}
                    <div>
                      {job.bidDetails?.message ? (
                        <button
                          onClick={() => {
                            setSelectedProposal(job.bidDetails.message);
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
                      <span className="text-lg">{getStatusIcon(job.status)}</span>
                      {getStatusBadge(job.status)}
                    </div>

                    {/* Assigned Date */}
                    <div className="text-gray-400 text-sm">
                      {job.bidDetails?.submittedAt ? formatDate(job.bidDetails.submittedAt) : formatDate(job.updatedAt)}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
                      >
                        View Details
                      </Link>
                      {getActionButton(job)}
                    </div>
                  </div>

                  {/* Client Information */}
                  {job.client && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="text-gray-400 text-xs font-semibold mb-1">Client Information:</div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {job.client.name?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                          <span className="text-gray-300 text-sm">{job.client.name}</span>
                        </div>
                        {job.client.phone && (
                          <a
                            href={`tel:${job.client.phone}`}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            📞 {job.client.phone}
                          </a>
                        )}
                        <a
                          href={`mailto:${job.client.email}`}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          ✉️ {job.client.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {jobs.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">{jobs.length}</div>
              <div className="text-gray-400 text-sm">Total Jobs</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-yellow-400">
                {jobs.filter(job => job.status === 'Open').length}
              </div>
              <div className="text-gray-400 text-sm">Accepted (Open)</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">
                {jobs.filter(job => job.status === 'Assigned').length}
              </div>
              <div className="text-gray-400 text-sm">Assigned</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-yellow-400">
                {jobs.filter(job => job.status === 'In Progress').length}
              </div>
              <div className="text-gray-400 text-sm">In Progress</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-green-400">
                {jobs.filter(job => job.status === 'Completed').length}
              </div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
          </div>
        )}
      </div>

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
    </section>
  );
};

export default AcceptedJobs; 