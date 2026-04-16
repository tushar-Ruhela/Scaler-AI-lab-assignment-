const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.get('/', optionalAuth, cartController.getCart);
router.post('/', optionalAuth, cartController.addToCart);
router.put('/:id', optionalAuth, cartController.updateCartItem);
router.delete('/:id', optionalAuth, cartController.removeCartItem);
router.delete('/', optionalAuth, cartController.clearCart);

module.exports = router;
