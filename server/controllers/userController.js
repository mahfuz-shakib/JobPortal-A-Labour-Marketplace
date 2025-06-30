const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.updateProfile = async (req, res) => {
  try {
    // Accept all updatable fields, including profilePic and organization info
    const { name, phone, skill, bio, profilePic, organizationType, organizationName, location, description } = req.body;
    const updateFields = { name, phone, skill, bio };
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
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
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