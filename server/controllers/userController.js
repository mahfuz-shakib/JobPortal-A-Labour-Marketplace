const User = require('../models/User');
const Job = require('../models/Job');
const Bid = require('../models/Bid');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

exports.updateProfile = async (req, res) => {
  try {
    // Accept all updatable fields, including profilePic and organization info
    const { 
      name, 
      phone, 
      category, 
      experience, 
      demandableBudget, 
      bio, 
      profilePic, 
      organizationType, 
      organizationName, 
      location, 
      description 
    } = req.body;
    
    const updateFields = { 
      name, 
      phone, 
      category, 
      experience, 
      demandableBudget, 
      bio 
    };
    
    if (profilePic !== undefined) updateFields.profilePic = profilePic;
    if (organizationType !== undefined) updateFields.organizationType = organizationType;
    if (organizationName !== undefined) updateFields.organizationName = organizationName;
    if (location !== undefined) updateFields.location = location;
    if (description !== undefined) updateFields.description = description;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true }
    );
    res.json({ user });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changeEmail = async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail) return res.status(400).json({ message: 'New email required.' });
    const existing = await User.findOne({ email: newEmail });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const user = await User.findByIdAndUpdate(req.user.id, { email: newEmail }, { new: true });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both current and new password required.' });
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    if (!currentPassword) return res.status(400).json({ message: 'Current password required.' });
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });

    // Start a database session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (user.role === 'client') {
        // For clients: Delete all their posted jobs (this will cascade delete related bids)
        const jobsToDelete = await Job.find({ client: user._id }).session(session);
        const jobIds = jobsToDelete.map(job => job._id);
        
        // Delete all bids related to these jobs
        await Bid.deleteMany({ job: { $in: jobIds } }).session(session);
        
        // Delete all the jobs
        await Job.deleteMany({ client: user._id }).session(session);
        
        console.log(`Deleted ${jobsToDelete.length} jobs and their associated bids for client ${user._id}`);
      }

      // For workers: Delete all their submitted bids
      const deletedBids = await Bid.deleteMany({ worker: user._id }).session(session);
      console.log(`Deleted ${deletedBids.deletedCount} bids for worker ${user._id}`);

      // Remove user from any jobs where they're assigned as a worker
      const jobsWithWorker = await Job.find({ workers: user._id }).session(session);
      for (const job of jobsWithWorker) {
        job.workers = job.workers.filter(workerId => workerId.toString() !== user._id.toString());
        job.assignedWorkersCount = job.workers.length;
        
        // If no workers left and job was assigned, set it back to open
        if (job.workers.length === 0 && job.status === 'Assigned') {
          job.status = 'Open';
        }
        
        await job.save({ session });
      }
      console.log(`Removed worker ${user._id} from ${jobsWithWorker.length} assigned jobs`);

      // Finally, delete the user account
      await User.findByIdAndDelete(user._id).session(session);

      await session.commitTransaction();
      console.log(`Successfully deleted account for user ${user._id} (${user.role})`);
      
      res.json({ message: 'Account and all associated data deleted successfully' });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (err) {
    console.error('Account deletion error:', err);
    res.status(500).json({ message: 'Server error during account deletion' });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;
    console.log('Uploading profile pic for user:', req.user?.id, 'Payload size:', profilePic?.length);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic },
      { new: true }
    );
    res.json({ user });
  } catch (err) {
    console.error('Profile pic upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// List/search/filter workers
exports.getWorkers = async (req, res) => {
  try {
    const { category, location, minRating, available } = req.query;
    const query = { role: 'worker' };
    if (category) query.category = category;
    if (location) query.location = location;
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (available !== undefined) query.availability = available === 'true';
    const workers = await User.find(query).select('-password');
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch workers.' });
  }
};

// Get public worker profile by ID
exports.getWorkerProfile = async (req, res) => {
  try {
    const worker = await User.findById(req.params.id).select('-password');
    if (!worker || worker.role !== 'worker') return res.status(404).json({ message: 'Worker not found.' });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch worker profile.' });
  }
}; 