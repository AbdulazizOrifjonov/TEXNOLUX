const express = require('express');
const router = express.Router();
const { validateCoupon, getAllCoupons, createCoupon, deleteCoupon } = require('../controllers/couponController');
const { verifyAdmin } = require('../middleware/auth');

router.post('/validate', validateCoupon);
router.get('/', verifyAdmin, getAllCoupons);
router.post('/', verifyAdmin, createCoupon);
router.delete('/:id', verifyAdmin, deleteCoupon);

module.exports = router;
