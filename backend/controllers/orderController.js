const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { customerDetails, items, totalAmount, deliveryFee, paymentMethod, deliveryType } = req.body;
    if (!customerDetails || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Buyurtma ma‘lumotlari to‘liq emas' });
    }

    const orderNumber = 'NSB-' + Date.now().toString().slice(-6) + '-' + Math.floor(10 + Math.random() * 90);
    const userId = req.user ? req.user.id : null;

    const order = await Order.create({
      orderNumber,
      user: userId,
      customerDetails,
      items,
      totalAmount,
      deliveryFee: deliveryFee || 0,
      paymentMethod: paymentMethod || 'cash',
      deliveryType: deliveryType || 'standard',
      orderStatus: 'new',
      paymentStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Buyurtmangiz muvaffaqiyatli qabul qilindi!',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      filter.orderStatus = status;
    }

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });

    res.json({ success: true, message: 'Buyurtma holati yangilandi', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
