const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const ordersController = require('../controllers/ordersController');

router.get('/', optionalAuth, ordersController.getOrders);
router.get('/:id', optionalAuth, ordersController.getOrderById);
router.post('/', optionalAuth, ordersController.placeOrder);

module.exports = router;
