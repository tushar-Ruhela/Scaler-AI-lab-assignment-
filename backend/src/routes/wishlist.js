const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const wishlistController = require('../controllers/wishlistController');

router.get('/', optionalAuth, wishlistController.getWishlist);
router.post('/', optionalAuth, wishlistController.addToWishlist);
router.delete('/:productId', optionalAuth, wishlistController.removeFromWishlist);

module.exports = router;
