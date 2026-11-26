const express = require('express');
const router = express.Router();
const {
  getApprovedReviews,
  createReview,
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview
} = require('../controllers/reviewController');
const { verifyAdmin } = require('../middleware/auth');

router.get('/', getApprovedReviews);
router.post('/', createReview);

// Admin review endpoints
router.get('/admin', verifyAdmin, getAllReviewsAdmin);
router.put('/:id/status', verifyAdmin, updateReviewStatus);
router.delete('/:id', verifyAdmin, deleteReview);

module.exports = router;
