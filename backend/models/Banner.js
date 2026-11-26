const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  badge: { type: String, default: '' },
  image: { type: String, default: '' },
  link: { type: String, default: '/shop' },
  type: {
    type: String,
    enum: ['hero', 'hero_side', 'promo_tile', 'weekly_deal'],
    default: 'hero'
  },
  bgColor: { type: String, default: '' },
  textColor: { type: String, default: '#ffffff' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
