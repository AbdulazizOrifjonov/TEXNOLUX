const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, '..', 'frontend', 'src', 'services', 'mockData.js');

const defaultCategories = [
  {
    "_id": "cat_trenajorlar",
    "id": "cat_trenajorlar",
    "name": "Trenajorlar & Kardio",
    "slug": "trenajorlar",
    "icon": "Activity",
    "description": "Professional zal va uy uchun yugurish yo‘lakchalari, velotrenajorlar va kardiomashinalar",
    "image": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80",
    "order": 1,
    "active": true,
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "cat_gantellar",
    "id": "cat_gantellar",
    "name": "Gantellar & Shtangalar",
    "slug": "gantellar",
    "icon": "Dumbbell",
    "description": "Kauchukli va xromli gantellar, shtanga griflari va og‘ir atletika disklari",
    "image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
    "order": 2,
    "active": true,
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "cat_stoykalar",
    "id": "cat_stoykalar",
    "name": "Podstavka & Skameykalar",
    "slug": "stoykalar",
    "icon": "Layers",
    "description": "Gantel podstavkalari, mashg‘ulot skameykalari, turnik va shtanga stoykalari",
    "image": "/uploads/gantel-podstavka-sc80263.png",
    "order": 3,
    "active": true,
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "cat_sport-kiyimlari",
    "id": "cat_sport-kiyimlari",
    "name": "Sport Kiyimlari",
    "slug": "sport-kiyimlari",
    "icon": "Shirt",
    "description": "Nafas oluvchi termo sport kostyumlari, zal liboslari, hudilar va futbolkalar",
    "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    "order": 4,
    "active": true,
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "cat_krossovkalar",
    "id": "cat_krossovkalar",
    "name": "Krossovkalar & Poyabzal",
    "slug": "krossovkalar",
    "icon": "Footprints",
    "description": "Nike, Jordan, Adidas original yugurish va fitnes krossovkalari",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    "order": 5,
    "active": true,
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "cat_fitnes-aksessuarlari",
    "id": "cat_fitnes-aksessuarlari",
    "name": "Fitnes Aksessuarlari",
    "slug": "fitnes-aksessuarlari",
    "icon": "Award",
    "description": "Sport sumkalari, fitnes rezinkalari, mashg‘ulot qo‘lqoplari va gilamchalar",
    "image": "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop&q=80",
    "order": 6,
    "active": true,
    "created_at": "2026-11-21T12:00:00.000Z"
  }
];

const defaultProducts = [
  {
    "_id": "prod_gantel-podstavka-sc80263",
    "id": "prod_gantel-podstavka-sc80263",
    "title": "Gantel podstavka SC80263",
    "slug": "gantel-podstavka-sc80263",
    "sku": "0455763",
    "description": "Gantel podstavka SC80263 (Kodi: 0455763, Narxi: 75$). Mustahkam po'lat konstruksiyaga ega professional gantel qo'yish stoykasi. A-shaklli qulay va ixcham dizayn, gantellarni tartibli saqlash uchun mo'ljallangan. Buxoro bo'yicha tezkor yetkazib berish.",
    "price": 960000,
    "oldPrice": 1100000,
    "old_price": 1100000,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Podstavka & Skameykalar",
    "category_slug": "stoykalar",
    "categorySlug": "stoykalar",
    "subcategory": "Gantel Stoykalari",
    "brand": "Sport Line",
    "stock": 15,
    "inStock": true,
    "in_stock": true,
    "rating": 5.0,
    "reviews_count": 8,
    "images": [
      "/uploads/gantel-podstavka-sc80263.png"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": true,
    "specifications": [
      { "label": "Model", "value": "SC80263" },
      { "label": "Mahsulot kodi", "value": "0455763" },
      { "label": "Narxi (USD)", "value": "75$" },
      { "label": "Material", "value": "Mustahkam qotishma po'lat (Black powder coating)" },
      { "label": "Shakl", "value": "A-Frame ixcham va xavfsiz dizayn" },
      { "label": "Sig'imi", "value": "6 juft gantellar uchun maxsus qavslar" },
      { "label": "Kafolat", "value": "1 yil rasmiy kafolat" },
      { "label": "Yetkazib berish", "value": "Buxoro bo'ylab bepul va tezkor" }
    ],
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "prod_yugurish-yolakchasi-proform-t800",
    "id": "prod_yugurish-yolakchasi-proform-t800",
    "title": "Professional Yugurish Yo‘lakchasi ProForm T800",
    "slug": "yugurish-yolakchasi-proform-t800",
    "sku": "0455801",
    "description": "3.5 Ot kuchiga ega shovqinsiz kuchli dvigatel, avtomatik 15% qiyalik burchagi, 8 pog‘onali bo‘g‘inlarni asrovchi amortizatsiya tizimi va sensorli LED displey.",
    "price": 8500000,
    "oldPrice": 9800000,
    "old_price": 9800000,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Trenajorlar & Kardio",
    "category_slug": "trenajorlar",
    "categorySlug": "trenajorlar",
    "subcategory": "Yugurish yo‘lakchalari",
    "brand": "ProForm",
    "stock": 8,
    "inStock": true,
    "in_stock": true,
    "rating": 5.0,
    "reviews_count": 14,
    "images": [
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=1000&auto=format&fit=crop&q=85"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "specifications": [
      { "label": "Dvigatel quvvati", "value": "3.5 HP (Doimiy quvvat)" },
      { "label": "Tezlik diapazoni", "value": "1 - 18 km/soat" },
      { "label": "Maksimal yuklama", "value": "140 kg" },
      { "label": "Yugurish maydoni", "value": "135 x 48 sm" },
      { "label": "Kafolat", "value": "2 yil rasmiy kafolat" }
    ],
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "prod_multi-gym-station-hg500",
    "id": "prod_multi-gym-station-hg500",
    "title": "Ko‘p Funksiyali Kuch Trenajori Multi-Gym HG-500",
    "slug": "multi-gym-station-hg500",
    "sku": "0455802",
    "description": "Ko‘krak, yelka, orqa, bisept, trisept va oyoq mushaklari uchun 15 dan ortiq mashqlarni bajaruvchi universal trenajor. 75 kg li xavfsiz blokli yuklar to‘plami.",
    "price": 12800000,
    "oldPrice": 14500000,
    "old_price": 14500000,
    "discountPercent": 12,
    "discount_percent": 12,
    "category": "Trenajorlar & Kardio",
    "category_slug": "trenajorlar",
    "categorySlug": "trenajorlar",
    "subcategory": "Kuch trenajorlari",
    "brand": "IronPower",
    "stock": 5,
    "inStock": true,
    "in_stock": true,
    "rating": 4.9,
    "reviews_count": 11,
    "images": [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1000&auto=format&fit=crop&q=85"
    ],
    "is_bestseller": true,
    "is_new_arrival": false,
    "is_weekly_deal": true,
    "specifications": [
      { "label": "Og‘irlik bloki", "value": "75 kg (Kauchuklangan disklarda)" },
      { "label": "Konstruksiya", "value": "50x70 mm mustahkam po‘lat profil" },
      { "label": "Maksimal foydalanuvchi vazni", "value": "150 kg" },
      { "label": "Kafolat", "value": "3 yil servis xizmati" }
    ],
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "prod_velotrenajor-spin-bike-sb300",
    "id": "prod_velotrenajor-spin-bike-sb300",
    "title": "Magnitli Velotrenajor Spining Bike SB-300",
    "slug": "velotrenajor-spin-bike-sb300",
    "sku": "0455803",
    "description": "18 kg li og‘ir maxovik, magnitli ovozsiz yuklash tizimi, qulay anatomik sport o‘rindig‘i va smartfon ushlagichi bilan.",
    "price": 3200000,
    "oldPrice": 3700000,
    "old_price": 3700000,
    "discountPercent": 14,
    "discount_percent": 14,
    "category": "Trenajorlar & Kardio",
    "category_slug": "trenajorlar",
    "categorySlug": "trenajorlar",
    "subcategory": "Velotrenajorlar",
    "brand": "Sport Life",
    "stock": 12,
    "inStock": true,
    "in_stock": true,
    "rating": 4.8,
    "reviews_count": 9,
    "images": [
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=1000&auto=format&fit=crop&q=85"
    ],
    "is_bestseller": true,
    "is_new_arrival": false,
    "is_weekly_deal": false,
    "specifications": [
      { "label": "Maxovik vazni", "value": "18 kg" },
      { "label": "Tizim", "value": "Kamarlik, ovozsiz magnit" },
      { "label": "Displey", "value": "Tezlik, masofa, kaloriya, puls" }
    ],
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "prod_gantellar-toplami-rubber-hex",
    "id": "prod_gantellar-toplami-rubber-hex",
    "title": "Professional Kauchukli Gantellar To‘plami (2.5kg - 25kg)",
    "slug": "gantellar-toplami-rubber-hex",
    "sku": "0455804",
    "description": "Olti burchakli (Hex) xrom tutqichli rezinalangan mustahkam gantellar to‘plami. Polga zarar yetkazmaydi, xavfsiz va qulay.",
    "price": 5400000,
    "oldPrice": 6200000,
    "old_price": 6200000,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Gantellar & Shtangalar",
    "category_slug": "gantellar",
    "categorySlug": "gantellar",
    "subcategory": "Gantellar",
    "brand": "IronPower",
    "stock": 10,
    "inStock": true,
    "in_stock": true,
    "rating": 5.0,
    "reviews_count": 16,
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1000&auto=format&fit=crop&q=85"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "specifications": [
      { "label": "Qoplamasi", "value": "Yuqori zichlikdagi tabiiy kauchuk" },
      { "label": "Tutqich", "value": "Sirpanmaydigan riflyoniy xrom po‘lat" },
      { "label": "Vaznlar", "value": "2.5kg, 5kg, 7.5kg, 10kg, 12.5kg, 15kg, 20kg, 25kg" }
    ],
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "prod_sozlanuvchi-skameyka-db90",
    "id": "prod_sozlanuvchi-skameyka-db90",
    "title": "Sozlanuvchi Mashg‘ulot Skameykasi Bench Press DB-90",
    "slug": "sozlanuvchi-skameyka-db90",
    "sku": "0455805",
    "description": "7 xil orqa suyanchiq burchagiga (salbiy, tekis, tik) sozlanadigan qalin eko-charm yumshoq qoplamali sport skameykasi. 350 kg maksimal yuklama.",
    "price": 1450000,
    "oldPrice": 1700000,
    "old_price": 1700000,
    "discountPercent": 15,
    "discount_percent": 15,
    "category": "Podstavka & Skameykalar",
    "category_slug": "stoykalar",
    "categorySlug": "stoykalar",
    "subcategory": "Skameykalar",
    "brand": "Sport Line",
    "stock": 14,
    "inStock": true,
    "in_stock": true,
    "rating": 4.9,
    "reviews_count": 7,
    "images": [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=85"
    ],
    "is_bestseller": false,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "specifications": [
      { "label": "Burchaklar", "value": "-15°, 0°, 30°, 45°, 60°, 75°, 90°" },
      { "label": "Maksimal yuklama", "value": "350 kg" },
      { "label": "Konstruksiya", "value": "Mustahkam qora poroshok bo‘yoqli po‘lat" }
    ],
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "prod_gantel-podstavka-gorizontal-2layer",
    "id": "prod_gantel-podstavka-gorizontal-2layer",
    "title": "Gantel Podstavka SC80270 (2 Qavatli Gorizontal)",
    "slug": "gantel-podstavka-gorizontal-2layer",
    "sku": "0455808",
    "description": "10-12 juft gantellar sig‘adigan 2 qavatli og‘ir yukka mo‘ljallangan professional zal stoykasi. Kauchuk himoya prokladkalariga ega.",
    "price": 1400000,
    "oldPrice": 1650000,
    "old_price": 1650000,
    "discountPercent": 15,
    "discount_percent": 15,
    "category": "Podstavka & Skameykalar",
    "category_slug": "stoykalar",
    "categorySlug": "stoykalar",
    "subcategory": "Gantel Stoykalari",
    "brand": "Sport Line",
    "stock": 11,
    "inStock": true,
    "in_stock": true,
    "rating": 5.0,
    "reviews_count": 5,
    "images": [
      "https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?w=1000&auto=format&fit=crop&q=85"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": true,
    "specifications": [
      { "label": "Model", "value": "SC80270" },
      { "label": "Sig‘imi", "value": "10-12 juft og‘ir gantellar" },
      { "label": "Material", "value": "Qotishma po‘lat (Black coating)" }
    ],
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "prod_turnik-brus-press-3in1",
    "id": "prod_turnik-brus-press-3in1",
    "title": "Devorga O‘rnatiladigan 3-in-1 Turnik-Brus-Press",
    "slug": "turnik-brus-press-3in1",
    "sku": "0455806",
    "description": "Mustahkam po‘lat turnik, brus va qorin pressi uchun qulay tirsak yostiqchalariga ega universal uy trenajori. 200 kg ko‘tarish quvvati.",
    "price": 650000,
    "oldPrice": 780000,
    "old_price": 780000,
    "discountPercent": 17,
    "discount_percent": 17,
    "category": "Podstavka & Skameykalar",
    "category_slug": "stoykalar",
    "categorySlug": "stoykalar",
    "subcategory": "Turniklar",
    "brand": "Sport Line",
    "stock": 20,
    "inStock": true,
    "in_stock": true,
    "rating": 4.9,
    "reviews_count": 12,
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1000&auto=format&fit=crop&q=85"
    ],
    "is_bestseller": true,
    "is_new_arrival": false,
    "is_weekly_deal": false,
    "specifications": [
      { "label": "Funksiyalar", "value": "Turnik (keng va tor ushlash), Brus, Press" },
      { "label": "Maksimal vazn", "value": "200 kg" }
    ],
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "prod_olimpiyskiy-shtanga-grifi-20kg",
    "id": "prod_olimpiyskiy-shtanga-grifi-20kg",
    "title": "Olimpiyskiy Shtanga Grifi 20kg (220cm / 50mm)",
    "slug": "olimpiyskiy-shtanga-grifi-20kg",
    "sku": "0455807",
    "description": "4 ta podshipnikli professional xrom qoplamali olimpiada shtanga grifi. 450 kg maksimal yuklama.",
    "price": 1150000,
    "oldPrice": 1350000,
    "old_price": 1350000,
    "discountPercent": 15,
    "discount_percent": 15,
    "category": "Gantellar & Shtangalar",
    "category_slug": "gantellar",
    "categorySlug": "gantellar",
    "subcategory": "Shtangalar",
    "brand": "IronPower",
    "stock": 9,
    "inStock": true,
    "in_stock": true,
    "rating": 5.0,
    "reviews_count": 8,
    "images": [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&auto=format&fit=crop&q=85"
    ],
    "is_bestseller": false,
    "is_new_arrival": false,
    "is_weekly_deal": false,
    "specifications": [
      { "label": "Grif og‘irligi", "value": "20 kg" },
      { "label": "Uzunligi", "value": "220 sm" },
      { "label": "Vtulka diametri", "value": "50 mm (Olimpiyskiy disklar uchun)" }
    ],
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "prod_nike-air-zoom-pegasus-sport",
    "id": "prod_nike-air-zoom-pegasus-sport",
    "title": "Nike Air Zoom Pegasus 40 Professional Yugurish Krossovkasi",
    "slug": "nike-air-zoom-pegasus-sport",
    "sku": "0455809",
    "description": "React ko‘pik amortizatsiyasi, yengil nafas oluvchi setka mato va baquvvat protektor.",
    "price": 1250000,
    "oldPrice": 1450000,
    "old_price": 1450000,
    "discountPercent": 14,
    "discount_percent": 14,
    "category": "Krossovkalar & Poyabzal",
    "category_slug": "krossovkalar",
    "categorySlug": "krossovkalar",
    "subcategory": "Yugurish krossovkalari",
    "brand": "Nike",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5.0,
    "reviews_count": 22,
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=85"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "specifications": [
      { "label": "Brend", "value": "Nike Original" },
      { "label": "Mavsum", "value": "Barcha fasllar" },
      { "label": "Tavsiya", "value": "Zal, yugurish, marafon" }
    ],
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "prod_fitnes-rezinkalari-set-5",
    "id": "prod_fitnes-rezinkalari-set-5",
    "title": "Elastik Fitnes Rezinkalari To‘plami (5 xil yuklama)",
    "slug": "fitnes-rezinkalari-set-5",
    "sku": "0455810",
    "description": "100% tabiiy lateksdan tayyorlangan 5kg dan 25kg gacha qarshilik ko‘rsatuvchi fitnes espanderlari.",
    "price": 180000,
    "oldPrice": 230000,
    "old_price": 230000,
    "discountPercent": 22,
    "discount_percent": 22,
    "category": "Fitnes Aksessuarlari",
    "category_slug": "fitnes-aksessuarlari",
    "categorySlug": "fitnes-aksessuarlari",
    "subcategory": "Espanderlar",
    "brand": "Sport Line",
    "stock": 35,
    "inStock": true,
    "in_stock": true,
    "rating": 4.9,
    "reviews_count": 19,
    "images": [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=1000&auto=format&fit=crop&q=85"
    ],
    "is_bestseller": true,
    "is_new_arrival": false,
    "is_weekly_deal": false,
    "specifications": [
      { "label": "To‘plam", "value": "5 ta turli qarshilikdagi lenta + sumkasi" },
      { "label": "Material", "value": "100% tabiiy elastik lateks" }
    ],
    "created_at": "2026-11-21T12:00:00.000Z"
  },
  {
    "_id": "prod_termo-sport-kostyumi-under-armour",
    "id": "prod_termo-sport-kostyumi-under-armour",
    "title": "Erkaklar Termo Sport Kostyumi Under Armour Storm",
    "slug": "termo-sport-kostyumi-under-armour",
    "sku": "0455811",
    "description": "Nafas oluvchi namlik o‘tkazmaydigan ColdGear texnologiyasidagi mashg‘ulot sport kiyimi. Harakat erkinligi va elastik mato.",
    "price": 680000,
    "oldPrice": 820000,
    "old_price": 820000,
    "discountPercent": 17,
    "discount_percent": 17,
    "category": "Sport Kiyimlari",
    "category_slug": "sport-kiyimlari",
    "categorySlug": "sport-kiyimlari",
    "subcategory": "Sport Kostyumlari",
    "brand": "Under Armour",
    "stock": 18,
    "inStock": true,
    "in_stock": true,
    "rating": 4.9,
    "reviews_count": 14,
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=85"
    ],
    "is_bestseller": false,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "specifications": [
      { "label": "Brend", "value": "Under Armour" },
      { "label": "Material", "value": "Poliester + Elastan (Termo)" },
      { "label": "O‘lchamlar", "value": "S, M, L, XL, XXL" }
    ],
    "created_at": "2026-11-21T12:00:00.000Z"
  }
];

const defaultBanners = [
  {
    "_id": "ban_trenajorlar_hero",
    "id": "ban_trenajorlar_hero",
    "title": "Professional Trenajorlar va Fitnes Uskunalari",
    "subtitle": "Zal va uy uchun mo‘ljallangan eng sara trenajorlar: yugurish yo‘lakchalari, velotrenajorlar va ko‘p funksiyali kuch uskunalari.",
    "badge": "TRENAJORLAR & FITNES JIHOZLARI",
    "image": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1600&auto=format&fit=crop&q=85",
    "link": "/shop?category=trenajorlar",
    "type": "hero",
    "order": 1,
    "active": true
  },
  {
    "_id": "ban_gantellar_hero",
    "id": "ban_gantellar_hero",
    "title": "Gantellar, Shtangalar va Podstavkalar",
    "subtitle": "SC seriyali mustahkam gantel podstavkalari, professional disklar, xrom va kauchuk gantellar to‘plami.",
    "badge": "KUCH & BODIBILDING",
    "image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1600&auto=format&fit=crop&q=85",
    "link": "/shop?category=stoykalar",
    "type": "hero",
    "order": 2,
    "active": true
  }
];

const defaultCoupons = [
  {
    "_id": "coup_sport10",
    "id": "coup_sport10",
    "code": "SPORT10",
    "discountPercent": 10,
    "discount_percent": 10,
    "expiryDate": "2027-12-31T23:59:59.000Z",
    "active": true
  },
  {
    "_id": "coup_trenajor5",
    "id": "coup_trenajor5",
    "code": "TRENAJOR5",
    "discountPercent": 5,
    "discount_percent": 5,
    "expiryDate": "2027-12-31T23:59:59.000Z",
    "active": true
  }
];

const defaultReviews = [
  {
    "_id": "rev_1",
    "id": "rev_1",
    "productId": "prod_gantel-podstavka-sc80263",
    "product_id": "prod_gantel-podstavka-sc80263",
    "productTitle": "Gantel podstavka SC80263",
    "userName": "Jamshid Rahimov",
    "user_name": "Jamshid Rahimov",
    "rating": 5,
    "comment": "Gantel podstavka juda sifatli ekan, baquvvat po‘latdan yasalgan. 6 juft gantellarim ajoyib tartibda joylashdi. Buxoroga 2 soatda yetkazib berishdi!",
    "verifiedPurchase": true,
    "status": "approved",
    "createdAt": "2026-11-21T10:00:00.000Z"
  },
  {
    "_id": "rev_2",
    "id": "rev_2",
    "productId": "prod_yugurish-yolakchasi-proform-t800",
    "product_id": "prod_yugurish-yolakchasi-proform-t800",
    "productTitle": "Professional Yugurish Yo‘lakchasi ProForm T800",
    "userName": "Dilshod Olimov",
    "user_name": "Dilshod Olimov",
    "rating": 5,
    "comment": "Trenajor ajoyib, shovqinsiz va amortizatsiyasi zo‘r. Uy sharoitida mashq qilish uchun juda qulay.",
    "verifiedPurchase": true,
    "status": "approved",
    "createdAt": "2026-11-20T14:30:00.000Z"
  }
];

const defaultOrders = [];

const fileContent = `// Autogenerated pure Sport & Fitness / Gym / Trenajor database for SPORT OUTLET
// Completely free from legacy electronics, laptops, or office supplies.

export const defaultCategories = ${JSON.stringify(defaultCategories, null, 2)};

export const defaultProducts = ${JSON.stringify(defaultProducts, null, 2)};

export const defaultBanners = ${JSON.stringify(defaultBanners, null, 2)};

export const defaultCoupons = ${JSON.stringify(defaultCoupons, null, 2)};

export const defaultReviews = ${JSON.stringify(defaultReviews, null, 2)};

export const defaultOrders = ${JSON.stringify(defaultOrders, null, 2)};

/**
 * Intelligent LocalStorage sync:
 * - Purges old laptop/electronics cache
 * - Merges new products added via Telegram Bot or code dynamically
 */
export function getLocalCollection(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);

    // If cached collection contains obsolete laptops or electronics, purge it immediately
    if (key.includes('products') && Array.isArray(parsed)) {
      const hasOldLaptops = parsed.some(p => p.slug && (
        p.slug.includes('macbook') || 
        p.slug.includes('dell-optiplex') || 
        p.slug.includes('canon') ||
        p.slug.includes('apple') ||
        p.category === 'Kompyuter Texnikasi'
      ));
      if (hasOldLaptops) {
        console.log('⚡ Purging old electronics cache from localStorage in favor of Sport & Fitness items');
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }

      // Auto-merge any new items in fallback (e.g., added from Telegram bot or updates)
      const existingIds = new Set(parsed.map(p => p.id || p._id || p.slug));
      let hasNew = false;
      for (const item of fallback) {
        const id = item.id || item._id || item.slug;
        if (!existingIds.has(id)) {
          parsed.unshift(item);
          existingIds.add(id);
          hasNew = true;
        }
      }
      if (hasNew) {
        localStorage.setItem(key, JSON.stringify(parsed));
      }
      return parsed;
    }

    if (key.includes('categories') && Array.isArray(parsed)) {
      const hasOldCats = parsed.some(c => c.slug === 'apple' || c.slug === 'orgtehnika');
      if (hasOldCats) {
        console.log('⚡ Purging old categories cache from localStorage');
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
    }

    return parsed;
  } catch (e) {
    console.warn('LocalStorage access warning:', e);
    return fallback;
  }
}

export function saveLocalCollection(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}
`;

fs.writeFileSync(mockDataPath, fileContent, 'utf8');
console.log('Successfully written clean Sport & Fitness mockData.js!');
