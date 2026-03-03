const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const { protect, adminOnly } = require('../middleware/auth');

// Get all workers with filters
router.get('/', async (req, res) => {
  try {
    const { category, district, search, minRate, maxRate, rating, page = 1, limit = 12, sort = '-rating' } = req.query;
    const query = { isActive: true };
    
    if (category) query.category = category;
    if (district) query['location.district'] = district;
    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }
    if (rating) query.rating = { $gte: Number(rating) };
    if (search) query.$text = { $search: search };

    const total = await Worker.countDocuments(query);
    const workers = await Worker.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('user', 'name email');

    res.json({ success: true, workers, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single worker
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate('user', 'name email');
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json({ success: true, worker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create worker profile
router.post('/', protect, async (req, res) => {
  try {
    const workerData = { ...req.body, user: req.user._id };
    const worker = await Worker.create(workerData);
    await require('../models/User').findByIdAndUpdate(req.user._id, { role: 'worker' });
    res.status(201).json({ success: true, worker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update worker profile
router.put('/:id', protect, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    if (worker.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const updated = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, worker: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Featured workers
router.get('/featured/list', async (req, res) => {
  try {
    const workers = await Worker.find({ isFeatured: true, isActive: true }).limit(8).sort('-rating');
    res.json({ success: true, workers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Workers by category
router.get('/category/:cat', async (req, res) => {
  try {
    const { district, page = 1, limit = 12 } = req.query;
    const query = { category: req.params.cat, isActive: true };
    if (district) query['location.district'] = district;
    const total = await Worker.countDocuments(query);
    const workers = await Worker.find(query)
      .sort('-rating')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, workers, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
