/**
 * TEXNOLUX — Telegram Product Bot & Mini App Launcher
 * Configure TELEGRAM_BOT_TOKEN and MINI_APP_URL in .env
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT_DIR = path.resolve(__dirname, '..');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
const UPLOADS_DIR = path.join(FRONTEND_DIR, 'public', 'uploads');
const DIST_DIR = path.join(FRONTEND_DIR, 'dist');
const DIST_UPLOADS_DIR = path.join(DIST_DIR, 'uploads');
const PUBLIC_DATA_PATH = path.join(FRONTEND_DIR, 'public', 'data', 'products.json');
const DIST_DATA_PATH = path.join(DIST_DIR, 'data', 'products.json');
const PUBLIC_CUSTOMERS_PATH = path.join(FRONTEND_DIR, 'public', 'data', 'customers.json');
const DIST_CUSTOMERS_PATH = path.join(DIST_DIR, 'data', 'customers.json');
const BOT_ORDERS_PATH = path.join(__dirname, 'bot_orders.json');
const PUBLIC_ORDERS_PATH = path.join(FRONTEND_DIR, 'public', 'data', 'orders.json');
const DIST_ORDERS_PATH = path.join(DIST_DIR, 'data', 'orders.json');
const BOT_NOTIFICATIONS_PATH = path.join(__dirname, 'bot_notifications.json');
const PUBLIC_NOTIFICATIONS_PATH = path.join(FRONTEND_DIR, 'public', 'data', 'notifications.json');
const DIST_NOTIFICATIONS_PATH = path.join(DIST_DIR, 'data', 'notifications.json');
const MOCK_DATA_PATH = path.join(FRONTEND_DIR, 'src', 'services', 'mockData.js');
const BOT_CONFIG_PATH = path.join(__dirname, 'bot_config.json');
const REQUIRED_CHANNEL = '@uuuilhxjdiieke';
const REQUIRED_CHANNEL_URL = 'https://t.me/uuuilhxjdiieke';

function readJsonArray(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return [];
}

function writeDualDataJson(botFilePath, publicFilePath, distFilePath, data) {
  try {
    const formatted = JSON.stringify(data, null, 2);
    if (botFilePath) fs.writeFileSync(botFilePath, formatted, 'utf8');
    fs.mkdirSync(path.dirname(publicFilePath), { recursive: true });
    fs.writeFileSync(publicFilePath, formatted, 'utf8');
    if (fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(path.dirname(distFilePath), { recursive: true });
      fs.writeFileSync(distFilePath, formatted, 'utf8');
    }
  } catch (err) {
    console.warn(`Could not sync ${path.basename(publicFilePath)}:`, err.message);
  }
}

function loadBotConfig() {
  try {
    if (fs.existsSync(BOT_CONFIG_PATH)) {
      const raw = fs.readFileSync(BOT_CONFIG_PATH, 'utf8').replace(/^\uFEFF/, '');
      const parsed = JSON.parse(raw);
      return { users: {}, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
    }
  } catch (_) {}
  return { users: {} };
}

function saveBotConfig(cfg) {
  try {
    fs.writeFileSync(BOT_CONFIG_PATH, JSON.stringify(cfg, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not save bot_config.json:', err.message);
  }
  syncCustomersToJson(cfg);
}

function syncCustomersToJson(cfg) {
  try {
    const customers = Object.values(cfg.users || {})
      .filter(u => u && String(u.chatId) !== 'usr_admin' && u.source !== 'admin' && (u.firstName || u.phone))
      .map(u => {
        const fullName = [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.username || 'Mijoz';
        return {
          _id: `tg_${u.chatId}`,
          id: `tg_${u.chatId}`,
          chatId: u.chatId,
          fullName,
          name: fullName,
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          phone: u.phone || '',
          username: u.username || '',
          avatar: u.customAvatar || u.telegramAvatar || u.avatar || '',
          city: u.username ? `@${u.username}` : 'Telegram Bot',
          address: u.username ? `Telegram: @${u.username}` : 'Telegram Bot orqali',
          ordersCount: 0,
          totalSpent: 0,
          status: u.subscribed ? 'Tasdiqlangan' : 'Ro‘yxatdan o‘tgan',
          subscribed: Boolean(u.subscribed),
          registeredAt: u.registeredAt ? String(u.registeredAt).slice(0, 10) : new Date().toISOString().slice(0, 10),
          source: 'telegram_bot'
        };
      });

    writeDualDataJson(null, PUBLIC_CUSTOMERS_PATH, DIST_CUSTOMERS_PATH, customers);
  } catch (err) {
    console.warn('Could not sync customers.json:', err.message);
  }
}

function getMiniAppUrlForUser(chatId, subPath = '') {
  if (!MINI_APP_URL.startsWith('https://')) return '';
  try {
    const u = new URL(MINI_APP_URL);
    if (subPath) {
      u.pathname = subPath.startsWith('/') ? subPath : `/${subPath}`;
    }
    if (chatId) u.searchParams.set('tg_id', String(chatId));
    return u.toString();
  } catch (_) {
    return MINI_APP_URL;
  }
}

// Load .env from project root if present
const ENV_PATH = path.join(ROOT_DIR, '.env');
if (fs.existsSync(ENV_PATH)) {
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
fs.mkdirSync(path.dirname(PUBLIC_DATA_PATH), { recursive: true });

// Supabase client initialization (optional, configured via environment variables)
let supabase = null;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    const { createClient } = require(path.join(FRONTEND_DIR, 'node_modules', '@supabase/supabase-js'));
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (e) {
    console.warn('Supabase client module loading warning:', e.message);
  }
}

// Helper lookup & notifications utilities
const ORDER_STATUS_META = {
  new: {
    emoji: '🛍',
    label: 'Buyurtma qabul qilindi',
    message: 'Buyurtmangiz qabul qilindi! Tez orada operatorimiz bog‘lanadi.'
  },
  processing: {
    emoji: '📦',
    label: 'Tayyorlanmoqda',
    message: 'Buyurtmangiz tasdiqlandi va omborda jo‘natishga tayyorlanmoqda.'
  },
  shipped: {
    emoji: '🚚',
    label: 'Yo‘lga chiqdi',
    message: 'Kuryer buyurtmangizni olib yo‘lga chiqdi! Tez orada yetkazib beriladi.'
  },
  delivered: {
    emoji: '✅',
    label: 'Yetkazib berildi',
    message: 'Buyurtmangiz muvaffaqiyatli yetkazib berildi! Xaridingiz uchun rahmat — endi profilingizda sharh qoldirishingiz mumkin.'
  },
  cancelled: {
    emoji: '❌',
    label: 'Bekor qilindi',
    message: 'Buyurtmangiz bekor qilindi. Qo‘shimcha ma’lumot uchun administratorga murojaat qiling.'
  }
};

function normalizeShortPhone(p) {
  return String(p || '').replace(/\D/g, '').slice(-9);
}

function findCustomerRecord({ chatId, phone }, cfg) {
  const users = Object.values(cfg.users || {});
  if (chatId) {
    const byId = cfg.users?.[String(chatId)] || users.find((u) => String(u.chatId) === String(chatId));
    if (byId) return byId;
  }
  const targetPhone = normalizeShortPhone(phone);
  if (targetPhone && targetPhone.length >= 7) {
    return users.find((u) => normalizeShortPhone(u.phone) === targetPhone) || null;
  }
  return null;
}

function saveAvatarBuffer(relFileName, buffer) {
  const localDest = path.join(UPLOADS_DIR, relFileName);
  fs.mkdirSync(path.dirname(localDest), { recursive: true });
  fs.writeFileSync(localDest, buffer);
  if (fs.existsSync(DIST_DIR)) {
    const distDest = path.join(DIST_UPLOADS_DIR, relFileName);
    fs.mkdirSync(path.dirname(distDest), { recursive: true });
    fs.writeFileSync(distDest, buffer);
  }
  return `/uploads/${relFileName.replace(/\\/g, '/')}`;
}

function appendNotificationRecord(entry) {
  const list = readJsonArray(BOT_NOTIFICATIONS_PATH);
  const item = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    read: false,
    createdAt: new Date().toISOString(),
    ...entry
  };
  list.unshift(item);
  const trimmed = list.slice(0, 250);
  writeDualDataJson(BOT_NOTIFICATIONS_PATH, PUBLIC_NOTIFICATIONS_PATH, DIST_NOTIFICATIONS_PATH, trimmed);
  return item;
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 8 * 1024 * 1024) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

async function sendOrderTelegramAlert(chatId, htmlText) {
  if (!chatId) return false;
  const accountUrl = getMiniAppUrlForUser(chatId, '/account');
  const payload = {
    chat_id: Number(chatId) || chatId,
    parse_mode: 'HTML',
    text: htmlText
  };
  if (accountUrl) {
    payload.reply_markup = {
      inline_keyboard: [[
        { text: '📋 Buyurtmalar va eslatmalar', web_app: { url: accountUrl } }
      ]]
    };
  }
  const r = await sendTelegram('sendMessage', payload);
  return Boolean(r?.ok);
}

// Health-check & Bot Sync HTTP listener (gracefully handles busy ports)
const PORT = Number(process.env.PORT || 5001);
const healthServer = http.createServer(async (req, res) => {
  const urlPath = (req.url || '/').split('?')[0];

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  try {
    if (urlPath === '/bot-api/health') {
      return sendJson(res, 200, { ok: true, service: 'texnolux-bot' });
    }

    if (urlPath === '/bot-api/customer/avatar' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const cfg = loadBotConfig();
      if (!cfg.users) cfg.users = {};

      let rec = findCustomerRecord({ chatId: body.chatId, phone: body.phone }, cfg);
      const key = rec ? String(rec.chatId) : String(body.chatId || body.userId || '').replace(/^tg_/, '');
      if (!key) {
        return sendJson(res, 400, { success: false, message: 'chatId or phone required' });
      }
      if (!rec) {
        rec = {
          chatId: Number(key) || key,
          userId: Number(key) || key,
          firstName: body.name ? String(body.name).split(' ')[0] : 'Mijoz',
          lastName: body.name ? String(body.name).split(' ').slice(1).join(' ') : '',
          phone: body.phone || '',
          username: body.username || '',
          step: 'completed',
          subscribed: true
        };
      }

      if (body.remove || !body.avatar) {
        rec.customAvatar = '';
        rec.avatar = rec.telegramAvatar || '';
      } else {
        const str = String(body.avatar);
        const match = str.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (match) {
          const ext = match[1] === 'png' ? 'png' : 'jpg';
          const buffer = Buffer.from(match[2], 'base64');
          const safeKey = String(key).replace(/[^a-zA-Z0-9_-]/g, '_');
          const relPath = `avatars/custom_${safeKey}_${Date.now()}.${ext}`;
          rec.customAvatar = saveAvatarBuffer(relPath, buffer);
          rec.avatar = rec.customAvatar;
        } else {
          rec.customAvatar = str;
          rec.avatar = str;
        }
      }

      cfg.users[String(rec.chatId)] = rec;
      saveBotConfig(cfg);
      return sendJson(res, 200, { success: true, avatar: rec.avatar || '' });
    }

    if (urlPath === '/bot-api/orders' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const order = body.order || body;
      if (!order || (!order.id && !order.orderNumber)) {
        return sendJson(res, 400, { success: false, message: 'Invalid order payload' });
      }

      const cfg = loadBotConfig();
      const matchedUser = findCustomerRecord({
        chatId: order.chatId || body.chatId,
        phone: order.customerDetails?.phone || order.customer_phone
      }, cfg);
      const chatId = order.chatId || body.chatId || matchedUser?.chatId || null;
      const phone = order.customerDetails?.phone || order.customer_phone || matchedUser?.phone || '';

      const savedOrder = { ...order, ...(chatId ? { chatId } : {}) };
      const orders = readJsonArray(BOT_ORDERS_PATH);
      const idx = orders.findIndex(
        (o) => (o.id && o.id === savedOrder.id) || (o.orderNumber && o.orderNumber === savedOrder.orderNumber)
      );
      if (idx !== -1) orders[idx] = { ...orders[idx], ...savedOrder };
      else orders.unshift(savedOrder);
      writeDualDataJson(BOT_ORDERS_PATH, PUBLIC_ORDERS_PATH, DIST_ORDERS_PATH, orders.slice(0, 300));

      const statusInfo = ORDER_STATUS_META.new;
      const totalFormatted = new Intl.NumberFormat('ru-RU').format(Number(savedOrder.totalAmount || savedOrder.total_amount || 0));
      const itemLines = Array.isArray(savedOrder.items)
        ? savedOrder.items.slice(0, 5).map((it) => `• ${it.title} × ${it.quantity}`).join('\n')
        : '';

      appendNotificationRecord({
        chatId: chatId || null,
        phone,
        orderId: savedOrder.id || savedOrder._id,
        orderNumber: savedOrder.orderNumber || savedOrder.order_number,
        type: 'order_created',
        status: 'new',
        title: `${statusInfo.emoji} ${statusInfo.label}: ${savedOrder.orderNumber || ''}`.trim(),
        message: `${statusInfo.message} Jami: ${totalFormatted} so‘m.`
      });

      let telegramNotified = false;
      if (chatId) {
        const addressText = [savedOrder.customerDetails?.city, savedOrder.customerDetails?.address]
          .filter(Boolean)
          .join(', ');
        const text =
          `${statusInfo.emoji} <b>Buyurtmangiz qabul qilindi!</b>\n\n` +
          `🆔 <b>Buyurtma №:</b> <code>${savedOrder.orderNumber}</code>\n` +
          (itemLines ? `📦 <b>Mahsulotlar:</b>\n${itemLines}\n` : '') +
          `💰 <b>Jami summa:</b> ${totalFormatted} so‘m\n` +
          (addressText ? `📍 <b>Manzil:</b> ${addressText}\n` : '') +
          `\nHolat o‘zgarishlari va eslatmalar ushbu bot va Mini App profilingizga yuboriladi.`;
        telegramNotified = await sendOrderTelegramAlert(chatId, text);
      }

      return sendJson(res, 200, { success: true, order: savedOrder, telegramNotified });
    }

    if (urlPath === '/bot-api/orders/status' && (req.method === 'POST' || req.method === 'PUT')) {
      const body = await parseJsonBody(req);
      const { orderId, newStatus } = body;
      if (!orderId || !newStatus) {
        return sendJson(res, 400, { success: false, message: 'orderId and newStatus required' });
      }

      const cfg = loadBotConfig();
      const orders = readJsonArray(BOT_ORDERS_PATH);
      const idx = orders.findIndex(
        (o) => o.id === orderId || o._id === orderId || o.orderNumber === orderId
      );

      let order = idx !== -1 ? orders[idx] : null;
      if (order) {
        order.orderStatus = newStatus;
        order.order_status = newStatus;
        order.updatedAt = new Date().toISOString();
        orders[idx] = order;
        writeDualDataJson(BOT_ORDERS_PATH, PUBLIC_ORDERS_PATH, DIST_ORDERS_PATH, orders);
      }

      const phone = body.phone || order?.customerDetails?.phone || order?.customer_phone || '';
      const matchedUser = findCustomerRecord({ chatId: body.chatId || order?.chatId, phone }, cfg);
      const chatId = body.chatId || order?.chatId || matchedUser?.chatId || null;
      const orderNum = body.orderNumber || order?.orderNumber || orderId;
      const meta = ORDER_STATUS_META[newStatus] || {
        emoji: '🔔',
        label: `Holat: ${newStatus}`,
        message: 'Buyurtmangiz holati yangilandi.'
      };

      appendNotificationRecord({
        chatId: chatId || null,
        phone,
        orderId: order?.id || orderId,
        orderNumber: orderNum,
        type: 'order_status',
        status: newStatus,
        title: `${meta.emoji} ${orderNum} — ${meta.label}`,
        message: meta.message
      });

      if (newStatus === 'delivered' && Array.isArray(order?.items) && order.items.length > 0) {
        const firstItem = order.items[0];
        appendNotificationRecord({
          chatId: chatId || null,
          phone,
          orderId: order?.id || orderId,
          orderNumber: orderNum,
          productId: firstItem.product || firstItem.productId || firstItem.id || firstItem._id,
          productTitle: firstItem.title,
          productImage: firstItem.image || '',
          productPrice: firstItem.price || 0,
          type: 'review_reminder',
          status: 'delivered',
          title: `⭐ ${firstItem.title} haqida fikr qoldiring`,
          message: `Siz xarid qilgan «${firstItem.title}» yetkazib berildi. Taassurotingiz bilan o‘rtoqlashing!`
        });
      }

      let telegramNotified = false;
      if (chatId) {
        const text =
          `${meta.emoji} <b>Buyurtma holati yangilandi!</b>\n\n` +
          `🆔 <b>Buyurtma №:</b> <code>${orderNum}</code>\n` +
          `📌 <b>Yangi holat:</b> ${meta.label}\n\n` +
          `${meta.message}`;
        telegramNotified = await sendOrderTelegramAlert(chatId, text);
      }

      return sendJson(res, 200, { success: true, telegramNotified });
    }

    if (urlPath === '/bot-api/notifications/read' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const list = readJsonArray(BOT_NOTIFICATIONS_PATH);
      const targetPhone = normalizeShortPhone(body.phone);
      let changed = false;

      const updated = list.map((n) => {
        if (body.notificationId && n.id === body.notificationId) {
          changed = true;
          return { ...n, read: true };
        }
        if (body.markAll) {
          const matchesChat = body.chatId && String(n.chatId) === String(body.chatId);
          const matchesPhone = targetPhone && normalizeShortPhone(n.phone) === targetPhone;
          if (matchesChat || matchesPhone || (!body.chatId && !targetPhone)) {
            changed = true;
            return { ...n, read: true };
          }
        }
        return n;
      });

      if (changed) {
        writeDualDataJson(BOT_NOTIFICATIONS_PATH, PUBLIC_NOTIFICATIONS_PATH, DIST_NOTIFICATIONS_PATH, updated);
      }
      return sendJson(res, 200, { success: true });
    }
  } catch (err) {
    console.error('Bot HTTP API error:', err.message);
    return sendJson(res, 500, { success: false, message: err.message });
  }

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('TEXNOLUX Telegram Bot is running!\n');
});
healthServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`Port ${PORT} is busy, continuing bot polling without health-check HTTP listener.`);
  } else {
    console.warn('Health-check server warning:', err.message);
  }
});

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || '';
const MINI_APP_URL = (process.env.MINI_APP_URL || '').trim();
if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set. Please set TELEGRAM_BOT_TOKEN in .env');
  process.exit(1);
}
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const TELEGRAM_FILE_API = `https://api.telegram.org/file/bot${BOT_TOKEN}`;

const USD_RATE = Number(process.env.USD_RATE || 12850);

// TEXNOLUX HOME APPLIANCE CATEGORIES
const CATEGORIES = [
  {
    slug: 'kir-yuvish-mashinalari',
    name: 'Kir Yuvish Mashinalari',
    department: 'maishiy-texnika',
    departmentName: 'Maishiy Texnika',
    icon: 'Sparkles',
    keywords: [
      'kir yuv', 'stiral', 'стирал', 'avtomat', 'poluavtomat', 'yarim avtomat',
      'washing', 'baraban', 'oborot', 'dd inverter'
    ]
  },
  {
    slug: 'muzlatgichlar',
    name: 'Muzlatgichlar & Morozilniklar',
    department: 'maishiy-texnika',
    departmentName: 'Maishiy Texnika',
    icon: 'Snowflake',
    keywords: [
      'muzlat', 'xolodil', 'holodil', 'холодил', 'morozil', 'морозил',
      'no frost', 'nofrost', 'defrost', 'vitrina', 'kuler', 'cooler', 'fridge', 'freezer'
    ]
  },
  {
    slug: 'televizorlar',
    name: 'Televizorlar & Audio',
    department: 'elektronika',
    departmentName: 'Elektronika & TV',
    icon: 'Tv',
    keywords: [
      'televizor', 'телевизор', 'smart tv', 'android tv', 'google tv', 'webos',
      'qled', 'oled', 'uhd', '4k', 'dyum', 'дюйм', 'kalonka', 'kolonka', 'soundbar', 'саундбар'
    ]
  },
  {
    slug: 'konditsionerlar',
    name: 'Konditsionerlar & Iqlim',
    department: 'iqlim-texnikasi',
    departmentName: 'Iqlim Texnikasi',
    icon: 'Wind',
    keywords: [
      'konditsioner', 'кондиционер', 'split', 'сплит', 'btu', 'qish-yoz', 'зима-лето',
      'isitgich', 'obogrevatel', 'обогреватель', 'ventilyator', 'вентилятор', 'boyler', 'бойлер', 'ariston'
    ]
  },
  {
    slug: 'oshxona-texnikasi',
    name: 'Oshxona Texnikasi',
    department: 'oshxona',
    departmentName: 'Oshxona Texnikasi',
    icon: 'Flame',
    keywords: [
      'gaz plita', 'plita', 'плита', 'duxovka', 'духовка', 'pech', 'печь', 'mikro', 'svch', 'свч',
      'vityajka', 'вытяжка', 'posudomoy', 'idish yuv', 'посудомоеч', 'blender', 'блендер',
      'mikser', 'миксер', 'choynak', 'чайник', 'termopot', 'термопот', 'myasorubka', 'мясорубка',
      'qiymalagich', 'kofe', 'кофе', 'multivarka', 'toster', 'sokovijimalka', 'gril', 'aerogril'
    ]
  },
  {
    slug: 'uy-tozalash',
    name: 'Changyutgich & Dazmollar',
    department: 'uy-texnikasi',
    departmentName: 'Uy Texnikasi',
    icon: 'Zap',
    keywords: [
      'changyutgich', 'pilesos', 'pylesos', 'пылесос', 'robot', 'dazmol', 'utyug', 'утюг',
      'parogenerator', 'парогенератор', 'otparivatel', 'tikuv', 'швейн'
    ]
  },
  {
    slug: 'boshqa-texnika',
    name: 'Boshqa Texnika',
    department: 'maishiy-texnika',
    departmentName: 'Maishiy Texnika',
    icon: 'Layers',
    keywords: []
  }
];

const KNOWN_BRANDS = [
  'Rulls', 'Artel', 'Shivaki', 'Premier', 'Avalon', 'LG', 'Samsung', 'Beko', 'Bosch',
  'TCL', 'Midea', 'Haier', 'Hisense', 'Hoffmann', 'Immer', 'Roison', 'Ziffler', 'Moonx',
  'Gree', 'Aux', 'Sitronic', 'Loretto', 'Tefal', 'Philips', 'Dyson', 'Xiaomi', 'Toshiba',
  'Indesit', 'Atlant', 'Goodwell', 'Vitek', 'Braun', 'Vestel', 'Electrolux', 'Whirlpool',
  'Candy', 'Gorenje', 'Ferroli', 'Jasco', 'Volcano', 'Snaige', 'Hansa', 'Korting', 'Gefest',
  'Ariston', 'Ballu', 'Baxi', 'Chigo', 'Daikin', 'Karcher', 'Polaris', 'Scarlett', 'Redmond',
  'Maxwell', 'Sony', 'Panasonic', 'Sharp', 'Hitachi', 'Ferono', 'Biolux', 'Skyworth', 'Yandex'
];

function stripPhoneNumbers(text = '') {
  return String(text)
    // +998 99 089 96 94 / 998990899694
    .replace(/\+?998[\s\-()]*(?:\d[\s\-()]*){9}/g, ' ')
    // 99-089-96-94 / 99 089 96 94 / 990899694
    .replace(/\b(?:33|50|55|71|77|88|90|91|93|94|95|97|98|99)[\s\-()]?\d{3}[\s\-()]?\d{2}[\s\-()]?\d{2}\b/g, ' ')
    .replace(/\b\d{9,12}\b/g, ' ');
}

function detectBrand(text = '') {
  const lower = text.toLowerCase();
  for (const b of KNOWN_BRANDS) {
    const escaped = b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(lower)) {
      return b;
    }
  }
  const firstWordMatch = text.trim().match(/^([A-Z][A-Za-z0-9-]{2,15})\b/);
  if (firstWordMatch && !/^(Kg|Litr|Smart|Inverter|Avtomat|Narx|Price)$/i.test(firstWordMatch[1])) {
    return firstWordMatch[1];
  }
  return 'TEXNOLUX';
}

function detectCategory(text = '') {
  const lower = text.toLowerCase();
  for (const cat of CATEGORIES) {
    for (const kw of cat.keywords) {
      if (lower.includes(kw)) {
        return cat;
      }
    }
  }

  // Heuristic appliance inference from units & specs
  if (/\b\d+(?:[.,]\d+)?\s*(?:kg|кг)\b/i.test(lower)) {
    return CATEGORIES.find(c => c.slug === 'kir-yuvish-mashinalari');
  }
  if (/\b(?:24|32|40|42|43|50|55|58|65|70|75|85|98)\s*(?:"|''|dyum|дюйм|tv)\b/i.test(lower) || /\btv\b/i.test(lower)) {
    return CATEGORIES.find(c => c.slug === 'televizorlar');
  }
  if (/\b(?:07|09|12|18|24|30|36)\s*(?:btu|invert|inverter)?\b/i.test(lower) && /(?:gree|aux|chigo|midea|sitronic|inverter|invertor|btu)/i.test(lower)) {
    return CATEGORIES.find(c => c.slug === 'konditsionerlar');
  }
  if (/\b\d{2,3}\s*(?:l|litr|л)\b/i.test(lower)) {
    return CATEGORIES.find(c => c.slug === 'muzlatgichlar');
  }

  return CATEGORIES.find(c => c.slug === 'boshqa-texnika');
}

/**
 * Extracts price and clean title from caption, ignoring Uzbek phone numbers and unit specs
 */
function extractPriceAndTitle(caption = '') {
  const cleanedRaw = stripPhoneNumbers(caption || '');
  const rawLines = cleanedRaw.split('\n').map(l => l.trim()).filter(Boolean);

  let price = 0;
  let priceUSD = 0;
  let rawPriceLabel = '';
  let priceSubstr = '';

  // 1. Dollar prices ($275, 275$, 275 USD)
  for (const line of rawLines) {
    const dollarMatch = line.match(/(?:\$)\s*(\d+(?:[.,]\d+)?)/i) ||
                        line.match(/(\d+(?:[.,]\d+)?)\s*(?:\$|usd|долл)/i);
    if (dollarMatch) {
      const num = parseFloat(dollarMatch[1].replace(',', '.'));
      if (num > 0) {
        priceUSD = num;
        price = Math.round(num * USD_RATE);
        rawPriceLabel = `$${num} (${new Intl.NumberFormat('uz-UZ').format(price)} so'm)`;
        priceSubstr = dollarMatch[0];
        break;
      }
    }
  }

  // 2. UZS prices with currency word (3 500 000 so'm, 3.5 mln, 350 ming)
  if (!price) {
    for (const line of rawLines) {
      const mlnMatch = line.match(/(\d+(?:[.,]\d+)?)\s*(?:mln|million|млн)\b/i);
      if (mlnMatch) {
        const num = parseFloat(mlnMatch[1].replace(',', '.'));
        if (num > 0) {
          price = Math.round(num * 1000000);
          rawPriceLabel = `${new Intl.NumberFormat('uz-UZ').format(price)} so'm`;
          priceSubstr = mlnMatch[0];
          break;
        }
      }
      const somMatch = line.match(/\b(\d{1,3}(?:[\s.,]\d{3})+|\d{4,9})\s*(?:so'?m|sōm|sum|ming|uzs|сум)\b/i);
      if (somMatch) {
        let digits = somMatch[1].replace(/[^\d]/g, '');
        if (/ming/i.test(somMatch[0])) {
          digits = digits + '000';
        }
        if (digits.length >= 4) {
          price = parseInt(digits, 10);
          rawPriceLabel = `${new Intl.NumberFormat('uz-UZ').format(price)} so'm`;
          priceSubstr = somMatch[0];
          break;
        }
      }
    }
  }

  // 3. Standalone 5-8 digit UZS number (not followed by unit like kg/l/w/sm/mm)
  if (!price) {
    for (const line of rawLines) {
      const matches = [...line.matchAll(/(?<![a-zA-Z*xX\d])(\d{5,8})(?![a-zA-Z*xX\d])/g)];
      for (const m of matches) {
        const after = line.slice(m.index + m[0].length).trim().toLowerCase();
        if (/^(?:kg|кг|l|litr|л|w|vt|вт|sm|mm|btu|mah)/i.test(after)) continue;
        const val = parseInt(m[1], 10);
        if (val >= 10000) {
          price = val;
          rawPriceLabel = `${new Intl.NumberFormat('uz-UZ').format(price)} so'm`;
          priceSubstr = m[0];
          break;
        }
      }
      if (price) break;
    }
  }

  let titleText = cleanedRaw;
  if (priceSubstr) {
    titleText = titleText.replace(priceSubstr, ' ');
  }

  titleText = titleText
    .replace(/\b(?:narxi?|baho[si]?|price|цена|tel|telefon|aloqa|murojaat)\b\s*[:=-]?/gi, ' ')
    .replace(/^[:=\-–—\s*]+|[:=\-–—\s*]+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const lines = titleText.split('\n').map(l => l.trim()).filter(Boolean);
  let title = lines[0] || '';
  title = title.replace(/^(?:nomi|mahsulot|tovar|title|наименование)\s*[:=-]\s*/i, '').trim();

  return {
    title,
    price,
    priceUSD,
    rawPriceLabel,
    priceSubstr
  };
}

/**
 * Smart Appliance Knowledge Enricher: automatically creates clean Uzbek titles, categories & specs
 */
function enrichWithKnowledge(cleanTitle = '', rawText = '') {
  const lower = (rawText || '').toLowerCase();
  const brand = detectBrand(cleanTitle || rawText);
  const category = detectCategory(`${cleanTitle} ${rawText}`);

  const brandPrefix = brand && brand !== 'TEXNOLUX' ? `${brand} ` : '';
  const hasBrandInTitle = brand && cleanTitle.toLowerCase().includes(brand.toLowerCase());
  const baseText = (cleanTitle || '').trim();

  // 1. Kir yuvish mashinalari
  if (category.slug === 'kir-yuvish-mashinalari') {
    const kgMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|кг)/i);
    const kgLabel = kgMatch ? `${kgMatch[1].replace(',', '.')} kg` : '';
    const isSemi = /poluavtomat|yarim\s*avtomat|полуавтомат/i.test(lower);
    const isInverter = /invert|инверт|dd\b/i.test(lower);
    const typeLabel = isSemi ? 'Yarim Avtomat Kir Yuvish Mashinasi' : 'Avtomat Kir Yuvish Mashinasi';

    let finalTitle = baseText;
    if (!/kir\s*yuvish|stiral|стирал|mashina/i.test(lower)) {
      const parts = [
        hasBrandInTitle ? '' : brandPrefix.trim(),
        baseText || kgLabel,
        isInverter && !/invert/i.test(baseText) ? 'Inverter' : '',
        typeLabel
      ].filter(Boolean);
      finalTitle = parts.join(' ').replace(/\s{2,}/g, ' ').trim();
    }

    const specs = [
      { label: 'Brend', value: brand },
      ...(kgLabel ? [{ label: 'Yuklama hajmi', value: kgLabel }] : []),
      { label: 'Turi', value: isSemi ? 'Yarim avtomat' : 'To‘liq avtomat' },
      ...(isInverter ? [{ label: 'Dvigatel', value: 'Inverter (tejamkor va jim)' }] : []),
      { label: 'Kafolat', value: '1 yil rasmiy kafolat' }
    ];

    return {
      title: finalTitle,
      categorySlug: 'kir-yuvish-mashinalari',
      brand,
      description: `${finalTitle} — zamonaviy va tejamkor kir yuvish texnikasi. Kiyimlarni ehtiyotkorlik bilan toza yuvadi, suv va elektr energiyasini tejaydi.`,
      specifications: specs
    };
  }

  // 2. Muzlatgichlar & Morozilniklar
  if (category.slug === 'muzlatgichlar') {
    const literMatch = lower.match(/(\d{2,3})\s*(?:l|litr|л)\b/i);
    const literLabel = literMatch ? `${literMatch[1]} L` : '';
    const isFreezer = /morozil|морозил|freezer/i.test(lower);
    const isCooler = /kuler|cooler/i.test(lower);
    const isNoFrost = /no\s*frost|nofrost/i.test(lower);
    const hasNoFrostInBase = /no\s*frost|nofrost/i.test(baseText);
    const typeName = isCooler
      ? 'Suv Kuleri'
      : isFreezer
      ? 'Morozilnik'
      : isNoFrost && !hasNoFrostInBase
      ? 'No Frost Muzlatgich'
      : 'Muzlatgich';

    let finalTitle = baseText;
    if (!/muzlat|xolodil|holodil|morozil|kuler|холодил|морозил/i.test(lower)) {
      finalTitle = [hasBrandInTitle ? '' : brandPrefix.trim(), baseText || literLabel, typeName]
        .filter(Boolean).join(' ').replace(/\s{2,}/g, ' ').trim();
    }

    return {
      title: finalTitle,
      categorySlug: 'muzlatgichlar',
      brand,
      description: `${finalTitle} — mahsulotlarni uzoq vaqt yangi saqlovchi ishonchli va tejamkor sovutish texnikasi.`,
      specifications: [
        { label: 'Brend', value: brand },
        ...(literLabel ? [{ label: 'Hajmi', value: literLabel }] : []),
        { label: 'Sovutish tizimi', value: isNoFrost ? 'No Frost' : 'Standart / Zamonaviy' },
        { label: 'Kafolat', value: '1 yil rasmiy kafolat' }
      ]
    };
  }

  // 3. Televizorlar & Audio
  if (category.slug === 'televizorlar') {
    const sizeMatch = lower.match(/\b(24|32|40|42|43|50|55|58|65|70|75|85|98)\b/);
    const sizeLabel = sizeMatch ? `${sizeMatch[1]}"` : '';
    const isSpeaker = /kalonka|kolonka|soundbar|саундбар/i.test(lower);
    const isSmart = /smart|android|google|webos|4k|uhd|qled|oled/i.test(lower);
    const hasSmartTvInBase = /smart\s*tv/i.test(baseText);
    const typeName = isSpeaker
      ? 'Audio Tizim'
      : isSmart && !hasSmartTvInBase
      ? 'Smart TV Televizori'
      : 'Televizori';

    let finalTitle = baseText;
    if (!/televizor|телевизор|kalonka|kolonka|soundbar/i.test(lower)) {
      finalTitle = [hasBrandInTitle ? '' : brandPrefix.trim(), baseText || sizeLabel, typeName]
        .filter(Boolean).join(' ').replace(/\s{2,}/g, ' ').trim();
    }

    return {
      title: finalTitle,
      categorySlug: 'televizorlar',
      brand,
      description: `${finalTitle} — yorqin tasvir, tiniq ovoz va qulay boshqaruvga ega zamonaviy elektronika.`,
      specifications: [
        { label: 'Brend', value: brand },
        ...(sizeLabel ? [{ label: 'Ekran diagonali', value: `${sizeMatch[1]} dyum` }] : []),
        { label: 'Turi', value: isSpeaker ? 'Audio tizim' : (isSmart ? 'Smart TV' : 'LED TV') },
        { label: 'Kafolat', value: '1 yil rasmiy kafolat' }
      ]
    };
  }

  // 4. Konditsionerlar & Iqlim
  if (category.slug === 'konditsionerlar') {
    const btuMatch = lower.match(/\b(07|09|12|18|24|30|36)\b/);
    const btuLabel = btuMatch ? `${btuMatch[1]} BTU` : '';
    const isHeater = /isitgich|obogrevatel|обогреватель/i.test(lower);
    const isBoiler = /boyler|бойлер|ariston/i.test(lower);
    const isInverter = /invert|инверт/i.test(lower);
    const hasInverterInBase = /invert|инверт/i.test(baseText);
    const typeName = isBoiler
      ? 'Suv Isitgich Boyleri'
      : isHeater
      ? 'Elektr Isitgich'
      : isInverter && !hasInverterInBase
      ? 'Inverter Konditsioner'
      : 'Konditsioner';

    let finalTitle = baseText;
    if (!/konditsioner|кондиционер|isitgich|boyler|бойлер/i.test(lower)) {
      finalTitle = [hasBrandInTitle ? '' : brandPrefix.trim(), baseText || btuLabel, typeName]
        .filter(Boolean).join(' ').replace(/\s{2,}/g, ' ').trim();
    }

    return {
      title: finalTitle,
      categorySlug: 'konditsionerlar',
      brand,
      description: `${finalTitle} — qishda issiq, yozda salqin muhit yaratuvchi ishonchli va tejamkor iqlim texnikasi.`,
      specifications: [
        { label: 'Brend', value: brand },
        ...(btuLabel && !isHeater && !isBoiler ? [{ label: 'Quvvat (BTU)', value: btuLabel }] : []),
        { label: 'Kompressor', value: isInverter ? 'Inverter' : 'Standart' },
        { label: 'Kafolat', value: '1 yil rasmiy kafolat' }
      ]
    };
  }

  // 5. Oshxona Texnikasi
  if (category.slug === 'oshxona-texnikasi') {
    let finalTitle = baseText || `${brandPrefix}Oshxona Texnikasi`;
    if (!hasBrandInTitle && brandPrefix) {
      finalTitle = `${brandPrefix}${finalTitle}`.trim();
    }
    return {
      title: finalTitle,
      categorySlug: 'oshxona-texnikasi',
      brand,
      description: `${finalTitle} — oshxonangiz uchun qulay, mustahkam va zamonaviy maishiy texnika.`,
      specifications: [
        { label: 'Brend', value: brand },
        { label: 'Toifa', value: 'Oshxona Texnikasi' },
        { label: 'Kafolat', value: '1 yil rasmiy kafolat' }
      ]
    };
  }

  // 6. Changyutgich & Dazmollar
  if (category.slug === 'uy-tozalash') {
    let finalTitle = baseText || `${brandPrefix}Uy Texnikasi`;
    if (!hasBrandInTitle && brandPrefix) {
      finalTitle = `${brandPrefix}${finalTitle}`.trim();
    }
    return {
      title: finalTitle,
      categorySlug: 'uy-tozalash',
      brand,
      description: `${finalTitle} — uy tozaligi va parvarishi uchun kuchli hamda qulay texnika.`,
      specifications: [
        { label: 'Brend', value: brand },
        { label: 'Toifa', value: 'Changyutgich & Dazmollar' },
        { label: 'Kafolat', value: '1 yil rasmiy kafolat' }
      ]
    };
  }

  return null;
}

/**
 * Intelligent parser for Telegram captions
 */
function parseProductInfo(text = '') {
  const normalizedText = (text || '').trim();
  const { title: rawTitle, price, priceUSD, rawPriceLabel } = extractPriceAndTitle(normalizedText);

  const enriched = enrichWithKnowledge(rawTitle, normalizedText);
  const category = enriched
    ? CATEGORIES.find(c => c.slug === enriched.categorySlug) || detectCategory(normalizedText)
    : detectCategory(`${rawTitle} ${normalizedText}`);

  let title = enriched ? enriched.title : rawTitle;
  const brand = enriched ? enriched.brand : detectBrand(normalizedText);
  let description = enriched ? enriched.description : '';
  let specifications = enriched ? enriched.specifications : [];

  if (!title || title.length < 2) {
    title = `${brand !== 'TEXNOLUX' ? brand + ' ' : ''}${category.name}`;
  }

  if (!description) {
    description = `${title} — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.`;
  }

  if (!specifications || specifications.length === 0) {
    specifications = [
      { label: 'Yo‘nalish', value: category.departmentName || 'Maishiy Texnika' },
      { label: 'Toifa', value: category.name },
      { label: 'Brend', value: brand },
      { label: 'Holati', value: 'Yangi / Kafolatli' },
      { label: 'Yetkazib berish', value: 'O‘zbekiston bo‘ylab tezkor' }
    ];
  }

  let sku = '';
  const skuMatch = normalizedText.match(/(?:kodi?|sku|artikul|kod)\s*[:=-]?\s*([a-zA-Z0-9_-]+)/i);
  if (skuMatch) sku = skuMatch[1];

  return {
    title,
    price,
    priceUSD,
    rawPriceLabel,
    category,
    brand,
    description,
    specifications,
    sku,
    variants: []
  };
}

async function sendTelegram(method, data) {
  try {
    const res = await fetch(`${TELEGRAM_API}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.error('Telegram API error:', err.message);
    return null;
  }
}

async function downloadTelegramPhoto(fileId, destFileName) {
  try {
    const fileRes = await fetch(`${TELEGRAM_API}/getFile?file_id=${fileId}`);
    const fileData = await fileRes.json();
    if (!fileData.ok || !fileData.result?.file_path) {
      console.error('Failed to get file path from Telegram:', fileData);
      return null;
    }

    const filePath = fileData.result.file_path;
    const downloadUrl = `${TELEGRAM_FILE_API}/${filePath}`;
    const localDest = path.join(UPLOADS_DIR, destFileName);

    const imageRes = await fetch(downloadUrl);
    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(localDest, buffer);
    if (fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(DIST_UPLOADS_DIR, { recursive: true });
      fs.writeFileSync(path.join(DIST_UPLOADS_DIR, destFileName), buffer);
    }
    console.log(`Saved photo to: ${localDest}`);
    return `/uploads/${destFileName}`;
  } catch (err) {
    console.error('Download photo error:', err.message);
    return null;
  }
}

async function fetchTelegramAvatarIfMissing(userId, cfgKey) {
  try {
    const cfg = loadBotConfig();
    const user = cfg.users?.[String(cfgKey)];
    if (!user || user.customAvatar || user.telegramAvatar) return;

    const photosRes = await sendTelegram('getUserProfilePhotos', {
      user_id: userId,
      limit: 1
    });
    const sizes = photosRes?.result?.photos?.[0];
    if (!Array.isArray(sizes) || sizes.length === 0) return;

    const largest = sizes[sizes.length - 1];
    const relPath = `avatars/tg_${userId}.jpg`;
    const fileRes = await fetch(`${TELEGRAM_API}/getFile?file_id=${largest.file_id}`);
    const fileData = await fileRes.json();
    if (!fileData.ok || !fileData.result?.file_path) return;

    const imgRes = await fetch(`${TELEGRAM_FILE_API}/${fileData.result.file_path}`);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const savedUrl = saveAvatarBuffer(relPath, buffer);

    const latestCfg = loadBotConfig();
    if (latestCfg.users?.[String(cfgKey)]) {
      latestCfg.users[String(cfgKey)].telegramAvatar = savedUrl;
      if (!latestCfg.users[String(cfgKey)].customAvatar) {
        latestCfg.users[String(cfgKey)].avatar = savedUrl;
      }
      saveBotConfig(latestCfg);
    }
  } catch (_) {}
}

function loadMockProducts() {
  try {
    if (fs.existsSync(PUBLIC_DATA_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(PUBLIC_DATA_PATH, 'utf8'));
      if (Array.isArray(parsed)) return parsed;
    }
    const content = fs.readFileSync(MOCK_DATA_PATH, 'utf8');
    const pStart = content.indexOf('export const defaultProducts = [');
    if (pStart === -1) return [];

    const arrayStart = content.indexOf('[', pStart);
    let depth = 0;
    let arrayEnd = -1;
    for (let i = arrayStart; i < content.length; i++) {
      if (content[i] === '[') depth++;
      else if (content[i] === ']') {
        depth--;
        if (depth === 0) {
          arrayEnd = i + 1;
          break;
        }
      }
    }

    if (arrayEnd === -1) return [];
    return JSON.parse(content.slice(arrayStart, arrayEnd));
  } catch (err) {
    console.error('Failed to parse products:', err);
    return [];
  }
}

function writeMockProducts(products) {
  try {
    const formatted = JSON.stringify(products, null, 2);

    // 1. Live JSON for storefront (both public/ and dist/)
    fs.mkdirSync(path.dirname(PUBLIC_DATA_PATH), { recursive: true });
    fs.writeFileSync(PUBLIC_DATA_PATH, formatted, 'utf8');
    if (fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(path.dirname(DIST_DATA_PATH), { recursive: true });
      fs.writeFileSync(DIST_DATA_PATH, formatted, 'utf8');
    }

    // 2. Fallback mockData.js
    const content = fs.readFileSync(MOCK_DATA_PATH, 'utf8');
    const pStart = content.indexOf('export const defaultProducts = [');
    const bStart = content.indexOf('export const defaultBanners = [');
    if (pStart !== -1 && bStart !== -1) {
      const updatedContent = content.slice(0, pStart + 'export const defaultProducts = '.length) +
        formatted + ';\n\n' + content.slice(bStart);
      fs.writeFileSync(MOCK_DATA_PATH, updatedContent, 'utf8');
    }

    console.log(`Updated live catalog & mockData.js with ${products.length} products.`);
    return true;
  } catch (err) {
    console.error('Failed to write products:', err);
    return false;
  }
}

async function syncProductToSupabase(product) {
  if (!supabase) return;
  try {
    const row = {
      id: product.id || product._id,
      title: product.title,
      slug: product.slug,
      sku: product.sku || '',
      price: product.price,
      old_price: product.oldPrice || product.old_price || 0,
      discount_percent: product.discountPercent || product.discount_percent || 0,
      category: product.category,
      category_slug: product.category_slug || product.categorySlug,
      subcategory: product.subcategory || '',
      brand: product.brand || 'TEXNOLUX',
      stock: product.stock || 20,
      in_stock: true,
      rating: 5.0,
      reviews_count: 0,
      images: product.images || [],
      is_bestseller: true,
      is_new_arrival: true,
      is_weekly_deal: false,
      variants: product.variants || [],
      description: product.description || '',
      specifications: product.specifications || []
    };

    const { error } = await supabase.from('products').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase bot upsert warning:', error.message);
    } else {
      console.log(`Synced product "${product.title}" to Supabase cloud!`);
    }
  } catch (err) {
    console.warn('Supabase sync exception:', err.message);
  }
}

function saveOrUpdateProduct(parsed, imagePaths = []) {
  const products = loadMockProducts();
  const newSku = (parsed.sku || '').trim().toLowerCase();

  let existingIndex = -1;
  if (newSku) {
    existingIndex = products.findIndex(p => (p.sku || '').trim().toLowerCase() === newSku);
  }

  const oldPrice = Math.round(parsed.price * 1.15);
  const discountPercent = oldPrice > 0 ? Math.round(((oldPrice - parsed.price) / oldPrice) * 100) : 0;

  if (existingIndex !== -1) {
    const existing = products[existingIndex];
    existing.title = parsed.title;
    existing.price = parsed.price;
    existing.oldPrice = oldPrice;
    existing.old_price = oldPrice;
    existing.discountPercent = discountPercent;
    existing.discount_percent = discountPercent;
    existing.category = parsed.category.name;
    existing.category_slug = parsed.category.slug;
    existing.categorySlug = parsed.category.slug;
    existing.department = parsed.category.department;
    existing.departmentName = parsed.category.departmentName;
    existing.description = parsed.description;
    existing.brand = parsed.brand;
    existing.specifications = parsed.specifications || [];
    if (parsed.sku) existing.sku = parsed.sku;
    if (imagePaths && imagePaths.length > 0) {
      existing.images = imagePaths;
    }
    existing.updated_at = new Date().toISOString();

    writeMockProducts(products);
    return { isUpdate: true, product: existing };
  } else {
    const slug = (parsed.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'product') + '-' + Date.now().toString().slice(-4);

    const newProduct = {
      _id: `prod_${slug}`,
      id: `prod_${slug}`,
      title: parsed.title,
      slug: slug,
      sku: parsed.sku || `TXL-${Date.now().toString().slice(-6)}`,
      price: parsed.price,
      oldPrice: oldPrice,
      old_price: oldPrice,
      discountPercent: discountPercent,
      discount_percent: discountPercent,
      category: parsed.category.name,
      category_slug: parsed.category.slug,
      categorySlug: parsed.category.slug,
      department: parsed.category.department || 'maishiy-texnika',
      departmentName: parsed.category.departmentName || 'Maishiy Texnika',
      subcategory: '',
      brand: parsed.brand,
      stock: 25,
      inStock: true,
      in_stock: true,
      rating: 5.0,
      reviews_count: 0,
      images: imagePaths.length > 0 ? imagePaths : [],
      is_bestseller: true,
      is_new_arrival: true,
      is_weekly_deal: false,
      variantLabel: '',
      variants: [],
      description: parsed.description,
      specifications: parsed.specifications,
      created_at: new Date().toISOString()
    };

    products.unshift(newProduct);
    writeMockProducts(products);
    return { isUpdate: false, product: newProduct };
  }
}

// Media Group Buffer
const mediaGroupBuffer = new Map();
const userSinglePhotoBuffer = new Map();

async function processMediaGroup(key, groupData) {
  const { chatId, photos, caption } = groupData;
  mediaGroupBuffer.delete(key);
  userSinglePhotoBuffer.delete(key);

  console.log(`Processing media group with ${photos.length} photos...`);

  await sendTelegram('sendMessage', {
    chat_id: chatId,
    text: `⏳ Mahsulot qabul qilinmoqda (${photos.length} ta rasm)... Nomi va kategoriyasi aniqlanmoqda...`
  });

  const baseSlug = 'prod-' + Date.now().toString().slice(-6);
  const downloadedImages = [];
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const fileName = `${baseSlug}_${i + 1}.jpg`;
    const imagePath = await downloadTelegramPhoto(photo.file_id, fileName);
    if (imagePath) downloadedImages.push(imagePath);
  }

  if (downloadedImages.length === 0) {
    await sendTelegram('sendMessage', {
      chat_id: chatId,
      text: `❌ Rasmlarni yuklab olishda xatolik yuz berdi. Iltimos qaytadan yuboring.`
    });
    return;
  }

  const parsed = parseProductInfo(caption);
  const { isUpdate, product } = saveOrUpdateProduct(parsed, downloadedImages);
  await syncProductToSupabase(product);

  const formattedPrice = new Intl.NumberFormat('uz-UZ').format(product.price);
  const priceLine = parsed.priceUSD > 0
    ? `$${parsed.priceUSD} (${formattedPrice} so‘m)`
    : `${formattedPrice} so‘m`;

  const statusTitle = isUpdate
    ? `🔄 <b>Mavjud mahsulot yangilandi!</b>`
    : `✅ <b>Yangi mahsulot TEXNOLUX do‘koniga qo‘shildi!</b>`;

  const msgPayload = {
    chat_id: chatId,
    parse_mode: 'HTML',
    text: `${statusTitle}\n\n` +
          `📦 <b>Nomi:</b> ${product.title}\n` +
          `💰 <b>Narxi:</b> ${priceLine}\n` +
          `📂 <b>Kategoriya:</b> ${product.category}\n` +
          `🏷 <b>Brend:</b> ${product.brand}\n` +
          `🖼 <b>Rasmlar:</b> ${downloadedImages.length} ta\n\n` +
          `🚀 Mini App'ni ochib ko‘rishingiz mumkin!`
  };

  if (MINI_APP_URL.startsWith('https://')) {
    msgPayload.reply_markup = {
      inline_keyboard: [[
        { text: '🚀 Mini App-da ko‘rish', web_app: { url: MINI_APP_URL } }
      ]]
    };
  }

  await sendTelegram('sendMessage', msgPayload);
}

// Bot polling loop
let lastUpdateId = 0;

async function pollUpdates() {
  try {
    const res = await fetch(`${TELEGRAM_API}/getUpdates?offset=${lastUpdateId + 1}&timeout=25`, {
      signal: AbortSignal.timeout(35000)
    });
    const data = await res.json();

    if (data.ok && Array.isArray(data.result)) {
      for (const update of data.result) {
        lastUpdateId = Math.max(lastUpdateId, update.update_id);
        await handleUpdate(update);
      }
    }
  } catch (err) {
    console.error('Polling error:', err.message);
    await new Promise(r => setTimeout(r, 3000));
  }

  setImmediate(pollUpdates);
}

async function checkChannelMembership(userId) {
  const res = await sendTelegram('getChatMember', {
    chat_id: REQUIRED_CHANNEL,
    user_id: userId
  });
  if (!res) return { ok: false, reason: 'network_error' };
  if (res.ok && res.result) {
    const status = res.result.status;
    if (['member', 'administrator', 'creator', 'restricted'].includes(status)) {
      return { ok: true, verified: true, status };
    }
    return { ok: false, verified: true, reason: 'not_member', status };
  }
  if (String(res.description || '').toLowerCase().includes('inaccessible')) {
    console.warn(`⚠️ Channel check blocked: @ReferalPeople_bot must be Admin in ${REQUIRED_CHANNEL}.`);
    return { ok: false, verified: false, reason: 'bot_not_admin' };
  }
  return { ok: false, verified: false, reason: res.description || 'unknown' };
}

async function sendChannelJoinPrompt(chatId) {
  await sendTelegram('sendMessage', {
    chat_id: chatId,
    parse_mode: 'HTML',
    text: `👋 <b>Assalomu alaykum!</b>\n\n<b>TEXNOLUX — Ishonchli va Barakali</b> online do‘konimizga xush kelibsiz!\n\nDo‘konni ochish uchun avval kanalimizga qo‘shiling:\n👉 ${REQUIRED_CHANNEL_URL}\n\nSo‘ng pastdagi <b>«✅ Qo‘shildim»</b> tugmasini bosing:`,
    reply_markup: {
      inline_keyboard: [
        [{ text: '📢 Kanalga qo‘shilish', url: REQUIRED_CHANNEL_URL }],
        [{ text: '✅ Qo‘shildim', callback_data: 'check_channel_sub' }]
      ]
    }
  });
}

async function sendStoreReadyMessage(chatId, userProfile = {}) {
  const fullName = [userProfile.firstName, userProfile.lastName].filter(Boolean).join(' ');
  const greeting = fullName ? `<b>${fullName}</b>, xush kelibsiz!` : `<b>Xush kelibsiz!</b>`;
  const userAppUrl = getMiniAppUrlForUser(chatId);

  if (userAppUrl) {
    await sendTelegram('setChatMenuButton', {
      chat_id: chatId,
      menu_button: { type: 'web_app', text: '🛍 Do‘konni ochish', web_app: { url: userAppUrl } }
    });
    await sendTelegram('sendMessage', {
      chat_id: chatId,
      parse_mode: 'HTML',
      text: `✅ ${greeting}\n\nEndi pastdagi tugma orqali <b>TEXNOLUX</b> online do‘konini ochishingiz mumkin:`,
      reply_markup: {
        inline_keyboard: [[
          { text: '🛍 Online do‘konni ochish', web_app: { url: userAppUrl } }
        ]]
      }
    });
  } else {
    await sendTelegram('sendMessage', {
      chat_id: chatId,
      parse_mode: 'HTML',
      text: `✅ ${greeting}\n\n(Mini App ochilishi uchun <code>MINI_APP_URL</code> sozlanishi kerak.)`
    });
  }
}

async function handleUpdate(update) {
  const cfg = loadBotConfig();
  if (!cfg.users) cfg.users = {};

  // Handle inline callback queries ("✅ Qo‘shildim" opens Mini App immediately without strict check)
  if (update.callback_query) {
    const cq = update.callback_query;
    const chatId = cq.message?.chat?.id || cq.from.id;
    const userId = cq.from.id;
    const key = String(chatId);

    if (cq.data === 'check_channel_sub') {
      const existing = cfg.users[key] || { chatId, userId };
      const profile = {
        ...existing,
        chatId,
        userId,
        firstName: existing.firstName || cq.from?.first_name || 'Mijoz',
        lastName: existing.lastName || cq.from?.last_name || '',
        username: cq.from?.username || existing.username || '',
        subscribed: true,
        step: 'completed',
        registeredAt: existing.registeredAt || new Date().toISOString()
      };
      cfg.users[key] = profile;
      saveBotConfig(cfg);
      fetchTelegramAvatarIfMissing(userId, key).catch(() => {});

      await sendTelegram('answerCallbackQuery', {
        callback_query_id: cq.id,
        text: '✅ Do‘kon ochildi!'
      });

      const userAppUrl = getMiniAppUrlForUser(chatId);
      if (userAppUrl) {
        await sendTelegram('setChatMenuButton', {
          chat_id: chatId,
          menu_button: { type: 'web_app', text: '🛍 Do‘konni ochish', web_app: { url: userAppUrl } }
        });

        let edited = false;
        if (cq.message?.message_id) {
          const editRes = await sendTelegram('editMessageText', {
            chat_id: chatId,
            message_id: cq.message.message_id,
            parse_mode: 'HTML',
            text: `✅ <b>Rahmat!</b> Endi pastdagi tugmani bosib <b>TEXNOLUX</b> online do‘konini ochishingiz mumkin:`,
            reply_markup: {
              inline_keyboard: [[
                { text: '🛍 Online do‘konni ochish', web_app: { url: userAppUrl } }
              ]]
            }
          });
          edited = Boolean(editRes?.ok);
        }

        if (!edited) {
          await sendStoreReadyMessage(chatId, profile);
        }
      } else {
        await sendStoreReadyMessage(chatId, profile);
      }
    }
    return;
  }

  const msg = update.message;
  if (!msg) return;

  const chatId = msg.chat.id;
  const userId = msg.from?.id || chatId;
  const key = String(chatId);
  const rawText = (msg.text || '').trim();
  const caption = (msg.caption || '').trim();
  console.log(`[BOT] Update from ${chatId}: ${rawText || caption || (msg.contact ? '[contact]' : '[media]')}`);

  // 1. /clear command (preserves avatars folder)
  if (rawText === '/clear' || rawText === '/delete_all' || rawText === '/tozala') {
    writeMockProducts([]);
    for (const dir of [UPLOADS_DIR, DIST_UPLOADS_DIR]) {
      if (fs.existsSync(dir)) {
        for (const f of fs.readdirSync(dir)) {
          if (f === 'avatars' || f.startsWith('avatar_')) continue;
          const full = path.join(dir, f);
          try {
            if (fs.statSync(full).isFile()) fs.unlinkSync(full);
          } catch (_) {}
        }
      }
    }
    if (supabase) {
      try {
        await supabase.from('products').delete().neq('id', '___non_existent___');
      } catch (_) {}
    }

    await sendTelegram('sendMessage', {
      chat_id: chatId,
      parse_mode: 'HTML',
      text: `🗑 <b>Barcha mahsulotlar to‘liq o‘chirildi!</b>\n\nEndi yangi mahsulotlaringizni rasm va narxi bilan yuborishingiz mumkin.`
    });
    return;
  }

  // 1b. /orders or /profil command -> send user's orders & notification status + link to Profile
  if (rawText === '/orders' || rawText === '/buyurtmalar' || rawText === '/profil') {
    const profile = cfg.users[key];
    const allOrders = readJsonArray(BOT_ORDERS_PATH);
    const shortPhone = normalizeShortPhone(profile?.phone);
    const myOrders = allOrders.filter(
      (o) =>
        (o.chatId && String(o.chatId) === key) ||
        (shortPhone && normalizeShortPhone(o.customerDetails?.phone || o.customer_phone) === shortPhone)
    );

    let summaryText = `👤 <b>Sizning TEXNOLUX profilingiz</b>\n\n`;
    if (myOrders.length > 0) {
      summaryText += `📦 <b>Buyurtmalar soni:</b> ${myOrders.length} ta\n\n`;
      for (const o of myOrders.slice(0, 5)) {
        const meta = ORDER_STATUS_META[o.orderStatus || o.order_status || 'new'] || ORDER_STATUS_META.new;
        const totalFmt = new Intl.NumberFormat('ru-RU').format(Number(o.totalAmount || o.total_amount || 0));
        summaryText += `${meta.emoji} <code>${o.orderNumber}</code> — <b>${meta.label}</b> (${totalFmt} so‘m)\n`;
      }
    } else {
      summaryText += `Hozircha buyurtmalar mavjud emas. Buyurtma berganingizda barcha holat eslatmalari shu yerda ko‘rinadi.`;
    }
    await sendOrderTelegramAlert(chatId, summaryText);
    return;
  }

  // 2. Allow product photo+price upload anytime (for store owner)
  if (msg.photo && msg.photo.length > 0) {
    if (!caption) {
      await sendTelegram('sendMessage', {
        chat_id: chatId,
        parse_mode: 'HTML',
        text: `❌ <b>Faqat rasm qabul qilinmaydi!</b>\n\nIltimos, rasm tagiga mahsulot nomi va narxini yozing (masalan: <code>Rulls 10 kg 275$</code>).`
      });
      return;
    }
    const priceCheck = extractPriceAndTitle(caption);
    if (!priceCheck || priceCheck.price <= 0) {
      await sendTelegram('sendMessage', {
        chat_id: chatId,
        parse_mode: 'HTML',
        text: `⚠️ <b>Mahsulot narxi topilmadi!</b>\n\nIltimos, rasm tagiga mahsulot narxini yozing (masalan: <code>Rulls 10 kg 275$</code> yoki <code>3 500 000 so‘m</code>).`
      });
      return;
    }
    // Proceed to photo media group handler below
  } else {
    // 3. Simple /start -> ask to join channel + "✅ Qo‘shildim" button (no name/surname/contact prompt)
    if (rawText.startsWith('/start') || rawText === '/register') {
      const existing = cfg.users[key] || {};
      await sendTelegram('setChatMenuButton', {
        chat_id: chatId,
        menu_button: { type: 'commands' }
      });
      cfg.users[key] = {
        ...existing,
        chatId,
        userId,
        firstName: existing.firstName || msg.from?.first_name || 'Mijoz',
        lastName: existing.lastName || msg.from?.last_name || '',
        username: msg.from?.username || existing.username || '',
        phone: existing.phone || '',
        step: 'awaiting_channel',
        subscribed: Boolean(existing.subscribed),
        registeredAt: existing.registeredAt || new Date().toISOString()
      };
      saveBotConfig(cfg);
      fetchTelegramAvatarIfMissing(userId, key).catch(() => {});

      await sendChannelJoinPrompt(chatId);
      return;
    }

    const userState = cfg.users[key];
    if (!userState || userState.step !== 'completed') {
      await sendChannelJoinPrompt(chatId);
      return;
    }

    // Completed user sent plain text (e.g. /help or text)
    if (rawText.startsWith('/help') || userState.step === 'completed') {
      await sendStoreReadyMessage(chatId, userState);
      return;
    }
  }

  // 6. PHOTO IS VALID AND HAS PRICE -> PROCESS!
  const largestPhoto = msg.photo[msg.photo.length - 1];
  const mediaGroupId = msg.media_group_id;

  if (mediaGroupId) {
    if (mediaGroupBuffer.has(mediaGroupId)) {
      const group = mediaGroupBuffer.get(mediaGroupId);
      group.photos.push(largestPhoto);
      if (caption) group.caption = caption;
      clearTimeout(group.timer);
      group.timer = setTimeout(() => processMediaGroup(mediaGroupId, group), 1800);
    } else {
      const group = {
        chatId,
        photos: [largestPhoto],
        caption: caption,
        timer: null
      };
      group.timer = setTimeout(() => processMediaGroup(mediaGroupId, group), 1800);
      mediaGroupBuffer.set(mediaGroupId, group);
    }
    return;
  }

  const userKey = `user_${chatId}`;
  if (userSinglePhotoBuffer.has(userKey)) {
    const buffer = userSinglePhotoBuffer.get(userKey);
    if (caption && buffer.caption) {
      clearTimeout(buffer.timer);
      processMediaGroup(userKey, buffer);
      const newGroup = {
        chatId,
        photos: [largestPhoto],
        caption: caption,
        timer: null
      };
      newGroup.timer = setTimeout(() => processMediaGroup(userKey, newGroup), 1500);
      userSinglePhotoBuffer.set(userKey, newGroup);
      return;
    }

    buffer.photos.push(largestPhoto);
    if (caption) buffer.caption = caption;
    clearTimeout(buffer.timer);
    buffer.timer = setTimeout(() => processMediaGroup(userKey, buffer), 1500);
    return;
  }

  const singleGroup = {
    chatId,
    photos: [largestPhoto],
    caption: caption,
    timer: null
  };
  singleGroup.timer = setTimeout(() => processMediaGroup(userKey, singleGroup), 1500);
  userSinglePhotoBuffer.set(userKey, singleGroup);
}

// Start polling and HTTP listener only when executed directly
if (require.main === module) {
  console.log('====================================================');
  console.log('🤖 TEXNOLUX TELEGRAM BOT & MINI APP LAUNCHER RUNNING');
  console.log(`Bot username: ${process.env.BOT_USERNAME || '(configured via TELEGRAM_BOT_TOKEN)'}`);
  console.log('Smart Auto-Enricher: Home Appliances & Electronics');
  console.log('====================================================');

  healthServer.listen(PORT, () => {
    console.log(`Telegram Bot health-check server listening on port ${PORT}`);
  });

  // Keep global menu button as commands until user completes /start onboarding + channel join
  sendTelegram('setChatMenuButton', {
    menu_button: { type: 'commands' }
  }).then((r) => console.log('Global Menu Button reset for onboarding:', r?.ok ? 'OK' : JSON.stringify(r)));

  const existingOrders = readJsonArray(BOT_ORDERS_PATH);
  writeDualDataJson(BOT_ORDERS_PATH, PUBLIC_ORDERS_PATH, DIST_ORDERS_PATH, existingOrders);
  const existingNotifs = readJsonArray(BOT_NOTIFICATIONS_PATH);
  writeDualDataJson(BOT_NOTIFICATIONS_PATH, PUBLIC_NOTIFICATIONS_PATH, DIST_NOTIFICATIONS_PATH, existingNotifs);

  if (MINI_APP_URL.startsWith('https://')) {
    console.log(`Mini App URL: ${MINI_APP_URL}`);
    const cfg = loadBotConfig();
    syncCustomersToJson(cfg);
    for (const [cid, u] of Object.entries(cfg.users || {})) {
      if (u && u.step === 'completed') {
        const userUrl = getMiniAppUrlForUser(cid);
        sendTelegram('setChatMenuButton', {
          chat_id: Number(cid) || cid,
          menu_button: { type: 'web_app', text: '🛍 Do‘konni ochish', web_app: { url: userUrl } }
        }).catch(() => {});
        fetchTelegramAvatarIfMissing(Number(cid) || cid, cid).catch(() => {});
      }
    }
  } else {
    syncCustomersToJson(loadBotConfig());
  }

  pollUpdates();
}

module.exports = { parseProductInfo, extractPriceAndTitle, detectCategory, detectBrand };
