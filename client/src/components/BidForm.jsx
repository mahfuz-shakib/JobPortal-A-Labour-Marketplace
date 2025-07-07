import React, { useState } from 'react';
import axios from 'axios';
import { createApiUrl, API_ENDPOINTS } from '../config/api';
import showNotification from '../utils/notifications';

const BidForm = ({ 
  job, 
  isOpen, 
  onClose, 
  onSuccess,
  onSubmit,
  showJobInfo = true,
  modalSize = 'md' // 'md' or 'lg'
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    message: '',
    workDuration: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount.trim()) {
      setError('Please enter a bid amount');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // If onSubmit is provided, use it (for custom handling)
      if (onSubmit) {
        await onSubmit({
          amount: parseFloat(formData.amount),
          message: formData.message.trim(),
          workDuration: formData.workDuration.trim()
        });
        setSuccess('Bid submitted successfully!');
        showNotification.success('Bid submitted successfully!');
        // Clear form
        setFormData({ amount: '', message: '', workDuration: '' });
        // Close modal after delay
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 2000);
      } else {
        // Default internal handling
        await axios.post(createApiUrl(API_ENDPOINTS.BIDS), {
          jobId: job._id,
          amount: parseFloat(formData.amount),
          message: formData.message.trim(),
          workDuration: formData.workDuration.trim()
        });
        
        setSuccess('Bid submitted successfully!');
        showNotification.success('Bid submitted successfully!');
        
        // Clear form
        setFormData({ amount: '', message: '', workDuration: '' });
        
        // Close modal after delay
        setTimeout(() => {
          onClose();
          setSuccess('');
          if (onSuccess) onSuccess();
        }, 2000);
      }
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit bid';
      setError(errorMsg);
      showNotification.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ amount: '', message: '', workDuration: '' });
    setError('');
    setSuccess('');
    onClose();
  };

  const modalClasses = modalSize === 'lg' 
    ? 'w-full max-w-3xl mx-4 max-h-[80vh] overflow-y-auto' 
    : 'w-full max-w-lg mx-4';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`bg-white rounded-lg shadow-xl p-6 ${modalClasses} relative`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Submit Your Bid</h2>
        </div>

        {/* Job Info (optional) */}
        {showJobInfo && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Budget:</span> ৳{job.budget} | 
              <span className="font-medium ml-2">Location:</span> {job.location}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bid Amount and Work Duration - Side by side on larger screens */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Bid Amount (৳) *
              </label>
              <input 
                name="amount" 
                value={formData.amount} 
                onChange={handleChange} 
                placeholder="Enter your bid amount in Taka" 
                type="number" 
                min="1"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Work Duration
              </label>
              <input 
                name="workDuration" 
                value={formData.workDuration} 
                onChange={handleChange} 
                placeholder="e.g., 2 hours, Full day, 3 days" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
          </div>

          {/* Proposal Message */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Proposal Message
            </label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              placeholder="Describe your approach, experience, and why you're the best fit for this job..." 
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
          </div>
          
          {/* Error/Success Messages */}
          {error && (
            <div className="text-center font-semibold p-2 rounded-lg bg-red-100 text-red-800 border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="text-center font-semibold p-2 rounded-lg bg-green-100 text-green-800 border border-green-200">
              {success}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50" 
              disabled={submitting}
            >
              {submitting ? 'Submitting Bid...' : 'Submit Bid'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidForm; 