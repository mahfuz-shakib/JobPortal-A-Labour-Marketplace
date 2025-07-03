const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, maxLength: 500 },
  createdAt: { type: Date, default: Date.now }
});

// Ensure one review per client per worker per job
ReviewSchema.index({ job: 1, worker: 1, client: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema); 