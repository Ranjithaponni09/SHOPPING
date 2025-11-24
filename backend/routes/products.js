const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

// Create product (admin only)
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const p = await Product.create(req.body);
    res.json(p);
  } catch(err) { res.status(500).json({ msg: 'Server error' }); }
});

// List products (authenticated)
router.get('/', auth, async (req, res) => {
  const list = await Product.find().sort({ createdAt: -1 });
  res.json(list);
});

module.exports = router;
