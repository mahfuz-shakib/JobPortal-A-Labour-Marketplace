const Job = require('../models/Job');
const User = require('../models/User');

exports.createJob = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      location, 
      budget, 
      deadline,
      workCategory,
      workDuration,
      workersNeeded,
      requirements,
      applicationDeadline
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
      deadline,
      workCategory,
      workDuration,
      workersNeeded: workersNeeded || 1,
      requirements,
      applicationDeadline,
      client: clientId
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
      .populate('workers', 'name email');
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
    const jobs = await Job.find({ 
      workers: req.user.id, 
      status: { $in: ['Assigned', 'Completed'] } 
    }).populate('client', 'name email');
    res.json(jobs);
  } catch (err) {
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