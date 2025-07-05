const mongoose = require('mongoose');

// Popular Bangladeshi service categories: electrician, plumber, mason, cook, driver, tailor, carpenter, cleaner, painter, AC mechanic, computer technician, etc.

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['client', 'worker'], required: true },
  // Worker-specific fields
  category: [{ type: String }], // Optional for all users, can be set later
  experience: { type: String },
  demandableBudget: { type: Number },
  rating: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
  profilePic: { type: String },
  bio: { type: String },
  location: { type: String },
  // Client-specific fields
  organizationType: { type: String },
  organizationName: { type: String },
  description: { type: String },
  // Profile card fields
  profileCardCreated: { type: Boolean, default: false },
  profileCard: {
    address: { type: String },
    skills: [{ type: String }],
    available: { type: Boolean, default: true },
    salaryDemand: { type: Number },
    profileImage: { type: String }, // base64 or URL
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 