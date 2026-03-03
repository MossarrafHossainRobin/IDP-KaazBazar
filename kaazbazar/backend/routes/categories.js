const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

router.get('/', async (req, res) => {
  try {
    const categories = [
      { id: 'Plumber', name: 'Plumber', icon: '🔧', description: 'Fix pipes, taps, drainage' },
      { id: 'Electrician', name: 'Electrician', icon: '⚡', description: 'Electrical work & repairs' },
      { id: 'Carpenter', name: 'Carpenter', icon: '🪚', description: 'Furniture & woodwork' },
      { id: 'Cleaner', name: 'Cleaner', icon: '🧹', description: 'Home & office cleaning' },
      { id: 'Painter', name: 'Painter', icon: '🖌️', description: 'Wall & furniture painting' },
      { id: 'Handyman', name: 'Handyman', icon: '🔨', description: 'General repairs & fixes' },
      { id: 'Gardener', name: 'Gardener', icon: '🌿', description: 'Garden & lawn care' },
      { id: 'Technician', name: 'Technician', icon: '💻', description: 'AC, fridge & electronics' },
      { id: 'Driver', name: 'Driver', icon: '🚗', description: 'Personal & commercial driving' },
      { id: 'Security Guard', name: 'Security Guard', icon: '🛡️', description: 'Home & office security' }
    ];
    
    // Add worker counts
    for (let cat of categories) {
      cat.workerCount = await Worker.countDocuments({ category: cat.id, isActive: true });
    }
    
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
