const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'src', 'services', 'mockData.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Check if category exists
if (!content.includes('cat_sport-fitnes')) {
  const catMarker = 'export const defaultCategories = [';
  const catPos = content.indexOf(catMarker);
  if (catPos !== -1) {
    const insertPos = catPos + catMarker.length;
    const catJson = `
  {
    "_id": "cat_sport-fitnes",
    "id": "cat_sport-fitnes",
    "name": "Sport va Fitnes",
    "slug": "sport-fitnes",
    "icon": "Activity",
    "description": "Sport va fitnes anjomlari Buxoro bo'yicha kafolatli yetkazib berish",
    "image": "",
    "order": 9,
    "active": true,
    "created_at": "2026-11-21T12:00:00.000Z"
  },`;
    content = content.slice(0, insertPos) + catJson + content.slice(insertPos);
    console.log('Category cat_sport-fitnes inserted');
  }
}

// 2. Insert product at beginning of defaultProducts
if (!content.includes('prod_gantel-podstavka-sc80263')) {
  const prodMarker = 'export const defaultProducts = [';
  const prodPos = content.indexOf(prodMarker);
  if (prodPos !== -1) {
    const insertPos = prodPos + prodMarker.length;
    const newProd = {
      _id: 'prod_gantel-podstavka-sc80263',
      id: 'prod_gantel-podstavka-sc80263',
      title: 'Gantel podstavka SC80263',
      slug: 'gantel-podstavka-sc80263',
      sku: '0455763',
      description: "Gantel podstavka SC80263 (Kodi: 0455763, Narxi: 75$). Mustahkam po'lat konstruksiyaga ega professional gantel qo'yish stoykasi. A-shaklli qulay va ixcham dizayn, gantellarni tartibli saqlash uchun mo'ljallangan. Buxoro bo'yicha tezkor yetkazib berish.",
      price: 960000,
      oldPrice: 1100000,
      old_price: 1100000,
      discountPercent: 13,
      discount_percent: 13,
      category: 'Sport va Fitnes',
      category_slug: 'sport-fitnes',
      categorySlug: 'sport-fitnes',
      subcategory: 'Gantellar va Stoykalar',
      brand: 'Sport Line',
      stock: 15,
      inStock: true,
      in_stock: true,
      rating: 5.0,
      reviews_count: 6,
      images: ['/uploads/gantel-podstavka-sc80263.png'],
      is_bestseller: true,
      is_new_arrival: true,
      is_weekly_deal: true,
      specifications: [
        { label: 'Model', value: 'SC80263' },
        { label: 'Mahsulot kodi', value: '0455763' },
        { label: 'Narxi (USD)', value: '75$' },
        { label: 'Material', value: "Mustahkam qotishma po'lat (Black powder coating)" },
        { label: 'Shakl', value: 'A-Frame ixcham va xavfsiz dizayn' },
        { label: 'Sig\'imi', value: '6 juft gantellar uchun' },
        { label: 'Kafolat', value: '1 yil rasmiy kafolat' },
        { label: 'Yetkazib berish', value: "Buxoro bo'ylab bepul va tezkor" }
      ],
      created_at: new Date().toISOString()
    };
    const prodJson = '\n  ' + JSON.stringify(newProd, null, 2).replace(/\n/g, '\n  ') + ',';
    content = content.slice(0, insertPos) + prodJson + content.slice(insertPos);
    console.log('Product prod_gantel-podstavka-sc80263 inserted');
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('mockData.js successfully saved!');
