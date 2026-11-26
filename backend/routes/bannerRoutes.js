const express = require('express');
const router = express.Router();
const { getAllBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { verifyAdmin } = require('../middleware/auth');

router.get('/', getAllBanners);
router.post('/', verifyAdmin, createBanner);
router.put('/:id', verifyAdmin, updateBanner);
router.delete('/:id', verifyAdmin, deleteBanner);

module.exports = router;
