const Bid = require('../models/Bid');
const Job = require('../models/Job');

// Get all bids for a specific job (for clients)
exports.getBidsForJob = async (req, res) => {
  try {
    const bids = await Bid.find({ job: req.params.jobId }).populate('worker', 'name email phone location experience category rating bio profilePic');
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
    const bids = await Bid.find({ job: { $in: jobIds } }).populate('worker', 'name email phone location experience category rating bio profilePic').populate('job', 'title');
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
    const bid = await Bid.findByIdAndUpdate(req.params.bidId, { status }, { new: true });
    if (!bid) return res.status(404).json({ message: 'Bid not found.' });
    
    // If accepted, add worker to job and check if all workers are assigned
    if (status === 'Accepted') {
      const job = await Job.findById(bid.job);
      if (!job) return res.status(404).json({ message: 'Job not found.' });
      
      // Check if worker is already assigned to this job
      if (job.workers.includes(bid.worker)) {
        return res.status(400).json({ message: 'Worker is already assigned to this job.' });
      }
      
      // Add worker to the job
      const updatedJob = await Job.findByIdAndUpdate(
        bid.job, 
        { 
          $push: { workers: bid.worker },
          $inc: { assignedWorkersCount: 1 }
        }, 
        { new: true }
      );
      
      // Check if all needed workers are assigned
      if (updatedJob.assignedWorkersCount >= updatedJob.workersNeeded) {
        await Job.findByIdAndUpdate(bid.job, { status: 'Assigned' });
      }
    }
    
    res.json(bid);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update bid status.' });
  }
}; 