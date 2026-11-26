const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'admin', 'manager', 'superadmin'], default: 'customer' },
  avatar: { type: String, default: '' },
  address: {
    city: { type: String, default: 'Buxoro' },
    street: { type: String, default: '' },
    zipCode: { type: String, default: '' }
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
