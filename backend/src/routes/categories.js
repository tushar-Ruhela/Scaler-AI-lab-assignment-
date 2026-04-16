const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({
        orderBy: { name: 'asc' }
    });
    res.json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
