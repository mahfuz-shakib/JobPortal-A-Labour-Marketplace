const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'worker'], required: true },
  skill: { type: String }, // Only for workers
  bio: { type: String },   // Only for workers
  profilePic: { type: String }, // base64 or URL
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 