const Bid = require('../models/Bid');
const Job = require('../models/Job');

// Get all bids for a specific job (for clients)
exports.getBidsForJob = async (req, res) => {
  try {
    const bids = await Bid.find({ job: req.params.jobId }).populate('worker', 'name phone location experience category rating bio profilePic');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bids.' });
  }
};

// Get all bids submitted by a worker
exports.getBidsByWorker = async (req, res) => {
  try {
    const bids = await Bid.find({ worker: req.user.id }).populate('job');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your bids.' });
  }
};

// Get all bids for jobs posted by a client (incoming bids)
exports.getBidsForClientJobs = async (req, res) => {
  try {
    // Find jobs posted by this client
    const jobs = await Job.find({ client: req.user.id });
    const jobIds = jobs.map(j => j._id);
    const bids = await Bid.find({ job: { $in: jobIds } }).populate('worker', 'name phone location experience category rating bio profilePic').populate('job', 'title');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch incoming bids.' });
  }
};

// Create a new bid
exports.createBid = async (req, res) => {
  try {
    const { jobId, amount, message } = req.body;
    const bid = new Bid({ job: jobId, worker: req.user.id, amount, message });
    await bid.save();
    // Add bid to job's bids array
    await Job.findByIdAndUpdate(jobId, { $push: { bids: bid._id } });
    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit bid.' });
  }
};

// Accept or reject a bid (client only)
exports.updateBidStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Rejected'
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ message: 'Bid not found.' });
    
    // Check if the user is the job owner
    const job = await Job.findById(bid.job);
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    
    if (job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the job owner can accept/reject bids.' });
    }
    
    // Update bid status
    bid.status = status;
    await bid.save();
    
    // If accepted, add worker to job and preserve bid information
    if (status === 'Accepted') {
      // Check if worker is already assigned to this job
      if (job.workers.includes(bid.worker)) {
        return res.status(400).json({ message: 'Worker is already assigned to this job.' });
      }
      
      // Add worker to the job
      job.workers.push(bid.worker);
      job.assignedWorkersCount = job.workers.length;
      
      // Preserve bid information
      job.workerBids.push({
        worker: bid.worker,
        bidId: bid._id,
        amount: bid.amount,
        message: bid.message,
        acceptedAt: new Date()
      });
      
      // Check if all needed workers are assigned
      if (job.assignedWorkersCount >= job.workersNeeded) {
        job.status = 'Assigned';
      }
      
      await job.save();
    }
    
    // Return updated job with populated data
    const updatedJob = await Job.findById(bid.job)
      .populate('client', 'name phone location organizationName organizationType')
      .populate('workers', 'name phone location rating')
      .populate('workerBids.worker', 'name phone location rating');
    
    res.json({ bid, job: updatedJob });
  } catch (err) {
    console.error('Error updating bid status:', err);
    res.status(500).json({ message: 'Failed to update bid status.' });
  }
}; 