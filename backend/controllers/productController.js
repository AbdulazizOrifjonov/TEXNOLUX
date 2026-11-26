const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      categorySlug,
      brand,
      minPrice,
      maxPrice,
      inStock,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (categorySlug) {
      filter.$or = [
        { categorySlug: categorySlug },
        { category: { $regex: categorySlug, $options: 'i' } }
      ];
    } else if (category) {
      filter.$or = [
        { category: { $regex: category, $options: 'i' } },
        { categorySlug: { $regex: category, $options: 'i' } }
      ];
    }

    if (req.query.tag === 'sale') {
      filter.discountPercent = { $gt: 0 };
    } else if (req.query.tag === 'bestseller') {
      filter.isBestseller = true;
    } else if (req.query.tag === 'new') {
      filter.isNewArrival = true;
    }

    if (brand) {
      filter.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (inStock === 'true') {
      filter.inStock = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'popularity') sortOption = { isBestseller: -1, rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
    }
    // Related products in same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(5);

    res.json({ success: true, product, related });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const bestsellers = await Product.find({ isBestseller: true }).limit(10);
    const newArrivals = await Product.find({ isNewArrival: true }).limit(10);
    const weeklyDeals = await Product.find({ isWeeklyDeal: true }).limit(10);

    res.json({
      success: true,
      bestsellers,
      newArrivals,
      weeklyDeals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;
    if (!productData.slug && productData.title) {
      productData.slug = productData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
    }
    const product = await Product.create(productData);
    res.status(201).json({ success: true, message: 'Mahsulot muvaffaqiyatli yaratildi', product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
    res.json({ success: true, message: 'Mahsulot yangilandi', product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
    res.json({ success: true, message: 'Mahsulot o‘chirildi' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
