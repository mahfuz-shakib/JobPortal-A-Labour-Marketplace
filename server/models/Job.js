const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  budget: { type: Number, required: true },
  status: { type: String, enum: ['Open', 'Assigned', 'In Progress', 'Completed', 'Cancelled'], default: 'Open' },
  
  // Labor marketplace specific fields
  workCategory: { type: String, required: true }, // e.g., "Cooking/Catering", "Masonry", "Electrical", "Plumbing", "Painting", "Carpentry", "Cleaning"
  workDuration: { type: String, required: true }, // Manual input like "2 hours", "Full day", "3 days"
  workersNeeded: { type: Number, default: 1 }, // Number of workers required
  requirements: { type: String }, // Single requirements field for all needs
  applicationDeadline: { type: Date }, // When applications should be submitted by
  
  // Client and worker references
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of assigned workers
  assignedWorkersCount: { type: Number, default: 0 }, // Track how many workers have been assigned
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
  jobImage: { type: String }, // Optional image for the job card
  
  // Work progress tracking
  workStartedAt: { type: Date }, // When work actually started
  workCompletedAt: { type: Date }, // When work was completed
  progressNotes: { type: String }, // Optional notes about work progress
  
  // Preserve bid information for each worker
  workerBids: [{
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' },
    amount: { type: Number },
    message: { type: String },
    acceptedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema); 