const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getApprovedReviews = async (req, res) => {
  try {
    const filter = { status: 'approved' };
    if (req.query.productId && mongoose.Types.ObjectId.isValid(req.query.productId)) {
      filter.product = req.query.productId;
    }
    const reviews = await Review.find(filter).sort({ createdAt: -1 }).limit(30);
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { productId, productTitle, userName, userEmail, rating, comment } = req.body;
    if (!userName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Ism, baho va sharh majburiy' });
    }

    const isValidId = productId && mongoose.Types.ObjectId.isValid(productId);
    if (isValidId) {
      const hasOrder = await Order.exists({
        orderStatus: { $ne: 'cancelled' },
        'items.product': productId,
        ...(userEmail ? { 'customerDetails.phone': userEmail } : {})
      });
      if (!hasOrder) {
        return res.status(403).json({
          success: false,
          message: 'Faqat ushbu mahsulotni sotib olgan mijozlar sharh qoldirishi mumkin'
        });
      }
    }

    const review = await Review.create({
      product: isValidId ? productId : null,
      productTitle: productTitle || '',
      userName,
      userEmail: userEmail || '',
      rating: Number(rating),
      comment,
      status: 'approved' // auto approve for smooth UX
    });

    let newRating = Number(rating);
    let newReviewsCount = 1;

    if (isValidId) {
      try {
        const approvedReviews = await Review.find({ product: productId, status: 'approved' });
        newReviewsCount = approvedReviews.length;
        if (newReviewsCount > 0) {
          const sum = approvedReviews.reduce((acc, curr) => acc + (curr.rating || 5), 0);
          newRating = Math.round((sum / newReviewsCount) * 10) / 10;
        }
        await Product.findByIdAndUpdate(productId, {
          rating: newRating,
          reviewsCount: newReviewsCount
        });
      } catch (prodErr) {
        console.error('Error updating product rating:', prodErr);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Sharhingiz uchun rahmat!',
      review,
      newRating,
      newReviewsCount
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Sharh o‘chirildi' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
