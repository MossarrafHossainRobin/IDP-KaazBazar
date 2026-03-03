const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Worker = require('../models/Worker');
const { protect } = require('../middleware/auth');

// Get reviews for a worker
router.get('/worker/:workerId', async (req, res) => {
  try {
    const reviews = await Review.find({ worker: req.params.workerId })
      .populate('client', 'name avatar')
      .sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add review
router.post('/', protect, async (req, res) => {
  try {
    const review = await Review.create({
      ...req.body,
      client: req.user._id,
      clientName: req.user.name
    });
    
    // Update worker rating
    const reviews = await Review.find({ worker: req.body.worker });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Worker.findByIdAndUpdate(req.body.worker, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });
    
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
