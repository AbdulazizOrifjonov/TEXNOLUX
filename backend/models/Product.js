const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  sku: { type: String, default: '' },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  category: { type: String, required: true },
  categorySlug: { type: String, default: '' },
  subcategory: { type: String, default: '' },
  brand: { type: String, default: 'NSB' },
  stock: { type: Number, default: 10 },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  images: [{ type: String }],
  isBestseller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isWeeklyDeal: { type: Boolean, default: false },
  specifications: [specificationSchema]
}, { timestamps: true });

// Auto calculate discount
productSchema.pre('save', function(next) {
  if (this.oldPrice && this.oldPrice > this.price) {
    this.discountPercent = Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
  } else {
    this.discountPercent = 0;
  }
  this.inStock = this.stock > 0;
  next();
});

module.exports = mongoose.model('Product', productSchema);
