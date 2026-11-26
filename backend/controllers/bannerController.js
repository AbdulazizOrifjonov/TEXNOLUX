const Banner = require('../models/Banner');

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, message: 'Banner yaratildi', banner });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner topilmadi' });
    res.json({ success: true, message: 'Banner yangilandi', banner });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner topilmadi' });
    res.json({ success: true, message: 'Banner o‘chirildi' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
