const Review = require('../models/Review');
const User = require('../models/User');
const Job = require('../models/Job');

// Submit a review for a worker
exports.submitReview = async (req, res) => {
  try {
    const { jobId, workerId, rating, review } = req.body;
    
    // Check if user is a client
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can submit reviews' });
    }
    
    // Check if job belongs to this client
    const job = await Job.findById(jobId);
    if (!job || job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only review workers for your own jobs' });
    }
    
    // Check if job is completed
    if (job.status !== 'Completed') {
      return res.status(400).json({ message: 'You can only review workers after job completion' });
    }
    
    // Check if worker was assigned to this job
    if (!job.workers.includes(workerId)) {
      return res.status(400).json({ message: 'You can only review workers who were assigned to this job' });
    }
    
    // Check if already reviewed
    const existingReview = await Review.findOne({ job: jobId, worker: workerId, client: req.user.id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this worker for this job' });
    }
    
    // Create review
    const newReview = new Review({
      job: jobId,
      worker: workerId,
      client: req.user.id,
      rating,
      review
    });
    await newReview.save();
    
    // Update worker's average rating
    const workerReviews = await Review.find({ worker: workerId });
    const avgRating = workerReviews.reduce((sum, review) => sum + review.rating, 0) / workerReviews.length;
    
    await User.findByIdAndUpdate(workerId, { rating: avgRating });
    
    res.status(201).json(newReview);
  } catch (err) {
    console.error('Review submission error:', err);
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

// Get reviews for a specific worker
exports.getWorkerReviews = async (req, res) => {
  try {
    const { workerId } = req.params;
    const reviews = await Review.find({ worker: workerId })
      .populate('client', 'name')
      .populate('job', 'title')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// Get reviews submitted by a client
exports.getClientReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ client: req.user.id })
      .populate('worker', 'name')
      .populate('job', 'title')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your reviews' });
  }
}; 