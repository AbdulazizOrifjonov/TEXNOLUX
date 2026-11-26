const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Banner = require('../models/Banner');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/miniapp_store';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB Connected for Seeding SPORT OUTLET...');

  // Clear existing
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});
  await Banner.deleteMany({});
  await Order.deleteMany({});
  await Coupon.deleteMany({});
  await Review.deleteMany({});

  console.log('Cleared existing collections.');

  // 1. Create Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await User.create({
    name: 'Sport Outlet Admin',
    email: 'admin@sportoutlet.uz',
    password: adminPassword,
    role: 'superadmin',
    phone: '+998 90 123 45 67'
  });

  const customer = await User.create({
    name: 'Bekzod Karimov',
    email: 'bekzod@sportoutlet.uz',
    password: userPassword,
    role: 'customer',
    phone: '+998 91 987 65 43',
    address: { city: 'Buxoro', street: 'Ibn Sino ko‘chasi, 12-uy' }
  });

  console.log('Created Users.');

  // 2. Create Sport Categories
  const categoriesData = [
    { name: 'Krossovkalar & Poyabzallar', slug: 'krossovkalar', icon: 'Footprints', order: 1 },
    { name: 'Erkaklar Sport Kiyimlari', slug: 'erkaklar-sport', icon: 'Shirt', order: 2 },
    { name: 'Ayollar Sport Kiyimlari', slug: 'ayollar-sport', icon: 'Sparkles', order: 3 },
    { name: 'Fitnes & Mashg‘ulot Jihozlari', slug: 'fitnes-trenajor', icon: 'Dumbbell', order: 4 },
    { name: 'Sport Sumkalari & Ryukzaklar', slug: 'sport-sumkalari', icon: 'Package', order: 5 },
    { name: 'Yakka Kurash & Boks', slug: 'boks-yakka-kurash', icon: 'Shield', order: 6 },
    { name: 'Futbol & To‘plar', slug: 'toplar-oyinlar', icon: 'Trophy', order: 7 },
    { name: 'Sport Aksessuarlari', slug: 'sport-aksessuarlari', icon: 'Activity', order: 8 }
  ];
  const categories = await Category.insertMany(categoriesData);
  console.log(`Created ${categories.length} Sport Categories.`);

  // 3. Create Sports Products with high-res Unsplash sports photography
  const productsData = [
    // ---------------- 1. Krossovkalar & Poyabzallar ----------------
    {
      title: 'Nike Air Jordan 1 Retro High OG (Chicago)',
      slug: 'nike-air-jordan-1-retro-high-og',
      sku: 'SO-JORD-001',
      description: 'Afsonaviy Nike Air Jordan 1 modeli. Yuqori sifatli tabiiy charm, Air-Sole amortizatsiyasi va qulaylik. Basketbol va kundalik kiyish uchun 100% original model.',
      price: 1850000,
      oldPrice: 2100000,
      discountPercent: 12,
      category: 'Krossovkalar & Poyabzallar',
      categorySlug: 'krossovkalar',
      brand: 'Nike',
      stock: 14,
      rating: 5.0,
      reviewsCount: 38,
      isBestseller: true,
      isNewArrival: false,
      isWeeklyDeal: true,
      images: [
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=900&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Brend', value: 'Nike' },
        { key: 'Material', value: 'Tabiiy charm, premium tekstil' },
        { key: 'Taglik texnologiyasi', value: 'Nike Air-Sole amortizatsiya' },
        { key: 'Mavsum', value: 'Barcha fasllar' },
        { key: 'Ishlab chiqarilgan', value: 'Vietnam (Original)' }
      ]
    },
    {
      title: 'Nike Air Force 1 07 Low All White Classic',
      slug: 'nike-air-force-1-07-all-white',
      sku: 'SO-AF1-002',
      description: 'Dunyodagi eng ommabop krossovka modeli. Oq rangli sifatli charm, mustahkam taglik va qulay qolip. Har qanday sport va kundalik kiyim bilan ideal mos tushadi.',
      price: 1250000,
      oldPrice: 1450000,
      discountPercent: 14,
      category: 'Krossovkalar & Poyabzallar',
      categorySlug: 'krossovkalar',
      brand: 'Nike',
      stock: 22,
      rating: 4.9,
      reviewsCount: 54,
      isBestseller: true,
      isNewArrival: false,
      isWeeklyDeal: false,
      images: [
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Brend', value: 'Nike' },
        { key: 'Rang', value: 'Oq (Triple White)' },
        { key: 'Material', value: 'Tabiiy charm' },
        { key: 'Kafolat', value: '6 oy rasmiy' }
      ]
    },
    {
      title: 'Adidas Ultraboost Light Running Shoes',
      slug: 'adidas-ultraboost-light-running',
      sku: 'SO-UB-003',
      description: 'Yugurish va fitnes uchun eng ilg‘or krossovka. Boost taglik energiyani 100% qaytaradi va bo‘g‘imlarga yuk tushishini kamaytiradi. Continental rezina protektor.',
      price: 1650000,
      oldPrice: 1950000,
      discountPercent: 15,
      category: 'Krossovkalar & Poyabzallar',
      categorySlug: 'krossovkalar',
      brand: 'Adidas',
      stock: 11,
      rating: 5.0,
      reviewsCount: 29,
      isBestseller: true,
      isNewArrival: true,
      isWeeklyDeal: true,
      images: [
        'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=900&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Brend', value: 'Adidas' },
        { key: 'Taglik', value: 'Ultraboost Light + Continental Rubber' },
        { key: 'Ustki qism', value: 'Primeknit+ nafas oluvchi tola' },
        { key: 'Vazn', value: '290 gramm' }
      ]
    },
    {
      title: 'Nike Air Max 270 Black & Volt Edition',
      slug: 'nike-air-max-270-black-volt',
      sku: 'SO-AM270-004',
      description: 'Tovondagi 270 gradusli eng katta havo yostig‘i yumshoq qadam va ajoyib dinamikani ta’minlaydi. Sport zal va kundalik faol harakat uchun mo‘ljallangan.',
      price: 1420000,
      oldPrice: 1600000,
      discountPercent: 11,
      category: 'Krossovkalar & Poyabzallar',
      categorySlug: 'krossovkalar',
      brand: 'Nike',
      stock: 16,
      rating: 4.8,
      reviewsCount: 21,
      isBestseller: false,
      isNewArrival: true,
      isWeeklyDeal: false,
      images: [
        'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=900&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Brend', value: 'Nike' },
        { key: 'Amortizatsiya', value: 'Max Air 270' },
        { key: 'Rang', value: 'Qora / Neon Volt' }
      ]
    },
    {
      title: 'Puma Velocity Nitro 2 Professional Running',
      slug: 'puma-velocity-nitro-2-running',
      sku: 'SO-PUMA-005',
      description: 'Yengil, qayishqoq va nihoyatda chidamli yugurish poyabzali. Nitro Foam ko‘pikli taglik yuguruvchilar orasida yuqori baholangan.',
      price: 980000,
      oldPrice: 1200000,
      discountPercent: 18,
      category: 'Krossovkalar & Poyabzallar',
      categorySlug: 'krossovkalar',
      brand: 'Puma',
      stock: 18,
      rating: 4.9,
      reviewsCount: 17,
      isBestseller: false,
      isNewArrival: true,
      isWeeklyDeal: true,
      images: [
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Brend', value: 'Puma' },
        { key: 'Texnologiya', value: 'Nitro Foam' },
        { key: 'Mosligi', value: 'Marafon va sprint' }
      ]
    },
    {
      title: 'Asics Gel-Kayano 30 Stability Running Shoes',
      slug: 'asics-gel-kayano-30-running',
      sku: 'SO-ASICS-006',
      description: 'Pronatsiyani to‘g‘rilovchi, oyoq charchashini oldini oluvchi dunyodagi 1-raqamli stabilizatsiya krossovkasi. Gel amortizatsiyasi bilan.',
      price: 1780000,
      oldPrice: 2050000,
      discountPercent: 13,
      category: 'Krossovkalar & Poyabzallar',
      categorySlug: 'krossovkalar',
      brand: 'Asics',
      stock: 8,
      rating: 5.0,
      reviewsCount: 15,
      isBestseller: true,
      isNewArrival: false,
      isWeeklyDeal: false,
      images: [
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Brend', value: 'Asics' },
        { key: 'Amortizatsiya', value: 'PureGEL + FF Blast Plus' },
        { key: 'Kafolat', value: '1 yil' }
      ]
    },

    // ---------------- 2. Erkaklar Sport Kiyimlari ----------------
    {
      title: 'Nike Sportswear Club Fleece Hudi & Shim Kostyumi',
      slug: 'nike-sportswear-club-fleece-suit',
      sku: 'SO-CLOTH-101',
      description: 'Qulay paxta fleece matosidan tayyorlangan original sport kostyumi. Ichki qismi yumshoq junli, trenirovka va kundalik sayr uchun ideal tanlov.',
      price: 950000,
      oldPrice: 1150000,
      discountPercent: 17,
      category: 'Erkaklar Sport Kiyimlari',
      categorySlug: 'erkaklar-sport',
      brand: 'Nike',
      stock: 25,
      rating: 5.0,
      reviewsCount: 42,
      isBestseller: true,
      isNewArrival: false,
      isWeeklyDeal: true,
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Brend', value: 'Nike' },
        { key: 'Tarkibi', value: '80% paxta, 20% poliester' },
        { key: 'O‘lchamlar', value: 'S, M, L, XL, XXL' },
        { key: 'Qolip', value: 'Standard Fit' }
      ]
    },
    {
      title: 'Under Armour HeatGear Compression T-Shirt',
      slug: 'under-armour-heatgear-compression-tee',
      sku: 'SO-CLOTH-102',
      description: 'Mushaklarni qo‘llab-quvvatlovchi va terni bir zumda bug‘latuvchi professional kompressor futbolka. Qon aylanishini tezlashtiradi.',
      price: 380000,
      oldPrice: 450000,
      discountPercent: 15,
      category: 'Erkaklar Sport Kiyimlari',
      categorySlug: 'erkaklar-sport',
      brand: 'Under Armour',
      stock: 30,
      rating: 4.9,
      reviewsCount: 31,
      isBestseller: true,
      isNewArrival: true,
      isWeeklyDeal: false,
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Brend', value: 'Under Armour' },
        { key: 'Texnologiya', value: 'HeatGear 4-way stretch' },
        { key: 'Himoya', value: 'UPF 30+ quyoshdan himoya' }
      ]
    },
    {
      title: 'Adidas Tiro 23 League Erkaklar Sport Kostyumi',
      slug: 'adidas-tiro-23-league-suit',
      sku: 'SO-CLOTH-103',
      description: 'Futbolchilar va yuguruvchilar tanlovi. Aeroready matosi har doim quruq va salqin tutadi. Fermuarli cho‘ntaklar va toraytirilgan shim.',
      price: 870000,
      oldPrice: 1050000,
      discountPercent: 17,
      category: 'Erkaklar Sport Kiyimlari',
      categorySlug: 'erkaklar-sport',
      brand: 'Adidas',
      stock: 19,
      rating: 4.8,
      reviewsCount: 26,
      isBestseller: false,
      isNewArrival: false,
      isWeeklyDeal: true,
      images: [
        'https://images.unsplash.com/photo-1578768079052-aa76e520028b?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Brend', value: 'Adidas' },
        { key: 'Texnologiya', value: 'AEROREADY namlikni yutuvchi' },
        { key: 'Rang', value: 'Qora / Oq chiziqlar' }
      ]
    },
    {
      title: 'Nike Pro Dri-FIT Mashg‘ulot Shortigi',
      slug: 'nike-pro-dri-fit-training-shorts',
      sku: 'SO-CLOTH-104',
      description: 'Elastik kamar, yengil nafas oluvchi to‘rli panellar va harakat erkinligi. Zal, krossfit va yugurish uchun maxsus ishlab chiqilgan.',
      price: 320000,
      oldPrice: 390000,
      discountPercent: 18,
      category: 'Erkaklar Sport Kiyimlari',
      categorySlug: 'erkaklar-sport',
      brand: 'Nike',
      stock: 35,
      rating: 4.9,
      reviewsCount: 19,
      isBestseller: false,
      isNewArrival: true,
      isWeeklyDeal: false,
      images: [
        'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Brend', value: 'Nike' },
        { key: 'Material', value: 'Dri-FIT 100% poliester' }
      ]
    },

    // ---------------- 3. Ayollar Sport Kiyimlari ----------------
    {
      title: 'Nike Zenvy Gentle-Hold Yuqori belli Leggings',
      slug: 'nike-zenvy-gentle-hold-leggings',
      sku: 'SO-WOMEN-201',
      description: 'InfinaSoft matosi tanaga nozik teginadi va harakatda to‘liq erkinlik beradi. Yoga, pilates va fitnes mashg‘ulotlarida sirg‘alib tushmaydi.',
      price: 580000,
      oldPrice: 690000,
      discountPercent: 16,
      category: 'Ayollar Sport Kiyimlari',
      categorySlug: 'ayollar-sport',
      brand: 'Nike',
      stock: 20,
      rating: 5.0,
      reviewsCount: 37,
      isBestseller: true,
      isNewArrival: true,
      isWeeklyDeal: true,
      images: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Brend', value: 'Nike' },
        { key: 'Material', value: 'InfinaSoft mikrofibra' },
        { key: 'Bel qismi', value: 'High-waisted (yuqori bel)' }
      ]
    },
    {
      title: 'Gymshark Vital Seamless 2.0 Fitnes To‘plami',
      slug: 'gymshark-vital-seamless-set',
      sku: 'SO-WOMEN-202',
      description: 'Choksiz texnologiya, qorin qismini tortuvchi kamar va qomatni ko‘rsatuvchi soya effektlari. Sport zal uchun eng zamonaviy ayollar libosi.',
      price: 780000,
      oldPrice: 920000,
      discountPercent: 15,
      category: 'Ayollar Sport Kiyimlari',
      categorySlug: 'ayollar-sport',
      brand: 'Gymshark',
      stock: 15,
      rating: 4.9,
      reviewsCount: 28,
      isBestseller: true,
      isNewArrival: false,
      isWeeklyDeal: false,
      images: [
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Brend', value: 'Gymshark' },
        { key: 'To‘plam', value: 'Leggings + Krop-top' },
        { key: 'Choklar', value: 'Seamless (choksiz)' }
      ]
    },

    // ---------------- 4. Fitnes & Mashg‘ulot Jihozlari ----------------
    {
      title: 'Hexagonal Rezinali Gantellar To‘plami (2x 10kg)',
      slug: 'hexagonal-rezinali-gantellar-2x10kg',
      sku: 'SO-FIT-301',
      description: 'Polga tushganda zarar yetkazmaydigan sifatli quyma rezina qoplama. Xromlangan ergonomik tutqich qo‘ldan sirpanib ketmaydi. Uy va zal uchun.',
      price: 720000,
      oldPrice: 850000,
      discountPercent: 15,
      category: 'Fitnes & Mashg‘ulot Jihozlari',
      categorySlug: 'fitnes-trenajor',
      brand: 'Sport Outlet Pro',
      stock: 28,
      rating: 5.0,
      reviewsCount: 44,
      isBestseller: true,
      isNewArrival: false,
      isWeeklyDeal: true,
      images: [
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Og‘irligi', value: '2 dona x 10 kg (jami 20 kg)' },
        { key: 'Material', value: 'Quyma po‘lat + ekologik kauchuk' },
        { key: 'Tutqich', value: 'Xromlangan naqshli po‘lat' }
      ]
    },
    {
      title: 'Sozlanuvchan Fitnes Skameykasi (Incline Bench Pro)',
      slug: 'sozlanuvchan-fitnes-skameykasi-incline-bench',
      sku: 'SO-FIT-302',
      description: '7 xil burchakka sozlanadigan mustahkam professional skameyka. 300 kg gacha yuk ko‘tarish quvvatiga ega. Gantel va shtangada mashq qilish uchun.',
      price: 1650000,
      oldPrice: 1950000,
      discountPercent: 15,
      category: 'Fitnes & Mashg‘ulot Jihozlari',
      categorySlug: 'fitnes-trenajor',
      brand: 'Sport Outlet Pro',
      stock: 9,
      rating: 4.9,
      reviewsCount: 18,
      isBestseller: false,
      isNewArrival: true,
      isWeeklyDeal: false,
      images: [
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Maksimal yuklama', value: '300 kg' },
        { key: 'Burchak holatlari', value: '-20° dan +85° gacha (7 xil)' },
        { key: 'Qoplama', value: 'Yirtilmaydigan charm analogi' }
      ]
    },
    {
      title: 'Professional Latex Fitnes Rezinkalari (5 xil og‘irlik)',
      slug: 'latex-fitnes-rezinkalari-5x-set',
      sku: 'SO-FIT-303',
      description: '100% tabiiy Malayziya lateksidan tayyorlangan 5 xil elastiklikdagi lenta. Cho‘zilish kuchi: 4.5 kg dan 23 kg gacha. Sumkachasi bilan.',
      price: 190000,
      oldPrice: 240000,
      discountPercent: 21,
      category: 'Fitnes & Mashg‘ulot Jihozlari',
      categorySlug: 'fitnes-trenajor',
      brand: 'Sport Outlet Pro',
      stock: 45,
      rating: 4.9,
      reviewsCount: 52,
      isBestseller: true,
      isNewArrival: false,
      isWeeklyDeal: true,
      images: [
        'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Soni', value: '5 dona rezinka + sumka' },
        { key: 'Material', value: '100% tabiiy lateks' }
      ]
    },
    {
      title: 'Premium Yoga & Fitnes Kovriki (10mm qalinlik)',
      slug: 'premium-yoga-fitnes-kovriki-10mm',
      sku: 'SO-FIT-304',
      description: 'Sirpanmaydigan NBR eko-ko‘pik. Bo‘g‘imlarni qattiq poldan himoya qiladi. Tasmali sumkasi bilan qulay ko‘tarib yurish mumkin.',
      price: 240000,
      oldPrice: 290000,
      discountPercent: 17,
      category: 'Fitnes & Mashg‘ulot Jihozlari',
      categorySlug: 'fitnes-trenajor',
      brand: 'Sport Outlet Pro',
      stock: 35,
      rating: 4.8,
      reviewsCount: 23,
      isBestseller: false,
      isNewArrival: true,
      isWeeklyDeal: false,
      images: [
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Qalinligi', value: '10 mm' },
        { key: 'O‘lchami', value: '183 x 61 cm' }
      ]
    },

    // ---------------- 5. Sport Sumkalari & Ryukzaklar ----------------
    {
      title: 'Nike Brasilia 9.5 Sport Zal Sumkasi (60L)',
      slug: 'nike-brasilia-9-5-duffel-bag-60l',
      sku: 'SO-BAG-401',
      description: 'Poyabzal uchun alohida shamollatiladigan bo‘lim, suv o‘tkazmaydigan mustahkam tub va keng asosiy cho‘ntak. Sport kiyimlari va anjomlari uchun mukammal.',
      price: 450000,
      oldPrice: 530000,
      discountPercent: 15,
      category: 'Sport Sumkalari & Ryukzaklar',
      categorySlug: 'sport-sumkalari',
      brand: 'Nike',
      stock: 24,
      rating: 5.0,
      reviewsCount: 39,
      isBestseller: true,
      isNewArrival: false,
      isWeeklyDeal: true,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Hajmi', value: '60 litr (O‘rta o‘lcham)' },
        { key: 'Material', value: '100% zich poliester' },
        { key: 'Cho‘ntaklar', value: 'Poyabzal bo‘limi, ichki va yon fermuarlar' }
      ]
    },
    {
      title: 'Under Armour Hustle 5.0 Suv O‘tkazmaydigan Ryukzak',
      slug: 'under-armour-hustle-5-0-backpack',
      sku: 'SO-BAG-402',
      description: 'UA Storm suv qaytaruvchi texnologiyasi. Sport kiyimlari, poyabzal va aksessuarlar bo‘limi, yumshoq HeatGear elkama-kamar va 2 ta yon suv cho‘ntagi.',
      price: 620000,
      oldPrice: 720000,
      discountPercent: 14,
      category: 'Sport Sumkalari & Ryukzaklar',
      categorySlug: 'sport-sumkalari',
      brand: 'Under Armour',
      stock: 16,
      rating: 4.9,
      reviewsCount: 22,
      isBestseller: false,
      isNewArrival: true,
      isWeeklyDeal: false,
      images: [
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Hajmi', value: '29 litr' },
        { key: 'Xususiyat', value: 'UA Storm suv o‘tkazmaydigan qoplama' }
      ]
    },

    // ---------------- 6. Yakka Kurash & Boks ----------------
    {
      title: 'Venum Challenger 3.0 Boks Qo‘lqoplari (12 oz)',
      slug: 'venum-challenger-3-0-boxing-gloves-12oz',
      sku: 'SO-BOX-501',
      description: 'Uch qatlamli zich ko‘pik zarba kuchini o‘ziga yutadi. Keng yopishqoq kamar bilakni sinishdan asraydi. Boks, kikboks va muay-tay uchun.',
      price: 680000,
      oldPrice: 790000,
      discountPercent: 14,
      category: 'Yakka Kurash & Boks',
      categorySlug: 'boks-yakka-kurash',
      brand: 'Venum',
      stock: 18,
      rating: 5.0,
      reviewsCount: 33,
      isBestseller: true,
      isNewArrival: false,
      isWeeklyDeal: true,
      images: [
        'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Hajmi / Og‘irligi', value: '12 oz (mashg‘ulot va sparring)' },
        { key: 'Material', value: 'Yuqori sifatli PU sintetik charm' }
      ]
    },
    {
      title: 'Everlast Professional Boks Bintlari (4.5 metr)',
      slug: 'everlast-boks-bintlari-4-5m',
      sku: 'SO-BOX-502',
      description: 'Elastik paxtadan tayyorlangan 4.5 metrli boks binti. Barmoqlar va bilak bo‘g‘imlarini to‘liq mustahkamlaydi. Juftlikda.',
      price: 950000,
      oldPrice: 120000,
      discountPercent: 20,
      category: 'Yakka Kurash & Boks',
      categorySlug: 'boks-yakka-kurash',
      brand: 'Everlast',
      stock: 40,
      rating: 4.8,
      reviewsCount: 47,
      isBestseller: false,
      isNewArrival: true,
      isWeeklyDeal: false,
      images: [
        'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Uzunligi', value: '4.5 metr' },
        { key: 'Tarkibi', value: 'Paxta + elastan' }
      ]
    },

    // ---------------- 7. Futbol & To‘plar ----------------
    {
      title: 'Adidas UCL Pro 2024 Chempionlar Ligasi Rasmiy To‘pi',
      slug: 'adidas-ucl-pro-2024-matchball',
      sku: 'SO-BALL-601',
      description: 'UEFA Champions League rasmiy o‘yin to‘pi. Termik birlashtirilgan choksiz sirt (Thermal Bonded). FIFA Quality Pro xalqaro sertifikatiga ega.',
      price: 850000,
      oldPrice: 990000,
      discountPercent: 14,
      category: 'Futbol & To‘plar',
      categorySlug: 'toplar-oyinlar',
      brand: 'Adidas',
      stock: 20,
      rating: 5.0,
      reviewsCount: 41,
      isBestseller: true,
      isNewArrival: true,
      isWeeklyDeal: true,
      images: [
        'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=900&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Standart', value: 'O‘lcham 5 (Kattalar)' },
        { key: 'Sertifikat', value: 'FIFA Quality Pro' },
        { key: 'Choklar', value: 'Termo-choksiz texnologiya' }
      ]
    },
    {
      title: 'Spalding NBA TF-1000 Precision Basketbol To‘pi',
      slug: 'spalding-nba-tf-1000-basketball',
      sku: 'SO-BALL-602',
      description: 'Zal va ko‘cha maydonlari uchun kompozit charm to‘p. Chuqur kanallar va namlikni shimuvchi yuza qo‘lda to‘pni ajoyib his qilishni ta’minlaydi.',
      price: 640000,
      oldPrice: 750000,
      discountPercent: 15,
      category: 'Futbol & To‘plar',
      categorySlug: 'toplar-oyinlar',
      brand: 'Spalding',
      stock: 15,
      rating: 4.9,
      reviewsCount: 19,
      isBestseller: false,
      isNewArrival: false,
      isWeeklyDeal: false,
      images: [
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'O‘lchami', value: 'Hajm 7 (Erkaklar rasmiy)' },
        { key: 'Material', value: 'Mikrofibra kompozit charm' }
      ]
    },

    // ---------------- 8. Sport Aksessuarlari ----------------
    {
      title: 'Nike Sport Hydro Water Bottle (950ml, BPA Free)',
      slug: 'nike-sport-hydro-water-bottle-950ml',
      sku: 'SO-ACC-701',
      description: 'Ergonomik rezinali ushlagich, tezkor klapan va xavfsiz oziq-ovqat plastikidan tayyorlangan 950ml sig‘imli sport suv idishi. Oqmaydi.',
      price: 160000,
      oldPrice: 190000,
      discountPercent: 16,
      category: 'Sport Aksessuarlari',
      categorySlug: 'sport-aksessuarlari',
      brand: 'Nike',
      stock: 50,
      rating: 4.9,
      reviewsCount: 65,
      isBestseller: true,
      isNewArrival: false,
      isWeeklyDeal: true,
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Hajmi', value: '950 ml' },
        { key: 'Xususiyati', value: '100% BPA Free, oqishdan himoya' }
      ]
    },
    {
      title: 'Under Armour Iso-Chill Shamollatuvchi Kepka',
      slug: 'under-armour-iso-chill-cap',
      sku: 'SO-ACC-702',
      description: 'Iso-Chill tolalari tana issiqligini tarqatadi va sovitish hissini beradi. Lazerli teshikchalar orqali yugurishda havo aylanadi.',
      price: 220000,
      oldPrice: 260000,
      discountPercent: 15,
      category: 'Sport Aksessuarlari',
      categorySlug: 'sport-aksessuarlari',
      brand: 'Under Armour',
      stock: 32,
      rating: 4.8,
      reviewsCount: 24,
      isBestseller: false,
      isNewArrival: true,
      isWeeklyDeal: false,
      images: [
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900&auto=format&fit=crop&q=85'
      ],
      specifications: [
        { key: 'Brend', value: 'Under Armour' },
        { key: 'Texnologiya', value: 'Iso-Chill cooling' }
      ]
    }
  ];

  const products = await Product.insertMany(productsData);
  console.log(`Created ${products.length} SPORT OUTLET Products.`);

  // 4. Create Sport Coupons
  await Coupon.create({
    code: 'SPORT2026',
    discountPercent: 15,
    expiryDate: new Date('2027-01-01'),
    active: true,
    minOrderAmount: 300000
  });
  await Coupon.create({
    code: 'SO_OUTLET',
    discountPercent: 10,
    expiryDate: new Date('2027-01-01'),
    active: true,
    minOrderAmount: 200000
  });

  // 5. Create Sample Orders for Dashboard Stats
  await Order.create({
    orderNumber: 'SO-100201',
    customerDetails: {
      fullName: 'Sardor Rahimiy',
      phone: '+998 90 555 44 33',
      city: 'Toshkent',
      address: 'Chilonzor 9, 14-uy'
    },
    items: [
      {
        product: products[0]._id,
        title: products[0].title,
        price: products[0].price,
        quantity: 1,
        image: products[0].images[0]
      }
    ],
    totalAmount: 1850000,
    paymentMethod: 'click',
    orderStatus: 'delivered'
  });

  await Order.create({
    orderNumber: 'SO-100202',
    customerDetails: {
      fullName: 'Jasur Olimov',
      phone: '+998 93 444 11 22',
      city: 'Samarqand',
      address: 'Registon ko‘chasi, 8'
    },
    items: [
      {
        product: products[2]._id,
        title: products[2].title,
        price: products[2].price,
        quantity: 1,
        image: products[2].images[0]
      }
    ],
    totalAmount: 1650000,
    paymentMethod: 'payme',
    orderStatus: 'processing'
  });

  await Order.create({
    orderNumber: 'SO-100203',
    customerDetails: {
      fullName: 'Diyorbek Toshpo‘latov',
      phone: '+998 97 111 22 33',
      city: 'Buxoro',
      address: 'Mustaqillik 24'
    },
    items: [
      {
        product: products[6]._id,
        title: products[6].title,
        price: products[6].price,
        quantity: 1,
        image: products[6].images[0]
      }
    ],
    totalAmount: 950000,
    paymentMethod: 'cash',
    orderStatus: 'new'
  });

  console.log('Created Sample Orders.');
  console.log('✅ SPORT OUTLET SEEDING COMPLETED SUCCESSFULLY!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding Error:', err);
  process.exit(1);
});
