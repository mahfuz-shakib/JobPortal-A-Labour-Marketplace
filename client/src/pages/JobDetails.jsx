import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ReviewModal from '../components/ReviewModal';
import BidForm from '../components/BidForm';
import { createApiUrl, API_ENDPOINTS } from '../config/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);
  const [editJobImage, setEditJobImage] = useState();
  const [editJobImagePreview, setEditJobImagePreview] = useState();
  // Review state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [reviewMessage, setReviewMessage] = useState('');
  // Worker proposal state
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState('');

  const workCategories = [
    'Cooking/Catering',
    'Cook/Chef',
    'Masonry',
    'Electrical',
    'Plumbing',
    'Painting',
    'Carpentry',
    'Cleaning',
    'Construction',
    'Moving & Packing',
    'Roofing',
    'Flooring',
    'Welding',
    'Demolition',
    'Gardening',
    'Delivery',
    'Loading/Unloading',
    'Maintenance',
    'Helping Hand',
    'Other'
  ];

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(createApiUrl(API_ENDPOINTS.JOB_DETAILS(id)));
        setJob(res.data);
        setEditForm({
          title: res.data.title,
          description: res.data.description,
          location: res.data.location,
          budget: res.data.budget,
          workCategory: res.data.workCategory || '',
          workDuration: res.data.workDuration || '',
          workersNeeded: res.data.workersNeeded || 1,
          requirements: res.data.requirements || '',
          applicationDeadline: res.data.applicationDeadline || ''
        });
        setEditJobImage(res.data.jobImage);
        setEditJobImagePreview(res.data.jobImage);
      } catch (err) {
        setJob(null);
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);



  const handleBidSubmit = async (bidData) => {
    setSubmitting(true);
    try {
      await axios.post(createApiUrl(API_ENDPOINTS.BIDS), { 
        jobId: id, 
        amount: bidData.amount, 
        message: bidData.message,
        workDuration: bidData.workDuration
      });
      // Close modal after successful submission
      setShowBidForm(false);
      // Refresh job data to show updated bid count
      const jobRes = await axios.get(createApiUrl(API_ENDPOINTS.JOB_DETAILS(id)));
      setJob(jobRes.data);
    } catch (err) {
      console.error('Error submitting bid:', err);
      throw err; // Let BidForm handle the error
    }
    setSubmitting(false);
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const statusRes = await axios.patch(createApiUrl(API_ENDPOINTS.JOB_STATUS(id)), { status: newStatus });
      setJob(statusRes.data);
    } catch (err) {
      console.error('Error updating status:', err);
    }
    setUpdatingStatus(false);
  };

  const handleWorkerStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const workerStatusRes = await axios.patch(createApiUrl(API_ENDPOINTS.JOB_WORKER_STATUS(id)), { status: newStatus });
      setJob(workerStatusRes.data);
    } catch (err) {
      console.error('Error updating worker status:', err);
    }
    setUpdatingStatus(false);
  };

  const handleDeleteJob = async () => {
    setDeleting(true);
    setDeleteMessage('');
    try {
      await axios.delete(createApiUrl(API_ENDPOINTS.JOB_DETAILS(id)));
      setDeleteMessage('Job deleted successfully!');
      setTimeout(() => {
        navigate('/posted-jobs');
      }, 2000);
    } catch (err) {
      setDeleteMessage(err.response?.data?.message || 'Failed to delete job.');
    }
    setDeleting(false);
    setDeleteConfirm(false);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setSaving(true);
    setEditMessage('');
    try {
      const editRes = await axios.put(createApiUrl(API_ENDPOINTS.JOB_DETAILS(id)), { ...editForm, jobImage: editJobImage });
      setJob(editRes.data);
      setEditing(false);
      setEditMessage('Job updated successfully!');
      setTimeout(() => setEditMessage(''), 3000);
    } catch (err) {
      setEditMessage(err.response?.data?.message || 'Failed to update job.');
    }
    setSaving(false);
  };

  const handleEditCancel = () => {
    setEditing(false);
    setEditForm({
      title: job.title,
      description: job.description,
      location: job.location,
      budget: job.budget,
      workCategory: job.workCategory || '',
      workDuration: job.workDuration || '',
      workersNeeded: job.workersNeeded || 1,
      requirements: job.requirements || '',
      applicationDeadline: job.applicationDeadline || ''
    });
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === '') return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleEditImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditJobImage(reader.result);
        setEditJobImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setEditJobImage(undefined);
      setEditJobImagePreview(undefined);
    }
  };

  const handleRemoveEditImage = () => {
    setEditJobImage(undefined);
    setEditJobImagePreview(undefined);
  };

  // Review functions
  const handleReviewSubmit = async (reviewData) => {
    try {
      await axios.post(createApiUrl(API_ENDPOINTS.REVIEWS), {
        jobId: id,
        workerId: selectedWorker._id,
        rating: reviewData.rating,
        review: reviewData.review
      });
      
      setReviewMessage('Review submitted successfully!');
      setTimeout(() => setReviewMessage(''), 3000);
      
      // Refresh job data to show updated worker ratings
      const reviewRes = await axios.get(createApiUrl(API_ENDPOINTS.JOB_DETAILS(id)));
      setJob(reviewRes.data);
      
      return Promise.resolve();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit review';
      setReviewMessage(errorMsg);
      setTimeout(() => setReviewMessage(''), 3000);
      return Promise.reject(err);
    }
  };

  const openReviewModal = (worker) => {
    setSelectedWorker(worker);
    setShowReviewModal(true);
  };

  const showWorkerProposal = (proposal) => {
    setSelectedProposal(proposal);
    setShowProposalModal(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-gray-600">Loading job details...</div>
      </div>
    </div>
  );
  
  if (!job) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</div>
        <div className="text-gray-600">The job you're looking for doesn't exist or has been removed.</div>
      </div>
    </div>
  );

  const isJobOwner = user && job.client && (job.client._id === user.id || job.client === user.id);

  return (
    <section className="min-h-screen bg-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Success/Error Messages */}
        {(editMessage || deleteMessage || reviewMessage) && (
          <div className={`mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg font-semibold text-center text-sm sm:text-base ${
            (editMessage || deleteMessage || reviewMessage).includes('successfully') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {editMessage || deleteMessage || reviewMessage}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Job Header */}
            <div className="bg-white border-b border-gray-200 pb-6 sm:pb-8 px-4 sm:px-6 pt-4 sm:pt-6 overflow-hidden">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight break-words">{job.title}</h1>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 break-words">{job.description}</p>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap">
                  ${job.budget}
                </span>
                <span className="text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap">📍 {job.location}</span>
                <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap ${
                  job.status === 'Open' ? 'bg-green-100 text-green-800' :
                  job.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-200">
                {isJobOwner && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold transition text-xs sm:text-sm w-full sm:w-auto"
                    >
                      Edit Job
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold transition text-xs sm:text-sm w-full sm:w-auto"
                    >
                      Delete Job
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Job Information */}
            <div className="bg-white border-b border-gray-200 pb-6 sm:pb-8 px-4 sm:px-6 pt-4 sm:pt-6 overflow-hidden">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Job Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Salary</span>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base mt-1 break-words">${job.budget}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Work Duration</span>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base mt-1 break-words">{job.workDuration}</p>
                  </div>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Workers Needed</span>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base mt-1 break-words">{job.workersNeeded} {job.workersNeeded === 1 ? 'worker' : 'workers'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Job Status</span>
                    <p className={`font-semibold text-sm sm:text-base mt-1 break-words ${
                      job.status === 'Open' ? 'text-green-600' :
                      job.status === 'Assigned' ? 'text-blue-600' :
                      'text-gray-600'
                    }`}>{job.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white border-b border-gray-200 pb-6 sm:pb-8 px-4 sm:px-6 pt-4 sm:pt-6 overflow-hidden">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Requirements</h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap break-words">{job.requirements}</p>
              </div>
            )}

            {/* Assigned Workers */}
            {job.status === 'Assigned' && job.workers && job.workers.length > 0 && (
              <div className="bg-white border-b border-gray-200 pb-6 sm:pb-8 px-4 sm:px-6 pt-4 sm:pt-6 overflow-hidden">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Assigned Workers ({job.workers.length}/{job.workersNeeded})
                </h2>
                <div className="space-y-3">
                  {job.workers.map((worker, index) => {
                    // Find the worker's bid information
                    const workerBid = job.workerBids?.find(wb => 
                      wb.worker._id === worker._id || wb.worker === worker._id
                    );
                    
                    return (
                      <div key={worker._id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                          {worker.name?.charAt(0)?.toUpperCase() || 'W'}
                        </div>
                        <div className="flex-1">
                          <div 
                            className="text-gray-900 font-semibold text-sm cursor-pointer hover:text-blue-600 transition"
                            onClick={() => navigate(`/worker/${worker._id}`)}
                          >
                            {worker.name}
                          </div>
                          <div className="text-gray-600 text-xs">{worker.email}</div>
                          {workerBid && (
                            <div className="text-green-600 text-xs font-semibold mt-1">
                              Bid: ${workerBid.amount}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {worker.phone && (
                            <a
                              href={`tel:${worker.phone}`}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-semibold transition"
                              title="Call worker"
                            >
                              📞
                            </a>
                          )}
                          <a
                            href={`mailto:${worker.email}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-semibold transition"
                            title="Send email"
                          >
                            ✉️
                          </a>
                          {workerBid && (
                            <button
                              onClick={() => showWorkerProposal(workerBid.message)}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-semibold transition"
                              title="View proposal"
                            >
                              📝
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {job.workers.length < job.workersNeeded && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <span className="font-semibold">Still accepting bids:</span> {job.workersNeeded - job.workers.length} more worker{job.workersNeeded - job.workers.length !== 1 ? 's' : ''} needed
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Completed Workers with Review Option */}
            {job.status === 'Completed' && job.workers && job.workers.length > 0 && (
              <div className="bg-white border-b border-gray-200 pb-6 sm:pb-8 px-4 sm:px-6 pt-4 sm:pt-6 overflow-hidden">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Completed Work ({job.workers.length}/{job.workersNeeded})
                </h2>
                <div className="space-y-3">
                  {job.workers.map((worker, index) => {
                    // Find the worker's bid information
                    const workerBid = job.workerBids?.find(wb => 
                      wb.worker._id === worker._id || wb.worker === worker._id
                    );
                    
                    return (
                      <div key={worker._id || index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                          {worker.name?.charAt(0)?.toUpperCase() || 'W'}
                        </div>
                        <div className="flex-1">
                          <div 
                            className="text-gray-900 font-semibold text-sm cursor-pointer hover:text-blue-600 transition"
                            onClick={() => navigate(`/worker/${worker._id}`)}
                          >
                            {worker.name}
                          </div>
                          <div className="text-gray-600 text-xs">{worker.email}</div>
                          {workerBid && (
                            <div className="text-green-600 text-xs font-semibold mt-1">
                              Completed for: ${workerBid.amount}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {workerBid && (
                            <button
                              onClick={() => showWorkerProposal(workerBid.message)}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-semibold transition"
                              title="View proposal"
                            >
                              📝
                            </button>
                          )}
                          {isJobOwner && (
                            <button
                              onClick={() => openReviewModal(worker)}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs font-semibold transition"
                              title="Rate worker"
                            >
                              ⭐
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {job.workCompletedAt && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      <span className="font-semibold">Work completed:</span> {formatDate(job.workCompletedAt)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6 sm:space-y-8">
            {/* Client Info */}
            {job.client && (
              <div className="bg-white border-b border-gray-200 pb-6 sm:pb-8 px-4 sm:px-6 pt-4 sm:pt-6 overflow-hidden">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Posted by</h3>
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {job.client.profilePic ? (
                    <img 
                      src={job.client.profilePic} 
                      alt="Profile" 
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-200 shadow-sm flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-600 flex items-center justify-center text-lg sm:text-xl font-bold text-white shadow-sm flex-shrink-0">
                      {job.client.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-gray-900 font-bold text-base sm:text-lg break-words">{job.client.name}</div>
                    {job.client.organizationName && (
                      <div className="text-blue-600 font-semibold text-sm sm:text-base break-words">{job.client.organizationName}</div>
                    )}
                    {job.client.organizationType && (
                      <div className="text-gray-500 text-xs sm:text-sm break-words">{job.client.organizationType}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded-full flex-shrink-0"></span>
                    <span className="break-all">{job.client.email}</span>
                  </div>
                  {job.client.phone && (
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                      <span className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded-full flex-shrink-0"></span>
                      <span className="break-all">📞 {job.client.phone}</span>
                    </div>
                  )}
                  {job.client.location && (
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                      <span className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded-full flex-shrink-0"></span>
                      <span className="break-words">📍 {job.client.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white border-b border-gray-200 pb-6 sm:pb-8 px-4 sm:px-6 pt-4 sm:pt-6 overflow-hidden">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Timeline</h3>
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">Posted</div>
                    <div className="text-gray-900 font-bold text-xs sm:text-sm break-words">{formatDate(job.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">Last Updated</div>
                    <div className="text-gray-900 font-bold text-xs sm:text-sm break-words">{formatDate(job.updatedAt)}</div>
                  </div>
                </div>
                {job.applicationDeadline && (
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">Application Deadline</div>
                      <div className="text-red-600 font-bold text-xs sm:text-sm break-words">{formatDate(job.applicationDeadline)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bid Now Section */}
            {user && user.role === 'worker' && job.status === 'Open' && (
              <div className="bg-white border-b border-gray-200 pb-6 sm:pb-8 px-4 sm:px-6 pt-4 sm:pt-6 overflow-hidden">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Interested in this job?</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm break-words">Submit your bid to get started with this project.</p>
                <button
                  onClick={() => setShowBidForm(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition shadow-sm"
                >
                  Bid on This Job
                </button>
              </div>
            )}

            {/* Worker Actions Section */}
            {user && user.role === 'worker' && job.workers && job.workers.some(w => w._id === user.id || w === user.id) && (
              <div className="bg-white border-b border-gray-200 pb-6 sm:pb-8 px-4 sm:px-6 pt-4 sm:pt-6 overflow-hidden">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Your Work Actions</h3>
                <div className="space-y-3 sm:space-y-4">
                  {job.status === 'Assigned' && (
                    <button
                      onClick={() => handleWorkerStatusUpdate('In Progress')}
                      disabled={updatingStatus}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 sm:py-4 rounded-lg transition disabled:opacity-50 shadow-sm text-sm sm:text-base flex items-center justify-center gap-2"
                    >
                      {updatingStatus ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Starting Work...
                        </>
                      ) : (
                        <>
                          🚀 Start Working
                        </>
                      )}
                    </button>
                  )}
                  
                  {job.status === 'In Progress' && (
                    <div className="space-y-3">
                      <button
                        onClick={() => handleWorkerStatusUpdate('Completed')}
                        disabled={updatingStatus}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 rounded-lg transition disabled:opacity-50 shadow-sm text-sm sm:text-base flex items-center justify-center gap-2"
                      >
                        {updatingStatus ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Completing...
                          </>
                        ) : (
                          <>
                            ✅ Mark as Completed
                          </>
                        )}
                      </button>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-sm">
                          <strong>Work in Progress:</strong> You're currently working on this job. 
                          Click "Mark as Completed" when you finish all the work.
                        </p>
                        {job.workStartedAt && (
                          <p className="text-yellow-700 text-xs mt-2">
                            Started: {formatDate(job.workStartedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {job.status === 'Completed' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Work Completed:</strong> Great job! This work has been marked as completed.
                      </p>
                      {job.workCompletedAt && (
                        <p className="text-green-700 text-xs mt-2">
                          Completed: {formatDate(job.workCompletedAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Update for Job Owner */}
            {isJobOwner && job.status !== 'Completed' && (
              <div className="bg-white border-b border-gray-200 pb-6 sm:pb-8 px-4 sm:px-6 pt-4 sm:pt-6 overflow-hidden">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Job Management</h3>
                <div className="space-y-3 sm:space-y-4">
                  {job.status === 'Open' && job.workers && job.workers.length > 0 && (
                    <button
                      onClick={() => handleStatusUpdate('Assigned')}
                      disabled={updatingStatus}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 rounded-lg transition disabled:opacity-50 shadow-sm text-sm sm:text-base"
                    >
                      {updatingStatus ? 'Updating...' : 'Mark as Assigned (Workers Ready)'}
                    </button>
                  )}
                  
                  {job.status === 'Assigned' && (
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 text-sm">
                          <strong>Workers Assigned:</strong> Your workers can now start working on this job.
                          They will update the status when they begin and complete the work.
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleStatusUpdate('Cancelled')}
                        disabled={updatingStatus}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 sm:py-4 rounded-lg transition disabled:opacity-50 shadow-sm text-sm sm:text-base"
                      >
                        {updatingStatus ? 'Cancelling...' : 'Cancel Job'}
                      </button>
                    </div>
                  )}
                  
                  {job.status === 'In Progress' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>Work in Progress:</strong> Your workers are currently working on this job.
                        They will mark it as completed when they finish.
                      </p>
                      {job.workStartedAt && (
                        <p className="text-yellow-700 text-xs mt-2">
                          Work started: {formatDate(job.workStartedAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Form Modal */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Job Details</h2>
                <button
                  onClick={handleEditCancel}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Job Title *</label>
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    placeholder="e.g., House Cleaning, Garden Work, Moving Help"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Job Description *</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    placeholder="Describe the work needed and specific tasks..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Location *</label>
                    <input
                      name="location"
                      value={editForm.location}
                      onChange={handleEditChange}
                      placeholder="e.g., Downtown, Rural area, Specific address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Budget ($) *</label>
                    <input
                      name="budget"
                      value={editForm.budget}
                      onChange={handleEditChange}
                      placeholder="e.g., 50, 100, 200"
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Work Category *</label>
                    <select
                      name="workCategory"
                      value={editForm.workCategory}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    >
                      <option value="">Select work category</option>
                      {workCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Workers Needed</label>
                    <input
                      name="workersNeeded"
                      type="number"
                      min="1"
                      value={editForm.workersNeeded}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Work Duration *</label>
                  <input
                    name="workDuration"
                    value={editForm.workDuration}
                    onChange={handleEditChange}
                    placeholder="e.g., 2 hours, Full day, 3 days"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Application Deadline (optional)</label>
                  <input
                    name="applicationDeadline"
                    value={editForm.applicationDeadline}
                    onChange={handleEditChange}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="When should workers submit their bids by?"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Requirements</label>
                  <textarea
                    name="requirements"
                    value={editForm.requirements}
                    onChange={handleEditChange}
                    placeholder="Tools needed, physical requirements, safety gear, certifications, etc."
                    rows="3"
                                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Job Image Upload/Edit */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Job Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {editJobImagePreview && (
                    <div className="mt-3 flex items-center gap-3">
                      <img src={editJobImagePreview} alt="Job Preview" className="w-24 h-24 object-cover rounded-lg border-2 border-blue-400 shadow" />
                      <button type="button" onClick={handleRemoveEditImage} className="text-red-500 hover:text-red-700 font-semibold text-xs">Remove</button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 shadow-sm text-sm"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    disabled={saving}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition shadow-sm text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bid Form Modal */}
        <BidForm
          isOpen={showBidForm}
          onClose={() => setShowBidForm(false)}
          onSubmit={handleBidSubmit}
          job={job}
          showJobInfo={true}
          modalSize="lg"
        />

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "<span className="font-semibold text-gray-900">{job.title}</span>"? 
                This action cannot be undone and will remove all associated bids.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteJob}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete Job'}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Proposal Modal */}
        {showProposalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Worker Proposal</h2>
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Proposal Details</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedProposal}</p>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedWorker && (
          <ReviewModal
            worker={selectedWorker}
            onSubmit={handleReviewSubmit}
            onClose={() => {
              setShowReviewModal(false);
              setSelectedWorker(null);
            }}
          />
        )}
      </div>
    </section>
  );
};

export default JobDetails; 