import { dataService } from './supabaseData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Helper to parse a URL path and its query params.
 */
function parseUrl(rawUrl, config = {}) {
  let url = rawUrl || '';
  // strip base url if present
  url = url.replace(/^https?:\/\/[^/]+/i, '');
  if (!url.startsWith('/')) url = '/' + url;
  if (url.startsWith('/api/')) url = url.replace('/api', '');

  const [pathPart, queryPart] = url.split('?');
  const params = { ...(config.params || {}) };

  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    for (const [k, v] of searchParams.entries()) {
      if (params[k] === undefined) params[k] = v;
    }
  }

  return { path: pathPart, params };
}

/**
 * Universal API Adapter:
 * Emulates Axios responses while executing directly on Supabase / local data service.
 * Eliminates the need for a separate Node/Express backend server.
 */
const api = {
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} }
  },

  async get(url, config = {}) {
    const { path, params } = parseUrl(url, config);

    // 1. Featured Products
    if (path === '/products/featured') {
      const data = await dataService.getFeaturedProducts();
      return { data: { success: true, ...data } };
    }

    // 2. All Products
    if (path === '/products') {
      const result = await dataService.getAllProducts(params);
      return { data: { success: true, ...result } };
    }

    // 3. Product by slug or id
    if (path.startsWith('/products/slug/')) {
      const slug = path.replace('/products/slug/', '');
      const res = await dataService.getProductBySlug(slug);
      if (!res) {
        return { data: { success: false, message: 'Mahsulot topilmadi' } };
      }
      return { data: { success: true, product: res.product, related: res.related } };
    }

    if (path.startsWith('/products/')) {
      const idOrSlug = path.replace('/products/', '');
      const res = await dataService.getProductBySlug(idOrSlug);
      if (!res) {
        return { data: { success: false, message: 'Mahsulot topilmadi' } };
      }
      return { data: { success: true, product: res.product, related: res.related } };
    }

    // 4. Categories
    if (path === '/categories') {
      const categories = await dataService.getCategories();
      return { data: { success: true, categories } };
    }

    // 5. Orders
    if (path === '/orders') {
      const orders = await dataService.getAllOrders(params.status || 'all');
      return { data: { success: true, orders, total: orders.length } };
    }

    if (path === '/orders/my-orders') {
      const userHint =
        params.chatId || params.phone || params.role
          ? { chatId: params.chatId, phone: params.phone, role: params.role }
          : null;
      const orders = await dataService.getMyOrders(userHint);
      return { data: { success: true, orders, total: orders.length } };
    }

    if (path === '/notifications') {
      const userHint =
        params.chatId || params.phone || params.role
          ? { chatId: params.chatId, phone: params.phone, role: params.role }
          : null;
      const notifications = await dataService.getNotifications(userHint);
      return { data: { success: true, notifications } };
    }

    // 6. Admin Dashboard Stats
    if (path === '/admin/dashboard-stats') {
      const stats = await dataService.getDashboardStats();
      return { data: { success: true, stats, ...stats } };
    }

    // 7. Admin Customers
    if (path === '/admin/customers') {
      const customers = await dataService.getCustomers();
      return { data: { success: true, customers } };
    }

    // 8. Banners
    if (path === '/banners') {
      const banners = await dataService.getBanners();
      return { data: { success: true, banners } };
    }

    // 9. Coupons
    if (path === '/coupons') {
      const coupons = await dataService.getCoupons();
      return { data: { success: true, coupons } };
    }

    // 10. Reviews
    if (path === '/reviews/eligibility') {
      const canReview = dataService.canReviewProduct(params.productId || '');
      return { data: { success: true, canReview } };
    }

    if (path === '/reviews' || path === '/reviews/admin') {
      const reviews = await dataService.getReviews(params.productId || null);
      return { data: { success: true, reviews } };
    }

    // 11. Current user
    if (path === '/auth/me') {
      const user = {
        id: 'usr_admin',
        name: 'Store Admin',
        email: 'admin@example.com',
        role: 'superadmin',
        phone: '+998 90 000 00 00'
      };
      return { data: { success: true, user } };
    }

    console.warn('[API GET 404] Unhandled route:', path);
    return { data: { success: false, message: `Route ${path} not found` } };
  },

  async post(url, body = {}, config = {}) {
    const { path } = parseUrl(url, config);

    // 1. Create Order
    if (path === '/orders') {
      const order = await dataService.createOrder(body);
      return {
        data: {
          success: true,
          message: 'Buyurtmangiz muvaffaqiyatli qabul qilindi!',
          order
        }
      };
    }

    // 2. Create Product
    if (path === '/products') {
      const product = await dataService.createProduct(body);
      return {
        data: {
          success: true,
          message: 'Mahsulot muvaffaqiyatli yaratildi',
          product
        }
      };
    }

    // 3. Create Category
    if (path === '/categories') {
      const category = await dataService.createCategory(body);
      return {
        data: {
          success: true,
          message: 'Kategoriya muvaffaqiyatli yaratildi',
          category
        }
      };
    }

    // 4. Create Banner
    if (path === '/banners') {
      const banner = await dataService.createBanner(body);
      return {
        data: {
          success: true,
          message: 'Banner yaratildi',
          banner
        }
      };
    }

    // 5. Create Coupon
    if (path === '/coupons') {
      const coupon = await dataService.createCoupon(body);
      return {
        data: {
          success: true,
          message: 'Kupon yaratildi',
          coupon
        }
      };
    }

    // 6. Create Review (only verified purchasers allowed)
    if (path === '/reviews') {
      if (!dataService.canReviewProduct(body.productId || body.product_id)) {
        return {
          data: {
            success: false,
            message: 'Faqat ushbu mahsulotni sotib olgan mijozlar sharh qoldirishi mumkin!'
          }
        };
      }
      const review = await dataService.createReview(body);
      return {
        data: {
          success: true,
          message: 'Sharhingiz uchun rahmat!',
          review
        }
      };
    }

    // 7. Auth Login
    if (path === '/auth/login' || path === '/auth/admin/login') {
      const token = 'supabase-session-token-' + Date.now();
      const user = {
        id: 'usr_admin',
        name: 'Store Admin',
        email: body.email || 'admin@example.com',
        role: 'superadmin',
        phone: '+998 90 000 00 00'
      };
      return {
        data: {
          success: true,
          message: 'Xush kelibsiz!',
          token,
          user
        }
      };
    }

    // 8. Auth Register
    if (path === '/auth/register') {
      const token = 'supabase-session-token-' + Date.now();
      const user = {
        id: 'usr_' + Date.now(),
        name: body.name || 'Yangi Mijoz',
        email: body.email,
        phone: body.phone || '+998 90 000 00 00',
        role: 'customer'
      };
      return {
        data: {
          success: true,
          message: 'Ro‘yxatdan o‘tdingiz!',
          token,
          user
        }
      };
    }

    console.warn('[API POST 404] Unhandled route:', path);
    return { data: { success: false, message: `Route ${path} not found` } };
  },

  async put(url, body = {}, config = {}) {
    const { path } = parseUrl(url, config);

    // 1. Update Order status
    if (path.startsWith('/orders/') && path.endsWith('/status')) {
      const parts = path.split('/');
      const orderId = parts[2];
      const newStatus = body.orderStatus || body.order_status;
      const order = await dataService.updateOrderStatus(orderId, newStatus);
      return {
        data: {
          success: true,
          message: 'Buyurtma holati yangilandi',
          order
        }
      };
    }

    // 2. Update Product
    if (path.startsWith('/products/')) {
      const productId = path.replace('/products/', '');
      const product = await dataService.updateProduct(productId, body);
      return {
        data: {
          success: true,
          message: 'Mahsulot yangilandi',
          product
        }
      };
    }

    console.warn('[API PUT 404] Unhandled route:', path);
    return { data: { success: false, message: `Route ${path} not found` } };
  },

  async delete(url, config = {}) {
    const { path } = parseUrl(url, config);

    if (path.startsWith('/products/')) {
      const id = path.replace('/products/', '');
      await dataService.deleteProduct(id);
      return { data: { success: true, message: 'Mahsulot o‘chirildi' } };
    }

    if (path.startsWith('/categories/')) {
      const id = path.replace('/categories/', '');
      await dataService.deleteCategory(id);
      return { data: { success: true, message: 'Kategoriya o‘chirildi' } };
    }

    if (path.startsWith('/banners/')) {
      const id = path.replace('/banners/', '');
      await dataService.deleteBanner(id);
      return { data: { success: true, message: 'Banner o‘chirildi' } };
    }

    if (path.startsWith('/coupons/')) {
      const id = path.replace('/coupons/', '');
      await dataService.deleteCoupon(id);
      return { data: { success: true, message: 'Kupon o‘chirildi' } };
    }

    if (path.startsWith('/reviews/')) {
      const id = path.replace('/reviews/', '');
      await dataService.deleteReview(id);
      return { data: { success: true, message: 'Sharh o‘chirildi' } };
    }

    console.warn('[API DELETE 404] Unhandled route:', path);
    return { data: { success: false, message: `Route ${path} not found` } };
  }
};

export default api;
export { dataService, supabase, isSupabaseConfigured };
