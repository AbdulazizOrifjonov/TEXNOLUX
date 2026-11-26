const Coupon = require('../models/Coupon');

exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Kupon kodi topilmadi yoki muddati o‘tgan' });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: 'Kuponning amal qilish muddati tugagan' });
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Kupondan foydalanish uchun minimal buyurtma summasi: ${coupon.minOrderAmount.toLocaleString()} so'm`
      });
    }

    let discount = 0;
    if (coupon.discountPercent) {
      discount = Math.round((orderAmount * coupon.discountPercent) / 100);
    } else if (coupon.discountAmount) {
      discount = coupon.discountAmount;
    }

    res.json({
      success: true,
      message: 'Kupon muvaffaqiyatli qo‘llandi!',
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount: coupon.discountAmount,
        calculatedDiscount: discount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Kupon yaratildi', coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Kupon o‘chirildi' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
