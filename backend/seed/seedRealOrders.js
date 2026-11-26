const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const MONGO_URI = 'mongodb://127.0.0.1:27017/miniapp_store';

async function seedRealOrders() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to miniapp_store DB');

  const products = await Product.find().limit(20);
  if (!products.length) {
    console.log('No products found');
    process.exit(1);
  }

  // Clear existing orders
  await Order.deleteMany({});

  const sampleClients = [
    { name: 'Bekzod Karimov', phone: '+998 90 123 45 67', city: 'Buxoro', address: 'Mustaqillik ko‘chasi, 24-uy', method: 'click', status: 'delivered', daysAgo: 5 },
    { name: 'Shahzod Aliyev', phone: '+998 91 445 11 22', city: 'Buxoro', address: 'Ibn Sino ko‘chasi, 12-uy', method: 'payme', status: 'processing', daysAgo: 1 },
    { name: 'Nodira Xoliqova', phone: '+998 93 333 88 99', city: 'Kogon', address: 'Navoiy shoh ko‘chasi, 8-dom', method: 'cash', status: 'new', daysAgo: 0 },
    { name: '«Buxoro Qurilish Servis» MCHJ', phone: '+998 97 700 20 20', city: 'Buxoro', address: 'Sanoat hududi, 5-bino', method: 'bank_transfer', status: 'delivered', daysAgo: 6 },
    { name: 'Jasur Temirov', phone: '+998 90 555 44 33', city: 'G‘ijduvon', address: 'Yusuf Hamadoniy ko‘chasi, 15', method: 'click', status: 'shipped', daysAgo: 2 },
    { name: 'Aziza Rahimova', phone: '+998 99 812 34 56', city: 'Buxoro', address: 'Bahouddin Naqshband, 45', method: 'payme', status: 'delivered', daysAgo: 4 },
    { name: '«Oasis Tech» IT Hub', phone: '+998 95 155 45 00', city: 'Buxoro', address: 'Universitet ko‘chasi, 1-bino', method: 'bank_transfer', status: 'delivered', daysAgo: 3 },
    { name: 'Farrux Saidov', phone: '+998 94 222 10 30', city: 'Vobkent', address: 'Markaziy ko‘cha, 7', method: 'cash', status: 'new', daysAgo: 0 },
    { name: 'Dilshod Normatov', phone: '+998 91 999 00 11', city: 'Qorako‘l', address: 'Buyuk Ipak Yo‘li, 29', method: 'click', status: 'processing', daysAgo: 1 },
    { name: '«Zarafshon Agro» XK', phone: '+998 93 456 78 90', city: 'Buxoro', address: 'Hamza ko‘chasi, 14', method: 'bank_transfer', status: 'delivered', daysAgo: 7 },
    { name: 'Malika Ergasheva', phone: '+998 90 888 77 66', city: 'Kogon', address: 'Temiryo‘lchilar ko‘chasi, 3', method: 'cash', status: 'cancelled', daysAgo: 3 },
    { name: 'Sherzod Po‘latov', phone: '+998 97 123 98 76', city: 'Buxoro', address: 'Abu Ali Ibn Sino 88', method: 'click', status: 'new', daysAgo: 0 },
  ];

  const ordersToInsert = [];

  sampleClients.forEach((client, idx) => {
    const p1 = products[idx % products.length];
    const p2 = products[(idx + 3) % products.length];
    const qty1 = (idx % 3) + 1;
    const qty2 = (idx % 2) + 1;
    const totalAmount = (p1.price * qty1) + (p2.price * qty2);

    const date = new Date();
    date.setDate(date.getDate() - client.daysAgo);
    date.setHours(10 + (idx % 10), 15 + (idx % 40));

    ordersToInsert.push({
      orderNumber: `NSB-100${240 + idx}`,
      customerDetails: {
        fullName: client.name,
        phone: client.phone,
        city: client.city,
        address: client.address,
        notes: client.method === 'bank_transfer' ? '12% QQS bilan shartnoma talab qilinadi' : 'Tezkor yetkazish'
      },
      items: [
        {
          product: p1._id,
          title: p1.title,
          price: p1.price,
          quantity: qty1,
          image: p1.images?.[0] || ''
        },
        {
          product: p2._id,
          title: p2.title,
          price: p2.price,
          quantity: qty2,
          image: p2.images?.[0] || ''
        }
      ],
      totalAmount,
      deliveryFee: totalAmount > 500000 ? 0 : 25000,
      paymentMethod: client.method,
      paymentStatus: client.status === 'delivered' ? 'paid' : (client.status === 'cancelled' ? 'failed' : 'pending'),
      orderStatus: client.status,
      deliveryType: 'standard',
      createdAt: date,
      updatedAt: date
    });
  });

  await Order.insertMany(ordersToInsert);
  console.log(`Successfully created ${ordersToInsert.length} rich orders in MongoDB!`);

  // Also make sure 3-4 products have low stock (< 8) for low-stock alerts
  await Product.updateOne({ _id: products[1]._id }, { stock: 3 });
  await Product.updateOne({ _id: products[3]._id }, { stock: 2 });
  await Product.updateOne({ _id: products[5]._id }, { stock: 4 });
  console.log('Updated low stock flags on products');

  process.exit(0);
}

seedRealOrders().catch(err => {
  console.error(err);
  process.exit(1);
});
