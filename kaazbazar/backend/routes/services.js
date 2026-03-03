// services.js
const express = require('express');
const router = express.Router();
const { ServiceCategory } = require('../models/Booking');

router.get('/', async (req, res) => {
  try {
    const categories = await ServiceCategory.find({ isActive: true }).sort({ order: 1 });
    // If no categories in DB, return default ones
    if (categories.length === 0) {
      return res.json({ categories: [
        { name: 'Electricians', slug: 'electricians', icon: 'Zap', color: 'bg-indigo-600', description: 'Wiring, repairs, installations & lighting.' },
        { name: 'Plumbers', slug: 'plumbers', icon: 'Droplets', color: 'bg-cyan-600', description: 'Leaks, pipe repairs, fixture installation.' },
        { name: 'Carpenters', slug: 'carpenters', icon: 'Hammer', color: 'bg-amber-600', description: 'Custom furniture, repair, woodworking.' },
        { name: 'Cleaners', slug: 'cleaners', icon: 'Sparkles', color: 'bg-emerald-600', description: 'Deep cleaning, regular service.' },
        { name: 'Painters', slug: 'painters', icon: 'Palette', color: 'bg-rose-600', description: 'Interior & exterior painting.' },
        { name: 'Gardeners', slug: 'gardeners', icon: 'Leaf', color: 'bg-lime-600', description: 'Landscaping, trimming, lawn care.' },
        { name: 'Handyman', slug: 'handyman', icon: 'Wrench', color: 'bg-purple-600', description: 'General repairs & maintenance.' },
        { name: 'Appliance Repair', slug: 'appliance-repair', icon: 'Settings', color: 'bg-orange-600', description: 'Washer, fridge, oven service.' },
      ] });
    }
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
