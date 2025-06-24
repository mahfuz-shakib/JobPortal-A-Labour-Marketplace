const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['client', 'worker'], required: true },
  skill: { type: String }, // Only for workers
  bio: { type: String },   // Only for workers
  profilePic: { type: String }, // base64 or URL
  organizationType: { type: String }, // e.g., Business, Individual, Nonprofit, etc.
  organizationName: { type: String }, // For clients (organizations/individuals)
  location: { type: String }, // For both workers and clients
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 