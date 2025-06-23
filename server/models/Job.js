const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  budget: { type: Number, required: true },
  status: { type: String, enum: ['Open', 'Assigned', 'Completed'], default: 'Open' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema); 