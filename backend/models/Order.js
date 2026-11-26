const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customerDetails: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, default: 'Buxoro' },
    address: { type: String, required: true },
    notes: { type: String, default: '' },
    coordinates: {
      lat: { type: Number },
      lon: { type: Number }
    },
    locationUrl: { type: String, default: '' }
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  paymentMethod: {
    type: String,
    enum: ['cash', 'payme', 'click', 'terminal', 'bank_transfer'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['new', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'new'
  },
  deliveryType: {
    type: String,
    enum: ['standard', 'express'],
    default: 'standard'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
