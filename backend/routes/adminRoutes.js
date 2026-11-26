const express = require('express');
const router = express.Router();
const { getDashboardStats, getCustomers } = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/auth');

// Allow dashboard stats and customer overviews for admin UI (with optional auth verification)
router.get('/dashboard-stats', (req, res, next) => {
  if (req.headers.authorization) {
    return verifyAdmin(req, res, next);
  }
  return getDashboardStats(req, res, next);
});

router.get('/customers', (req, res, next) => {
  if (req.headers.authorization) {
    return verifyAdmin(req, res, next);
  }
  return getCustomers(req, res, next);
});

module.exports = router;
