const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma');
const { optionalAuth } = require('../middleware/auth');

function getIdentifier(req) {
  return req.user ? { field: 'user_id', value: parseInt(req.user.id) } : { field: 'session_id', value: req.headers['x-session-id'] || 'guest' };
}

// GET /api/wishlist
router.get('/', optionalAuth, async (req, res) => {
  const { field, value } = getIdentifier(req);
  try {
    const whereClause = field === 'user_id' ? { user_id: value } : { session_id: value };
    const wishlists = await prisma.wishlists.findMany({
      where: whereClause,
      include: {
        products: {
          include: {
            product_images: {
              where: { is_primary: true },
              take: 1
            }
          }
        }
      }
    });

    const items = wishlists.map(w => {
        const p = w.products;
        return {
            id: w.id,
            product_id: w.product_id,
            name: p.name,
            price: p.price,
            mrp: p.mrp,
            rating: p.rating,
            brand: p.brand,
            stock: p.stock,
            image: p.product_images?.[0]?.url || null
        }
    });

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/wishlist
router.post('/', optionalAuth, async (req, res) => {
  const { product_id } = req.body;
  const { field, value } = getIdentifier(req);
  if (!product_id) return res.status(400).json({ error: 'product_id required' });
  try {
    const whereClause = field === 'user_id' ? { user_id_product_id: { user_id: value, product_id: parseInt(product_id) } } : { session_id: value, product_id: parseInt(product_id) };

    if (field === 'user_id') {
      await prisma.wishlists.upsert({
        where: whereClause,
        update: {},
        create: { user_id: value, product_id: parseInt(product_id) }
      });
    } else {
        const existing = await prisma.wishlists.findFirst({
            where: { session_id: value, product_id: parseInt(product_id) }
        });
        if (!existing) {
            await prisma.wishlists.create({
                data: { session_id: value, product_id: parseInt(product_id) }
            });
        }
    }
    
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/wishlist/:productId
router.delete('/:productId', optionalAuth, async (req, res) => {
  const { productId } = req.params;
  const { field, value } = getIdentifier(req);
  try {
    if (field === 'user_id') {
        await prisma.wishlists.deleteMany({
            where: { user_id: value, product_id: parseInt(productId) }
        });
    } else {
        await prisma.wishlists.deleteMany({
            where: { session_id: value, product_id: parseInt(productId) }
        });
    }
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
