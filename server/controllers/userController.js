const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, skill, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, skill, bio },
      { new: true }
    );
    res.json({ user });
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