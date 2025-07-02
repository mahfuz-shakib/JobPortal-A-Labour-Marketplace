import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const PostedJobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, jobId: null, jobTitle: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/api/jobs/my');
        // Fetch bid counts for each job
        const jobsWithBidCounts = await Promise.all(
          res.data.map(async (job) => {
            try {
              const bidsRes = await axios.get(`/api/bids/job/${job._id}`);
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
      await axios.delete(`/api/jobs/${deleteConfirm.jobId}`);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'Assigned': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Posted Jobs</h1>
          <p className="text-gray-400">Manage and track your posted labor jobs</p>
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
            <div className="text-gray-300">Loading your jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center">
            <div className="text-gray-400 text-xl mb-4">You have not posted any jobs yet.</div>
            <Link 
              to="/post-job"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
            {/* Header */}
            <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
              <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-300">
                <div>Posted Date</div>
                <div>Job Details</div>
                <div>Application Deadline</div>
                <div>Incoming Bids</div>
              </div>
            </div>

            {/* Job List */}
            <div className="divide-y divide-gray-700">
              {jobs.map(job => (
                <div key={job._id} className="px-6 py-4 hover:bg-gray-750 transition-colors">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    {/* Left: Posting Date */}
                    <div className="text-sm text-gray-400">
                      {formatDate(job.createdAt)}
                    </div>

                    {/* Middle-Left: Job Title, Status, Details Button */}
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold text-sm leading-tight">{job.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="text-blue-400 hover:text-blue-300 text-xs font-medium transition"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => confirmDelete(job._id, job.title)}
                          className="text-red-400 hover:text-red-300 text-xs font-medium transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Middle-Right: Application Deadline */}
                    <div className="text-sm">
                      {job.applicationDeadline ? (
                        <span className="text-red-400 font-medium">
                          {formatDate(job.applicationDeadline)}
                        </span>
                      ) : (
                        <span className="text-gray-500">No deadline</span>
                      )}
                    </div>

                    {/* Right: Number of Incoming Bids */}
                    <div className="text-center">
                      <Link
                        to={`/incoming-bids/${job._id}`}
                        className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold transition"
                        title={`View ${job.bidCount} bid${job.bidCount !== 1 ? 's' : ''}`}
                      >
                        {job.bidCount}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "<span className="text-white font-semibold">{deleteConfirm.jobTitle}</span>"? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete Job'}
                </button>
                <button
                  onClick={cancelDelete}
                  disabled={deleting}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded transition"
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