const Job = require('../models/Job');
const User = require('../models/User');
const Bid = require('../models/Bid');

exports.createJob = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      location, 
      budget, 
      applicationDeadline,
      workCategory,
      workDuration,
      workersNeeded,
      requirements,
      jobImage
    } = req.body;
    
    const clientId = req.user.id;
    const client = await User.findById(clientId);
    if (!client || client.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can post jobs' });
    }
    
    const job = new Job({
      title, 
      description, 
      location, 
      budget, 
      applicationDeadline: applicationDeadline || undefined,
      workCategory,
      workDuration,
      workersNeeded: workersNeeded || 1,
      requirements,
      client: clientId,
      jobImage
    });
    
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ message: 'Failed to create job.' });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('client', 'name email profilePic organizationName organizationType phone location')
      .populate('workers', 'name email');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('client', 'name email profilePic organizationName organizationType phone location')
      .populate('workers', 'name email phone location rating')
      .populate('workerBids.worker', 'name email phone location rating');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    // Check if user is the owner of the job
    if (job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own jobs' });
    }
    
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('client', 'name email profilePic organizationName organizationType phone location')
      .populate('workers', 'name email');
    
    res.json(updatedJob);
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    // Check if user is the owner of the job
    if (job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own jobs' });
    }
    
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ client: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your posted jobs.' });
  }
};

exports.getAcceptedJobs = async (req, res) => {
  try {
    // First get jobs where the worker is assigned (regardless of job status)
    const jobs = await Job.find({ 
      workers: req.user.id
    }).populate('client', 'name email phone location organizationName organizationType');
    
    // For each job, get the worker's bid details
    const jobsWithBids = await Promise.all(jobs.map(async (job) => {
      const bid = await Bid.findOne({ 
        job: job._id, 
        worker: req.user.id,
        status: 'Accepted'
      });
      
      return {
        ...job.toObject(),
        bidDetails: bid ? {
          amount: bid.amount,
          message: bid.message,
          submittedAt: bid.createdAt,
          status: bid.status
        } : null
      };
    }));
    
    res.json(jobsWithBids);
  } catch (err) {
    console.error('Error fetching accepted jobs:', err);
    res.status(500).json({ message: 'Failed to fetch your accepted jobs.' });
  }
};

exports.updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update job status.' });
  }
};

// Worker updates their job status (start work, update progress, complete)
exports.updateWorkerJobStatus = async (req, res) => {
  try {
    const { status, progressNotes } = req.body;
    const jobId = req.params.id;
    
    // Check if the job exists and worker is assigned to it
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    
    if (!job.workers.includes(req.user.id)) {
      return res.status(403).json({ message: 'You are not assigned to this job.' });
    }
    
    // Validate status transitions
    const validTransitions = {
      'Assigned': ['In Progress'],
      'In Progress': ['Completed'],
      'Completed': [] // No further transitions
    };
    
    if (!validTransitions[job.status]?.includes(status)) {
      return res.status(400).json({ 
        message: `Cannot change status from ${job.status} to ${status}.` 
      });
    }
    
    // Prepare update data
    const updateData = { status };
    
    // Add timestamps and notes based on status
    if (status === 'In Progress' && !job.workStartedAt) {
      updateData.workStartedAt = new Date();
    } else if (status === 'Completed') {
      updateData.workCompletedAt = new Date();
    }
    
    if (progressNotes) {
      updateData.progressNotes = progressNotes;
    }
    
    // Update the job status
    const updatedJob = await Job.findByIdAndUpdate(
      jobId, 
      updateData, 
      { new: true }
    ).populate('client', 'name email phone location organizationName organizationType')
     .populate('workers', 'name email phone location rating');
    
    res.json(updatedJob);
  } catch (err) {
    console.error('Error updating worker job status:', err);
    res.status(500).json({ message: 'Failed to update job status.' });
  }
}; 