const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  serviceType: { type: String, required: true },
  description: { type: String },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String },
  address: { type: String, required: true },
  district: { type: String },
  estimatedHours: { type: Number, default: 1 },
  estimatedCost: { type: Number },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid'
  },
  paymentMethod: { type: String, enum: ['cash', 'bkash', 'nagad', 'rocket', 'card'], default: 'cash' },
  totalAmount: { type: Number },
  notes: { type: String },
  cancelReason: { type: String },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = 'KB' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
