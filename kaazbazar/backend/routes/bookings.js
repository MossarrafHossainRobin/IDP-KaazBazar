const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const { protect } = require('../middleware/auth');

// Create booking
router.post('/', protect, async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, client: req.user._id });
    res.status(201).json({ success: true, booking, message: 'Booking created successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get my bookings
router.get('/my', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'user') query.client = req.user._id;
    else if (req.user.role === 'worker') {
      const worker = await Worker.findOne({ user: req.user._id });
      if (worker) query.worker = worker._id;
    }
    const bookings = await Booking.find(query)
      .populate('worker', 'name category avatar location')
      .populate('client', 'name email phone')
      .sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update booking status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, cancelReason: req.body.cancelReason },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    // Update worker job count when completed
    if (req.body.status === 'completed') {
      await Worker.findByIdAndUpdate(booking.worker, { $inc: { totalJobs: 1 } });
    }
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
