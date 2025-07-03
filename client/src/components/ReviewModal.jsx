import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewModal = ({ isOpen, onClose, onSubmit, workerName, jobTitle }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setSubmitting(true);
    try {
      await onSubmit({ rating, review });
      setRating(0);
      setReview('');
      onClose();
    } catch (err) {
      console.error('Review submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setRating(0);
      setReview('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Rate Worker</h3>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-1">Worker: <span className="font-semibold text-gray-900">{workerName}</span></p>
          <p className="text-gray-600">Job: <span className="font-semibold text-gray-900">{jobTitle}</span></p>
        </div>
        
        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-3xl transition-colors ${
                  star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                } ${submitting ? 'cursor-not-allowed' : 'hover:text-yellow-300'}`}
                onClick={() => !submitting && setRating(star)}
                onMouseEnter={() => !submitting && setHover(star)}
                onMouseLeave={() => !submitting && setHover(0)}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-1">
            {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Click to rate'}
          </p>
        </div>
        
        {/* Review Text */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review (optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => !submitting && setReview(e.target.value)}
            placeholder="Share your experience with this worker..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            disabled={submitting}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {review.length}/500 characters
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal; 