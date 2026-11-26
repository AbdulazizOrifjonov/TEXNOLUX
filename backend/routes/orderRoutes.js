const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById
} = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Optional auth for customer order creation (guests can also buy!)
router.post('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return verifyToken(req, res, next);
  }
  next();
}, createOrder);

router.get('/my-orders', verifyToken, getMyOrders);
router.get('/:id', getOrderById);

// Admin order endpoints
router.get('/', verifyAdmin, getAllOrders);
router.put('/:id/status', verifyAdmin, updateOrderStatus);

module.exports = router;
