const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Plumber', 'Electrician', 'Carpenter', 'Cleaner', 'Painter', 'Handyman', 'Gardener', 'Technician', 'Driver', 'Security Guard']
  },
  title: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  experience: { type: Number, default: 0 },
  hourlyRate: { type: Number, required: true },
  location: {
    district: { type: String, required: true },
    area: { type: String },
    fullAddress: { type: String }
  },
  phone: { type: String },
  email: { type: String },
  avatar: { type: String, default: '' },
  images: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  verificationDocuments: [{ type: String }],
  workingHours: {
    start: { type: String, default: '08:00' },
    end: { type: String, default: '18:00' },
    days: [{ type: String }]
  },
  responseTime: { type: String, default: '1-2 hours' },
  languages: [{ type: String, default: ['Bangla'] }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

workerSchema.index({ category: 1, 'location.district': 1 });
workerSchema.index({ rating: -1 });
workerSchema.index({ name: 'text', bio: 'text', skills: 'text' });

module.exports = mongoose.model('Worker', workerSchema);
