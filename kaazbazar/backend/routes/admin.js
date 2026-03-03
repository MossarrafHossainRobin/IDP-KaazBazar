const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

// Admin login (special endpoint)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
    const generateToken = require('../utils/generateToken');
    const token = generateToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalWorkers, totalBookings, pendingBookings, completedBookings, totalContacts, newContacts] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Worker.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'completed' }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' })
    ]);
    
    const recentBookings = await Booking.find()
      .populate('worker', 'name category')
      .populate('client', 'name email')
      .sort('-createdAt').limit(5);
    
    const recentWorkers = await Worker.find({ isActive: true }).sort('-createdAt').limit(5);
    
    // Revenue calculation
    const revenue = await Booking.aggregate([
      { $match: { status: 'completed', paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalWorkers, totalBookings, pendingBookings, completedBookings, totalContacts, newContacts,
        totalRevenue: revenue[0]?.total || 0 },
      recentBookings,
      recentWorkers
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Manage users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort('-createdAt').skip((page-1)*limit).limit(Number(limit));
    res.json({ success: true, users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle user active status
router.patch('/users/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user, message: `User ${user.isActive ? 'activated' : 'suspended'}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Manage workers
router.get('/workers', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, isVerified } = req.query;
    const query = {};
    if (category) query.category = category;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    if (search) query.$or = [{ name: new RegExp(search, 'i') }];
    const total = await Worker.countDocuments(query);
    const workers = await Worker.find(query).populate('user', 'email').sort('-createdAt').skip((page-1)*limit).limit(Number(limit));
    res.json({ success: true, workers, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify worker
router.patch('/workers/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    res.json({ success: true, worker, message: 'Worker verified successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle featured
router.patch('/workers/:id/featured', protect, adminOnly, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    worker.isFeatured = !worker.isFeatured;
    await worker.save();
    res.json({ success: true, worker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete worker
router.delete('/workers/:id', protect, adminOnly, async (req, res) => {
  try {
    await Worker.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Worker removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// All bookings
router.get('/bookings', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('worker', 'name category')
      .populate('client', 'name email phone')
      .sort('-createdAt').skip((page-1)*limit).limit(Number(limit));
    res.json({ success: true, bookings, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Contact messages
router.get('/contacts', protect, adminOnly, async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/contacts/:id/read', protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { status: 'read' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
