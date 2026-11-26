const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductBySlug,
  getFeatured,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/featured', getFeatured);
router.get('/slug/:slug', getProductBySlug);
router.get('/:slug', getProductBySlug);

// Admin product endpoints
router.post('/', verifyAdmin, createProduct);
router.put('/:id', verifyAdmin, updateProduct);
router.delete('/:id', verifyAdmin, deleteProduct);

module.exports = router;
