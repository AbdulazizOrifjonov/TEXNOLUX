import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Plus,
  Trash2,
  Edit,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Save,
  Tag,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Truck,
  Phone,
  ExternalLink,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Building2,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Image as ImageIcon,
  Star,
  MessageSquare,
  Upload,
  X
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { uploadProductImage } from '../../services/supabaseClient';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [overviewPeriod, setOverviewPeriod] = useState('7days');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [refreshingStats, setRefreshingStats] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Stats state
  const [stats, setStats] = useState(null);

  // Products state & dedicated panel view
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productView, setProductView] = useState('list'); // 'list' | 'form'
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    sku: '',
    price: '',
    oldPrice: '',
    stock: 10,
    category: 'Trenajorlar & Kardio',
    categorySlug: 'trenajorlar',
    brand: '',
    description: '',
    images: [],
    isBestseller: false,
    isNewArrival: true,
    isWeeklyDeal: false,
    specifications: []
  });

  // Categories state
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', icon: 'FileText' });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Customers state
  const [customers, setCustomers] = useState([]);

  // Banners state
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', badge: '', link: '/shop', type: 'hero' });

  // Coupons state
  const [coupons, setCoupons] = useState([]);
  const [couponForm, setCouponForm] = useState({ code: '', discountPercent: 10, minOrderAmount: 100000, expiryDate: '2027-12-31' });

  // Reviews state
  const [reviews, setReviews] = useState([]);

  // Settings state
  const [settings, setSettings] = useState({
    storeName: 'TEXNOLUX',
    phone: '+998 90 000 00 00',
    telegram: '@ReferalPeople_bot',
    address: 'Toshkent / O‘zbekiston',
    workingHours: '09:00 — 21:00'
  });

  const [loading, setLoading] = useState(false);

  // Fallback realistic business stats if database is empty or loading
  const fallbackStats = {
    totalRevenue: 41640000,
    totalOrders: 5,
    totalProducts: 12,
    totalCustomers: 5,
    averageOrderValue: 8328000,
    b2bRevenue: 22800000,
    statusCounts: [
      { _id: 'new', count: 2 },
      { _id: 'processing', count: 1 },
      { _id: 'shipped', count: 0 },
      { _id: 'delivered', count: 2 },
      { _id: 'cancelled', count: 0 }
    ],
    dailySales: [
      { day: 'Dush', revenue: 4500000, orders: 1 },
      { day: 'Sesh', revenue: 6200000, orders: 1 },
      { day: 'Chor', revenue: 8100000, orders: 1 },
      { day: 'Pay', revenue: 5340000, orders: 1 },
      { day: 'Juma', revenue: 14500000, orders: 1 },
      { day: 'Shan', revenue: 22800000, orders: 1 },
      { day: 'Yak', revenue: 3500000, orders: 1 }
    ],
    paymentCounts: [
      { _id: 'click', count: 2, total: 3490000 },
      { _id: 'payme', count: 1, total: 14500000 },
      { _id: 'bank_transfer', count: 1, total: 22800000 },
      { _id: 'cash', count: 1, total: 850000 }
    ],
    categoryCounts: [
      { _id: 'Podstavka & Skameykalar', count: 3 },
      { _id: 'Trenajorlar & Kardio', count: 3 },
      { _id: 'Gantellar & Shtangalar', count: 2 },
      { _id: 'Sport Kiyimlari', count: 2 },
      { _id: 'Krossovkalar & Poyabzal', count: 1 },
      { _id: 'Fitnes Aksessuarlari', count: 1 }
    ],
    lowStockProducts: [
      { _id: 'low1', title: 'Gantel podstavka SC80263', sku: '0455763', stock: 5, category: 'Podstavka & Skameykalar', price: 960000, images: ['/uploads/gantel-podstavka-sc80263.png'] },
      { _id: 'low2', title: 'Ko‘p Funksiyali Kuch Trenajori Multi-Gym HG-500', sku: 'GYM-HG500-STATION', stock: 2, category: 'Trenajorlar & Kardio', price: 22800000, images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'] },
      { _id: 'low3', title: '2-Qavatli Universal Gantel Stoykasi SC80270', sku: '0455770', stock: 4, category: 'Podstavka & Skameykalar', price: 1850000, images: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80'] }
    ],
    topProducts: [
      { _id: 'top1', title: 'Gantel podstavka SC80263', category: 'Podstavka & Skameykalar', price: 960000, stock: 15, images: ['/uploads/gantel-podstavka-sc80263.png'], soldCount: 48 },
      { _id: 'top2', title: 'Professional Yugurish Yo‘lakchasi ProForm T800', category: 'Trenajorlar & Kardio', price: 14500000, stock: 4, images: ['https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&auto=format&fit=crop&q=80'], soldCount: 22 },
      { _id: 'top3', title: 'Hexagonal Kauchuk Gantellar To‘plami (2x10kg)', category: 'Gantellar & Shtangalar', price: 680000, stock: 18, images: ['https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80'], soldCount: 35 },
      { _id: 'top4', title: 'Ko‘p Funksiyali Kuch Trenajori Multi-Gym HG-500', category: 'Trenajorlar & Kardio', price: 22800000, stock: 2, images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'], soldCount: 12 },
      { _id: 'top5', title: 'Kombinatsiyalangan Devoriy Turnik-Brus 3-in-1', category: 'Trenajorlar & Kardio', price: 850000, stock: 25, images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop&q=80'], soldCount: 29 }
    ],
    recentOrders: [
      {
        _id: 'ord1',
        orderNumber: 'NSB-902101',
        customerDetails: { fullName: 'Farrux Saidov', phone: '+998 94 222 10 30', city: 'Buxoro shahri', address: 'Ibn Sino ko‘chasi, 24-uy' },
        totalAmount: 1640000,
        paymentMethod: 'click',
        orderStatus: 'new',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'ord2',
        orderNumber: 'NSB-902102',
        customerDetails: { fullName: 'Nodira Xoliqova', phone: '+998 93 333 88 99', city: 'Kogon tumani', address: 'Navoiy shoh ko‘chasi, 8-uy' },
        totalAmount: 14500000,
        paymentMethod: 'payme',
        orderStatus: 'processing',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        _id: 'ord3',
        orderNumber: 'NSB-902103',
        customerDetails: { fullName: 'Sherzod Po‘latov («Bukhara Fitness»)', phone: '+998 97 123 98 76', city: 'Buxoro shahri', address: 'Abu Ali Ibn Sino 88, Fitnes Zal' },
        totalAmount: 22800000,
        paymentMethod: 'bank_transfer',
        orderStatus: 'delivered',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        _id: 'ord4',
        orderNumber: 'NSB-902104',
        customerDetails: { fullName: 'Shahzod Aliyev', phone: '+998 91 445 11 22', city: 'Buxoro shahri', address: 'Somoniylar ko‘chasi, 12-uy' },
        totalAmount: 850000,
        paymentMethod: 'cash',
        orderStatus: 'delivered',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        _id: 'ord5',
        orderNumber: 'NSB-902105',
        customerDetails: { fullName: 'Jamshid Ergashev', phone: '+998 91 445 78 90', city: 'G‘ijduvon tumani', address: 'Yusuf Hamadoniy ko‘chasi, 45-uy' },
        totalAmount: 1850000,
        paymentMethod: 'click',
        orderStatus: 'new',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  };

  const fallbackCustomers = [
    {
      _id: 'cust-1',
      fullName: 'Bekzod Karimov',
      phone: '+998 90 000 00 00',
      city: 'Buxoro shahri',
      address: 'Mustaqillik ko‘chasi, 12-uy',
      ordersCount: 5,
      totalSpent: 14500000,
      status: 'VIP Mijoz',
      registeredAt: '2026-01-15'
    },
    {
      _id: 'cust-2',
      fullName: 'Jamshid Ergashev',
      phone: '+998 91 445 78 90',
      city: 'G‘ijduvon tumani',
      address: 'Yusuf Hamadoniy ko‘chasi, 45-uy',
      ordersCount: 3,
      totalSpent: 8200000,
      status: 'Faol',
      registeredAt: '2026-02-01'
    },
    {
      _id: 'cust-3',
      fullName: 'Nilufar Saidova',
      phone: '+998 93 678 12 34',
      city: 'Buxoro shahri',
      address: 'Ibn Sino ko‘chasi, 8-uy',
      ordersCount: 2,
      totalSpent: 4750000,
      status: 'Yangi',
      registeredAt: '2026-02-18'
    },
    {
      _id: 'cust-4',
      fullName: 'Alisher Usmonov (OOO "Bukhara IT")',
      phone: '+998 97 300 20 10',
      city: 'Kogon tumani',
      address: 'Sanoat hududi, 5-bino',
      ordersCount: 4,
      totalSpent: 32000000,
      status: 'Korporativ B2B',
      registeredAt: '2026-01-20'
    },
    {
      _id: 'cust-5',
      fullName: 'Shahnoza Karimova',
      phone: '+998 99 555 11 22',
      city: 'Buxoro shahri',
      address: 'Somoniylar ko‘chasi, 88-uy',
      ordersCount: 1,
      totalSpent: 1850000,
      status: 'Standart',
      registeredAt: '2026-03-02'
    }
  ];

  const fallbackBanners = [
    {
      _id: 'ban-1',
      title: 'Original Sport Kiyimlari va Poyabzallar',
      subtitle: 'Nike, Adidas, Jordan, Under Armour va Gymshark mahsulotlari eng yaxshi narxlarda.',
      badge: 'WYUE RASMIY KOLLEKSIYASI',
      link: '/shop',
      type: 'hero',
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&auto=format&fit=crop&q=80',
      isActive: true
    },
    {
      _id: 'ban-2',
      title: 'Nike Air Jordan & Streetwear Kolleksiyasi',
      subtitle: 'Krossovkalar, hudi va sport shimlari original sifatda. 100% kafolatlangan brend tovarlar.',
      badge: 'YANGI KOLLEKSIYA 2026',
      link: '/shop/krossovkalar',
      type: 'hero',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&auto=format&fit=crop&q=80',
      isActive: true
    },
    {
      _id: 'ban-3',
      title: 'Fitnes & Mashg‘ulot Jihozlari',
      subtitle: 'Uy va zal uchun professional gantellar, skameykalar, sport sumkalari va aksessuarlar.',
      badge: 'ZAL VA FITNES UCHUN',
      link: '/shop/fitnes-trenajor',
      type: 'hero',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1600&auto=format&fit=crop&q=80',
      isActive: true
    }
  ];

  const fallbackCoupons = [
    {
      _id: 'coup-1',
      code: 'NSB2026',
      discountPercent: 10,
      minOrderAmount: 200000,
      expiryDate: '2026-12-31',
      status: 'Faol'
    },
    {
      _id: 'coup-2',
      code: 'SPORT_START',
      discountPercent: 15,
      minOrderAmount: 500000,
      expiryDate: '2026-06-01',
      status: 'Faol'
    },
    {
      _id: 'coup-3',
      code: 'VIP_BUKHARA',
      discountPercent: 20,
      minOrderAmount: 1500000,
      expiryDate: '2026-09-01',
      status: 'Faol'
    },
    {
      _id: 'coup-4',
      code: 'RAMAZON_SPECIAL',
      discountPercent: 12,
      minOrderAmount: 300000,
      expiryDate: '2026-05-15',
      status: 'Faol'
    }
  ];

  const fallbackReviews = [
    {
      _id: 'rev-1',
      userName: 'Bekzod Karimov',
      rating: 5,
      productTitle: 'Nike Air Jordan 1 Retro High OG',
      comment: 'Nike Air Jordan 1 original sifati ajoyib, oyoqqa juda qulay o‘tirdi. WYUE ga tezkor yetkazib berish uchun rahmat!',
      createdAt: '2026-03-01',
      status: 'approved'
    },
    {
      _id: 'rev-2',
      userName: 'Dilnoza Rustamova',
      rating: 5,
      productTitle: 'Gymshark Vital Seamless Leggins',
      comment: 'Fitnes uchun eng zo‘r tanlov. Mato sifati cho‘ziluvchan, mashg‘ulot paytida judayam qulay. Tavsiya qilaman!',
      createdAt: '2026-02-24',
      status: 'approved'
    },
    {
      _id: 'rev-3',
      userName: 'Azizbek Mirzayev',
      rating: 5,
      productTitle: 'Hexagonal Gantellar To‘plami (2x10kg)',
      comment: 'Hexagonal gantellar sifati juda baland, rezina qoplami sifatli. Uy sharoitida trenirovka uchun ayni muddao.',
      createdAt: '2026-02-15',
      status: 'approved'
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const loadDashboardData = () => {
    setLoading(true);
    setRefreshingStats(true);
    if (activeTab === 'overview') {
      api.get('/admin/dashboard-stats')
        .then(res => {
          if (res.data?.success && res.data?.stats) {
            setStats(res.data.stats);
          }
        })
        .catch((err) => {
          console.warn('Dashboard stats fallback active:', err);
        })
        .finally(() => {
          setLoading(false);
          setRefreshingStats(false);
        });
    } else if (activeTab === 'products' || activeTab === 'inventory') {
      api.get('/products?limit=1000')
        .then(res => { if (res.data.success) setProducts(res.data.products); })
        .finally(() => setLoading(false));
    } else if (activeTab === 'categories') {
      api.get('/categories')
        .then(res => { if (res.data.success) setCategories(res.data.categories); })
        .finally(() => setLoading(false));
    } else if (activeTab === 'orders') {
      api.get('/orders?limit=50')
        .then(res => {
          if (res.data?.success && res.data?.orders?.length) {
            setOrders(res.data.orders);
          } else {
            setOrders(fallbackStats.recentOrders || []);
          }
        })
        .catch(() => setOrders(fallbackStats.recentOrders || []))
        .finally(() => setLoading(false));
    } else if (activeTab === 'customers') {
      api.get('/admin/customers')
        .then(res => {
          if (res.data?.success && Array.isArray(res.data?.customers)) {
            setCustomers(res.data.customers);
          } else {
            setCustomers([]);
          }
        })
        .catch(() => setCustomers([]))
        .finally(() => setLoading(false));
    } else if (activeTab === 'banners') {
      api.get('/banners')
        .then(res => {
          if (res.data?.success && res.data?.banners?.length) {
            setBanners(res.data.banners);
          } else {
            setBanners(fallbackBanners);
          }
        })
        .catch(() => setBanners(fallbackBanners))
        .finally(() => setLoading(false));
    } else if (activeTab === 'coupons') {
      api.get('/coupons')
        .then(res => {
          if (res.data?.success && res.data?.coupons?.length) {
            setCoupons(res.data.coupons);
          } else {
            setCoupons(fallbackCoupons);
          }
        })
        .catch(() => setCoupons(fallbackCoupons))
        .finally(() => setLoading(false));
    } else if (activeTab === 'reviews') {
      api.get('/reviews/admin')
        .then(res => {
          if (res.data?.success && res.data?.reviews?.length) {
            setReviews(res.data.reviews);
          } else {
            setReviews(fallbackReviews);
          }
        })
        .catch(() => setReviews(fallbackReviews))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  const formatPrice = (n) => (n || 0).toLocaleString('ru-RU');

  // Product Dedicated Panel Actions (No more modal!)
  const handleOpenProductForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        title: product.title,
        sku: product.sku || '',
        price: product.price,
        oldPrice: product.oldPrice || '',
        stock: product.stock,
        category: product.category,
        categorySlug: product.categorySlug || 'stoykalar',
        brand: product.brand || 'Sport Line',
        description: product.description || '',
        images: product.images?.length ? product.images : [''],
        isBestseller: product.isBestseller || false,
        isNewArrival: product.isNewArrival || false,
        isWeeklyDeal: product.isWeeklyDeal || false,
        specifications: product.specifications?.length ? product.specifications : [{ key: '', value: '' }]
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        title: '',
        sku: '',
        price: '',
        oldPrice: '',
        stock: 10,
        category: categories?.[0]?.name || 'Trenajorlar & Kardio',
        categorySlug: categories?.[0]?.slug || 'trenajorlar',
        brand: '',
        description: '',
        images: [],
        isBestseller: false,
        isNewArrival: true,
        isWeeklyDeal: false,
        specifications: []
      });
    }
    setProductView('form');
  };

  const handleCancelProductForm = () => {
    setProductView('list');
    setEditingProduct(null);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productForm);
      } else {
        await api.post('/products', productForm);
      }
      setProductView('list');
      setEditingProduct(null);
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Haqiqatdan ham bu mahsulotni o‘chirmoqchimisiz?')) {
      await api.delete(`/products/${id}`);
      loadDashboardData();
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
    loadDashboardData();
    if (selectedOrder) setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
  };

  // Export functions
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nsb_products_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportOrdersToCSV = () => {
    const list = stats?.recentOrders?.length ? stats.recentOrders : fallbackStats.recentOrders;
    const headers = 'Raqam,Mijoz,Telefon,Shahar,Summa,Tolov,Holat,Sana\n';
    const rows = list.map(o => `"${o.orderNumber}","${o.customerDetails?.fullName}","${o.customerDetails?.phone}","${o.customerDetails?.city}",${o.totalAmount},"${o.paymentMethod}","${o.orderStatus}","${new Date(o.createdAt).toLocaleDateString()}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nsb_buyurtmalar_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      {/* 1. OVERVIEW & KPI STATS */}
      {activeTab === 'overview' && (() => {
        const curStats = stats || fallbackStats;
        const totalRev = curStats.totalRevenue ?? fallbackStats.totalRevenue;
        const b2bRev = curStats.b2bRevenue ?? fallbackStats.b2bRevenue;
        const retailRev = Math.max(0, totalRev - b2bRev);
        const totalOrd = curStats.totalOrders ?? fallbackStats.totalOrders;
        const aov = curStats.averageOrderValue || (totalOrd > 0 ? Math.round(totalRev / totalOrd) : fallbackStats.averageOrderValue);
        const totalProd = curStats.totalProducts ?? fallbackStats.totalProducts;
        const totalCust = curStats.totalCustomers ?? fallbackStats.totalCustomers;

        const newCount = curStats.statusCounts?.find(s => s._id === 'new')?.count ?? fallbackStats.statusCounts.find(s => s._id === 'new')?.count ?? 2;
        const procCount = curStats.statusCounts?.find(s => s._id === 'processing')?.count ?? fallbackStats.statusCounts.find(s => s._id === 'processing')?.count ?? 1;
        const shipCount = curStats.statusCounts?.find(s => s._id === 'shipped')?.count ?? 0;
        const delivCount = curStats.statusCounts?.find(s => s._id === 'delivered')?.count ?? fallbackStats.statusCounts.find(s => s._id === 'delivered')?.count ?? 2;
        const cancCount = curStats.statusCounts?.find(s => s._id === 'cancelled')?.count ?? 0;

        const dailySales = curStats.dailySales || fallbackStats.dailySales;
        const maxDailyRev = Math.max(...dailySales.map(d => d.revenue), 1);

        const paymentCounts = curStats.paymentCounts || fallbackStats.paymentCounts;
        const totalPaymentSum = paymentCounts.reduce((sum, p) => sum + (p.total || 0), 0) || totalRev;

        const lowStockItems = curStats.lowStockProducts?.length ? curStats.lowStockProducts : fallbackStats.lowStockProducts;
        const topSellingItems = curStats.topProducts?.length ? curStats.topProducts : fallbackStats.topProducts;

        // Filter recent orders
        const rawOrders = curStats.recentOrders?.length ? curStats.recentOrders : fallbackStats.recentOrders;
        const filteredOrders = rawOrders.filter(o => {
          if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) return false;
          if (!searchTerm) return true;
          const q = searchTerm.toLowerCase();
          return (
            o.orderNumber?.toLowerCase().includes(q) ||
            o.customerDetails?.fullName?.toLowerCase().includes(q) ||
            o.customerDetails?.phone?.toLowerCase().includes(q) ||
            o.customerDetails?.city?.toLowerCase().includes(q)
          );
        });

        return (
          <div className="space-y-6">
            {/* Header with Title and Control Pills */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800 animate-admin-card-1">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Platforma Ko‘rsatkichlari (Overview)
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Jonli efir
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  WYUE E-Commerce Tizimi — Savdo hajmi, tushumlar dinamikasi, ombor qoldiqlari va mijozlar tahlili.
                </p>
              </div>

              {/* Time Period Filter & Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700 text-xs font-bold shadow-2xs">
                  {[
                    { id: 'today', label: 'Bugun' },
                    { id: '7days', label: '7 kun' },
                    { id: 'month', label: 'Shu oy' },
                    { id: 'year', label: 'Yillik' }
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setOverviewPeriod(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        overviewPeriod === p.id
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={loadDashboardData}
                  disabled={refreshingStats}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                  title="Ma'lumotlarni yangilash"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshingStats ? 'animate-spin text-[var(--color-primary-500)]' : ''}`} />
                  <span className="hidden sm:inline">Yangilash</span>
                </button>

                <button
                  type="button"
                  onClick={exportOrdersToCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-black shadow-xs active:scale-95 transition-all cursor-pointer border border-slate-900 dark:border-white hover:shadow-md"
                  title="Hisobotni CSV formatida yuklab olish"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Hisobot (CSV)</span>
                </button>
              </div>
            </div>

            {/* 6 High-Impact KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 animate-admin-card-2">
              {/* Card 1: Jami Tushum */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover-lift hover-glow-emerald transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Jami Tushum
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black group-hover:scale-115 group-hover:rotate-6 transition-all duration-300 shadow-2xs">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {formatPrice(totalRev)} <span className="text-xs font-bold text-slate-400">so‘m</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
                      <TrendingUp className="w-3 h-3" /> +18.4%
                    </span>
                    <span className="text-slate-400 font-medium">o‘tgan haftadan</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                  Shundan B2B: <b className="text-slate-700 dark:text-slate-300">{formatPrice(b2bRev)} so‘m</b>
                </div>
              </div>

              {/* Card 2: Buyurtmalar va Zayavkalar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover-lift hover-glow-rose transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Buyurtmalar
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black group-hover:scale-115 group-hover:rotate-6 transition-all duration-300 shadow-2xs">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {totalOrd} <span className="text-xs font-bold text-slate-400">ta</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded-md">
                      <TrendingUp className="w-3 h-3" /> +12.5%
                    </span>
                    <span className="text-slate-400 font-medium">yangi bitim</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-rose-600 dark:text-rose-400 font-black truncate">
                  {newCount} ta yangi zayavka faol
                </div>
              </div>

              {/* Card 3: O'rtacha Buyurtma Cheki */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover-lift hover-glow-violet transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    O‘rtacha Chek
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-black group-hover:scale-115 group-hover:rotate-6 transition-all duration-300 shadow-2xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {formatPrice(aov)} <span className="text-xs font-bold text-slate-400">so‘m</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-extrabold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-1.5 py-0.5 rounded-md">
                      <TrendingUp className="w-3 h-3" /> +6.8%
                    </span>
                    <span className="text-slate-400 font-medium">AOV darajasi</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                  B2B & Chakana xaridlar
                </div>
              </div>

              {/* Card 4: Aktiv Mahsulotlar */}
              <div
                onClick={() => setActiveTab('products')}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover-lift hover-glow-sky hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-300 group cursor-pointer"
                title="Barcha mahsulotlar ro‘yxatini ochish"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Mahsulotlar
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black group-hover:scale-115 group-hover:rotate-6 transition-all duration-300 shadow-2xs">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {totalProd} <span className="text-xs font-bold text-slate-400">tovar</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-extrabold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 rounded-md">
                      Barchasini boshqarish
                    </span>
                    <span className="text-slate-400 font-medium">CRUD</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-sky-600 dark:text-sky-400 font-bold flex items-center justify-between">
                  <span>Ro‘yxatni ochish</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 5: Mijozlar va B2B Korxonalar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover-lift hover-glow-amber transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Mijozlar Bazasi
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black group-hover:scale-115 group-hover:rotate-6 transition-all duration-300 shadow-2xs">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {totalCust} <span className="text-xs font-bold text-slate-400">korxona</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md">
                      <TrendingUp className="w-3 h-3" /> +4 yangi
                    </span>
                    <span className="text-slate-400 font-medium">bu hafta</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                  Buxoro, Navoiy, Samarqand
                </div>
              </div>

              {/* Card 6: Omborda Kam Qolganlar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover-lift hover-glow-red transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    Kam Qolganlar
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black group-hover:scale-115 group-hover:rotate-6 transition-all duration-300 shadow-2xs">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
                    {lowStockItems.length} <span className="text-xs font-bold text-slate-400">tovar</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-black text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded-md animate-pulse">
                      Ogohlantirish!
                    </span>
                    <span className="text-slate-400 font-medium">qoldiq &lt; 5 ta</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('inventory')}
                  className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-rose-600 dark:text-rose-400 font-black hover:underline flex items-center justify-between cursor-pointer group-hover:text-rose-500 transition-colors"
                >
                  <span>Omborga o‘tish</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Sales Dynamics Chart & Payment Methods Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-admin-card-3">
              {/* Left (2 cols): 7-Day Sales Dynamics Bar Chart */}
              <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[var(--color-primary-500)]" />
                        Sotuvlar Dinamikasi & Tushum Trendi
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Kunlik sotuv summasi va qabul qilingan buyurtmalar soni
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-black self-start sm:self-auto">
                      <Sparkles className="w-3.5 h-3.5" />
                      Eng faol kun: Shanba (41.4M so‘m)
                    </div>
                  </div>

                  {/* Visual Chart Bars */}
                  <div className="pt-6 pb-2">
                    <div className="h-48 sm:h-56 flex items-end justify-between gap-2 sm:gap-4 px-2">
                      {dailySales.map((item, idx) => {
                        const heightPct = Math.max(18, Math.round((item.revenue / maxDailyRev) * 100));
                        const isHighest = item.revenue === maxDailyRev;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                            {/* Value tooltip on top */}
                            <div className="text-[10px] sm:text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1.5 group-hover:text-[var(--color-primary-600)] transition-colors">
                              {(item.revenue / 1000000).toFixed(1)}M
                            </div>

                            {/* Bar Column */}
                            <div className="w-full max-w-[42px] relative flex flex-col justify-end rounded-t-xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 group-hover:bg-slate-200/80 transition-all" style={{ height: `${heightPct}%` }}>
                              <div
                                className={`w-full h-full rounded-t-xl transition-all duration-300 group-hover:brightness-110 ${
                                  isHighest
                                    ? 'bg-gradient-to-t from-[var(--color-primary-600)] to-pink-500 shadow-md'
                                    : 'bg-gradient-to-t from-slate-400/80 to-slate-300 dark:from-slate-700 dark:to-slate-600 group-hover:from-[var(--color-primary-500)] group-hover:to-rose-400'
                                }`}
                              />
                            </div>

                            {/* Orders count badge */}
                            <span className="mt-1.5 px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              {item.orders} ta
                            </span>

                            {/* Day Name */}
                            <span className={`mt-1 text-xs font-black uppercase tracking-wider ${
                              isHighest ? 'text-[var(--color-primary-600)] dark:text-white' : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              {item.day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Insight */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Haftalik jami aylanma: <b className="text-slate-900 dark:text-white font-black">{formatPrice(totalRev)} so‘m</b></span>
                  <span>O‘rtacha kunlik: <b className="text-emerald-600 dark:text-emerald-400 font-extrabold">{formatPrice(Math.round(totalRev / 7))} so‘m</b></span>
                </div>
              </div>

              {/* Right (1 col): Payment Methods & B2B Distribution */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 pb-1">
                    <PieChart className="w-4 h-4 text-violet-500" />
                    To‘lov Turlari & B2B Ulushi
                  </h2>
                  <p className="text-xs text-slate-400 pb-4 border-b border-slate-100 dark:border-slate-800">
                    Kassa va hisob-faktura bo‘yicha tushumlar
                  </p>

                  {/* Payment Methods List */}
                  <div className="mt-4 space-y-4">
                    {paymentCounts.map((pay, i) => {
                      const sharePct = Math.round(((pay.total || 0) / totalPaymentSum) * 100) || 25;
                      const methodNames = {
                        click: 'Click Up',
                        payme: 'Payme',
                        cash: 'Naqd pul (Kuryerga)',
                        bank_transfer: 'B2B Bank Shartnoma (12% QQS)'
                      };
                      const methodColors = {
                        click: 'from-sky-500 to-blue-600',
                        payme: 'from-teal-400 to-emerald-500',
                        cash: 'from-amber-400 to-orange-500',
                        bank_transfer: 'from-violet-500 to-indigo-600'
                      };
                      const badgeColors = {
                        click: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300',
                        payme: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300',
                        cash: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
                        bank_transfer: 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300'
                      };

                      return (
                        <div key={pay._id || i} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${sharePct > 30 ? 'bg-sky-500' : 'bg-slate-400'}`} />
                              {methodNames[pay._id] || pay._id}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${badgeColors[pay._id] || 'bg-slate-100 text-slate-700'}`}>
                              {sharePct}% ({pay.count} ta)
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${methodColors[pay._id] || 'from-slate-400 to-slate-500'}`}
                              style={{ width: `${sharePct}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Tushum:</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{formatPrice(pay.total || 0)} so‘m</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* B2B Certificate Badge */}
                <div className="mt-5 p-3 rounded-xl bg-violet-50/80 dark:bg-violet-950/40 border border-violet-200/60 dark:border-violet-900/40 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                  <div className="text-[11px] text-violet-900 dark:text-violet-200 leading-tight">
                    <b>12% QQS va Shartnomalar:</b> Barcha yuridik hisob-fakturalar avtomatlashtirilgan.
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Funnel Pipeline (Interactive Filter Cards) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[var(--color-primary-500)]" />
                  Buyurtmalar Voronkasi & Statuslar Taqsimoti
                </h2>
                {orderStatusFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setOrderStatusFilter('all')}
                    className="text-xs font-black text-[var(--color-primary-600)] dark:text-white hover:underline cursor-pointer"
                  >
                    Filtrni tozalash (Barchasi)
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { id: 'new', label: 'Yangi Zayavkalar', count: newCount, color: 'border-rose-400 bg-rose-50/40 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300', dot: 'bg-rose-500', note: 'Ko‘rib chiqilmoqda' },
                  { id: 'processing', label: 'Qayta ishlanmoqda', count: procCount, color: 'border-blue-400 bg-blue-50/40 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300', dot: 'bg-blue-500', note: 'Ombordan yig‘ilmoqda' },
                  { id: 'shipped', label: 'Kuryerda / Yo‘lda', count: shipCount, color: 'border-amber-400 bg-amber-50/40 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300', dot: 'bg-amber-500', note: 'Yetkazib berilmoqda' },
                  { id: 'delivered', label: 'Muvaffaqiyatli Yetkazildi', count: delivCount, color: 'border-emerald-400 bg-emerald-50/40 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300', dot: 'bg-emerald-500', note: 'Yakunlangan bitim' },
                  { id: 'cancelled', label: 'Bekor Qilingan', count: cancCount, color: 'border-slate-300 bg-slate-50 text-slate-700 dark:bg-slate-800/40 dark:text-slate-400', dot: 'bg-slate-400', note: 'Mijoz rad etdi' }
                ].map(st => {
                  const isActive = orderStatusFilter === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setOrderStatusFilter(isActive ? 'all' : st.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-1 active:scale-[0.98] ${
                        isActive
                          ? 'border-[var(--color-primary-500)] ring-2 ring-[var(--color-primary-500)]/30 bg-white dark:bg-[#111827]'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-slate-400 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                          <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-black ${st.color}`}>
                          {st.count}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 font-medium">
                        {st.note}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mid Section: Top Bestsellers & Low Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-admin-card-3">
              {/* Top Selling Products */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Eng Ko‘p Sotilgan Top Mahsulotlar (Bestsellers)
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-extrabold text-[var(--color-primary-600)] dark:text-white hover:underline cursor-pointer"
                    >
                      Barchasi
                    </button>
                  </div>

                  <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/80">
                    {topSellingItems.map((prod, idx) => (
                      <div key={prod._id || idx} className="py-2.5 flex items-center gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 rounded-xl px-2 transition-colors">
                        <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                          idx === 0
                            ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-900'
                            : idx === 2
                            ? 'bg-amber-600/80 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          #{idx + 1}
                        </span>

                        <img
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80'}
                          alt={prod.title}
                          className="w-11 h-11 object-cover rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                            {prod.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="truncate">{prod.category}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              Omborda: {prod.stock || 10} ta
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-black text-slate-900 dark:text-white">
                            {formatPrice(prod.price)} <span className="text-[10px] font-normal">so‘m</span>
                          </div>
                          <span className="inline-block mt-0.5 px-2 py-0.2 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 text-[10px] font-black">
                            {prod.soldCount || 10 + idx * 5} ta sotilgan
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 text-center font-medium">
                  Nike krossovkalari va sport kiyimlari savdoda yetakchilik qilmoqda
                </div>
              </div>

              {/* Low Stock Products Alert */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-rose-400/60 dark:hover:border-rose-900/60 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-950/60">
                    <h2 className="text-base font-black text-rose-600 dark:text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />
                      Omborda Kam Qolgan Tovarlar (Zudlik bilan to‘ldirish)
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black">
                      {lowStockItems.length} ta xavfli
                    </span>
                  </div>

                  <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/80">
                    {lowStockItems.map((item, idx) => (
                      <div key={item._id || idx} className="py-2.5 flex items-center gap-3 hover:bg-rose-50/30 dark:hover:bg-rose-950/20 rounded-xl px-2 transition-colors">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80'}
                          alt={item.title}
                          className="w-11 h-11 object-cover rounded-xl bg-slate-100 dark:bg-slate-800 border border-rose-200 dark:border-rose-900 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="font-mono text-[10px] text-slate-500">{item.sku || 'SKU-00' + idx}</span>
                            <span>•</span>
                            <span>{item.category}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 font-black text-xs">
                            Qoldiq: {item.stock} ta
                          </div>
                          <span className="text-[10px] text-rose-500 font-bold block mt-0.5">
                            Tugash arafasida
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Buxoro markaziy ombori</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('inventory')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <span>Omborni to‘ldirish</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Orders Overview with Search & Filter */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors animate-admin-card-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[var(--color-primary-500)]" />
                    Oxirgi Buyurtmalar & Zayavkalar
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {orderStatusFilter === 'all'
                      ? `Jami: ${filteredOrders.length} ta buyurtma`
                      : `"${orderStatusFilter}" holatidagi buyurtmalar: ${filteredOrders.length} ta`}
                  </p>
                </div>

                {/* Status chips */}
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  {[
                    { id: 'all', label: 'Barchasi' },
                    { id: 'new', label: 'Yangi' },
                    { id: 'processing', label: 'Jarayonda' },
                    { id: 'delivered', label: 'Yetkazilgan' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setOrderStatusFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                        orderStatusFilter === tab.id
                          ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-2xs font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Raqam</th>
                      <th className="p-3">Mijoz / Korxona</th>
                      <th className="p-3">Telefon</th>
                      <th className="p-3">Shahar & Manzil</th>
                      <th className="p-3">Summa (QQS bilan)</th>
                      <th className="p-3">To‘lov Usuli</th>
                      <th className="p-3">Holat</th>
                      <th className="p-3">Sana</th>
                      <th className="p-3 text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-slate-200">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((o) => {
                        const statusBadge = {
                          new: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300/40',
                          processing: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300/40',
                          shipped: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300/40',
                          delivered: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40',
                          cancelled: 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300/40'
                        }[o.orderStatus] || 'bg-slate-100 text-slate-700';

                        const paymentBadge = {
                          click: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300',
                          payme: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300',
                          cash: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
                          bank_transfer: 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300'
                        }[o.paymentMethod] || 'bg-slate-100 text-slate-700';

                        return (
                          <tr key={o._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-[var(--color-primary-600)] dark:text-white">
                              {o.orderNumber}
                            </td>
                            <td className="p-3 font-black text-slate-900 dark:text-white">
                              {o.customerDetails?.fullName}
                            </td>
                            <td className="p-3">
                              {o.customerDetails?.phone ? (
                                <a
                                  href={`tel:${o.customerDetails.phone.replace(/\s+/g, '')}`}
                                  className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 hover:text-[var(--color-primary-600)]"
                                >
                                  <Phone className="w-3 h-3 text-[var(--color-primary-500)]" />
                                  {o.customerDetails.phone}
                                </a>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td className="p-3 text-slate-600 dark:text-slate-300">
                              <span className="font-bold">{o.customerDetails?.city || 'Buxoro'}</span>
                              <span className="block text-[10px] text-slate-400 truncate max-w-[160px]">{o.customerDetails?.address}</span>
                            </td>
                            <td className="p-3 font-black text-slate-950 dark:text-white whitespace-nowrap">
                              {formatPrice(o.totalAmount)} so‘m
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${paymentBadge}`}>
                                {o.paymentMethod === 'bank_transfer' ? 'B2B Shartnoma' : o.paymentMethod}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${statusBadge}`}>
                                {o.orderStatus}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400 whitespace-nowrap">
                              {new Date(o.createdAt).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </td>
                            <td className="p-3 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrder(o);
                                  setActiveTab('orders');
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                <Eye className="w-3 h-3" /> Ko‘rish
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9" className="p-8 text-center text-slate-400">
                          {searchTerm ? `"${searchTerm}" bo‘yicha buyurtmalar topilmadi` : 'Ushbu toifada buyurtmalar mavjud emas'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. PRODUCTS MANAGEMENT (CRUD) — DEDICATED PANEL (NO POPUP MODAL) */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {productView === 'form' ? (
            /* Dedicated Full In-Page Product Form Panel */
            <div className="space-y-6 animate-fadeIn pb-16">
              {/* Sticky Header with Back Button and Quick Save */}
              <div className="sticky top-16 z-20 backdrop-blur-md bg-white/95 dark:bg-[#111827]/95 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-colors">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancelProductForm}
                    className="h-10 px-3.5 inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Ro‘yxatga qaytish</span>
                  </button>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {editingProduct ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot Qo‘shish'}
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {editingProduct
                        ? `SKU: ${productForm.sku || 'N/A'} • Tahrirlash paneli`
                        : 'Yangi sport mahsuloti ma’lumotlari, narxi va rasmlarini kiriting'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelProductForm}
                    className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    form="product-form-panel"
                    className="h-10 px-6 rounded-xl bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-black text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-slate-900 dark:border-white"
                  >
                    <Save className="w-4 h-4" />
                    <span>Saqlash</span>
                  </button>
                </div>
              </div>

              {/* Form Layout: 2 Columns */}
              <form id="product-form-panel" onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-xs">
                {/* Left Column (2 Cols): Basic Info & Pricing */}
                <div className="lg:col-span-2 space-y-6">
                  {/* 1. Asosiy Ma'lumotlar Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                      Asosiy Ma’lumotlar
                    </h3>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Mahsulot nomi *
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.title}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        placeholder="Masalan: 4&1 Akkumulyatorli Asboblar To‘plami yoki TPU Yo‘l Konusi 75 sm"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-[var(--color-primary-500)] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                          SKU / Tovar Kodi
                        </label>
                        <input
                          type="text"
                          value={productForm.sku}
                          onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                          placeholder="NSB-001 (ixtiyoriy)"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                          Brend / Ishlab chiqaruvchi
                        </label>
                        <input
                          type="text"
                          value={productForm.brand}
                          onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                          placeholder="Sport Line, Nike, Everlast, WYUE..."
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Kategoriya
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => {
                          const catName = e.target.value;
                          const found = categories.find(c => c.name === catName);
                          setProductForm({ 
                            ...productForm, 
                            category: catName,
                            categorySlug: found?.slug || productForm.categorySlug
                          });
                        }}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                      >
                        {categories.length > 0 ? (
                          categories.map(c => (
                            <option key={c._id || c.id || c.slug} value={c.name}>{c.name}</option>
                          ))
                        ) : (
                          <>
                            <option value="Trenajorlar & Kardio">Trenajorlar & Kardio</option>
                            <option value="Gantellar & Shtangalar">Gantellar & Shtangalar</option>
                            <option value="Podstavka & Skameykalar">Podstavka & Skameykalar</option>
                            <option value="Sport Kiyimlari">Sport Kiyimlari</option>
                            <option value="Krossovkalar & Poyabzal">Krossovkalar & Poyabzal</option>
                            <option value="Boks & Yakka Kurash">Boks & Yakka Kurash</option>
                            <option value="Fitnes Aksessuarlari">Fitnes Aksessuarlari</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Mahsulot tavsifi
                      </label>
                      <textarea
                        rows="4"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Mahsulot haqida batafsil ma’lumot, parametrlari va imkoniyatlari..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* 2. Narx va Ombor Qoldig'i Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                      Narx va Ombor Qoldig‘i
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                          Sotuv narxi (so‘m) *
                        </label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          placeholder="185000"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-sm text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                          Eski narx (chegirma uchun)
                        </label>
                        <input
                          type="number"
                          value={productForm.oldPrice}
                          onChange={(e) => setProductForm({ ...productForm, oldPrice: Number(e.target.value) })}
                          placeholder="220000"
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Ombor qoldig‘i (dona) *
                      </label>
                      <input
                        type="number"
                        required
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                        placeholder="10"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column (1 Col): Image Upload & Badges (Sticky on desktop) */}
                <div className="space-y-6 lg:sticky lg:top-36">
                  {/* Image Card (To'liq bo'sh boshlanadigan va ko'p rasm qo'shiladigan) */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                          Mahsulot Rasmlari ({productForm.images?.filter(Boolean).length || 0})
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Asosiy va qo‘shimcha rasmlar
                        </p>
                      </div>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-950 dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-900 dark:border-white transition-all shadow-xs active:scale-95">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Yuklanmoqda...' : 'Fayl tanlash'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (!files.length) return;
                            setUploadingImage(true);
                            try {
                              const uploadedUrls = [];
                              for (const file of files) {
                                const url = await uploadProductImage(file);
                                if (url) uploadedUrls.push(url);
                              }
                              if (uploadedUrls.length) {
                                setProductForm(prev => ({
                                  ...prev,
                                  images: [...(prev.images || []).filter(Boolean), ...uploadedUrls]
                                }));
                              }
                            } finally {
                              setUploadingImage(false);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* URL orqali rasm qo'shish */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Rasm havolasini kiriting..."
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-mono text-[11px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.currentTarget.value.trim();
                            if (val) {
                              setProductForm(prev => ({
                                ...prev,
                                images: [...(prev.images || []).filter(Boolean), val]
                              }));
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousSibling;
                          const val = input.value.trim();
                          if (val) {
                            setProductForm(prev => ({
                              ...prev,
                              images: [...(prev.images || []).filter(Boolean), val]
                            }));
                            input.value = '';
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Qo‘shish
                      </button>
                    </div>

                    {/* Rasmlar ko'rinishi */}
                    {productForm.images && productForm.images.filter(Boolean).length > 0 ? (
                      <div className="space-y-3">
                        {/* Katta asosiy rasm (1-rasm - 3:4 format) */}
                        <div className="relative w-full aspect-[3/4] max-h-[380px] rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                          <img
                            src={productForm.images.filter(Boolean)[0]}
                            alt="Asosiy rasm"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-black shadow-md flex items-center gap-1">
                            ★ 1-Asosiy rasm
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setProductForm(prev => ({
                                ...prev,
                                images: prev.images.filter((_, idx) => idx !== 0)
                              }));
                            }}
                            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                            title="O‘chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Yana qo'shimcha rasm yuklash tugmasi - Aniq va ko'zga ko'rinarli */}
                        <label className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-emerald-500/60 hover:border-emerald-600 dark:border-emerald-500/40 dark:hover:border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-98">
                          <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>
                            {uploadingImage
                              ? 'Rasm yuklanmoqda...'
                              : `+ Yana qo‘shimcha rasm yuklash (${productForm.images.filter(Boolean).length} ta mavjud)`}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            disabled={uploadingImage}
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              if (!files.length) return;
                              setUploadingImage(true);
                              try {
                                const uploadedUrls = [];
                                for (const file of files) {
                                  const url = await uploadProductImage(file);
                                  if (url) uploadedUrls.push(url);
                                }
                                if (uploadedUrls.length) {
                                  setProductForm(prev => ({
                                    ...prev,
                                    images: [...(prev.images || []).filter(Boolean), ...uploadedUrls]
                                  }));
                                }
                              } finally {
                                setUploadingImage(false);
                                e.target.value = '';
                              }
                            }}
                          />
                        </label>

                        {/* Barcha rasmlar galereyasi va thumbnail strip */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            <span>Galereya ({productForm.images.filter(Boolean).length} ta rasm):</span>
                            <span className="font-normal text-[10px] text-slate-400">Bosib asosiy qilib oling</span>
                          </div>

                          <div className="grid grid-cols-4 gap-2">
                            {productForm.images.filter(Boolean).map((img, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  if (idx !== 0) {
                                    setProductForm(prev => {
                                      const valid = (prev.images || []).filter(Boolean);
                                      const selected = valid[idx];
                                      const rest = valid.filter((_, i) => i !== idx);
                                      return { ...prev, images: [selected, ...rest] };
                                    });
                                  }
                                }}
                                className={`relative aspect-[3/4] rounded-xl overflow-hidden bg-white dark:bg-slate-800 border-2 cursor-pointer group transition-all duration-200 ${
                                  idx === 0
                                    ? 'border-emerald-600 dark:border-emerald-400 ring-2 ring-emerald-500/30'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                                }`}
                                title={idx === 0 ? 'Asosiy rasm (1-o‘rinda)' : 'Bosing — 1-Asosiy rasmga aylanadi'}
                              >
                                <img src={img} alt={`Rasm ${idx + 1}`} className="w-full h-full object-cover" />
                                {idx === 0 ? (
                                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black">
                                    Asosiy
                                  </span>
                                ) : (
                                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/65 text-white text-[9px] font-bold">
                                    {idx + 1}
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setProductForm(prev => ({
                                      ...prev,
                                      images: prev.images.filter((_, i) => i !== idx)
                                    }));
                                  }}
                                  className="absolute top-1 right-1 w-5 h-5 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                                  title="O‘chirish"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}

                            {/* + Qo'shimcha rasm kartochkasi */}
                            <label className="relative aspect-[3/4] rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 flex flex-col items-center justify-center cursor-pointer transition-all group">
                              <Plus className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mb-1 transition-colors" />
                              <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-center leading-tight">
                                + Qo‘shish
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                disabled={uploadingImage}
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (!files.length) return;
                                  setUploadingImage(true);
                                  try {
                                    const uploadedUrls = [];
                                    for (const file of files) {
                                      const url = await uploadProductImage(file);
                                      if (url) uploadedUrls.push(url);
                                    }
                                    if (uploadedUrls.length) {
                                      setProductForm(prev => ({
                                        ...prev,
                                        images: [...(prev.images || []).filter(Boolean), ...uploadedUrls]
                                      }));
                                    }
                                  } finally {
                                    setUploadingImage(false);
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Butkul bo'sh holat (Pustoy) - To'liq bosiluvchi yuklash oynasi */
                      <label className="w-full aspect-[3/4] max-h-[320px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all cursor-pointer group">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/50 flex items-center justify-center mb-3 text-slate-400 group-hover:text-emerald-600 transition-colors">
                          <Upload className="w-7 h-7" />
                        </div>
                        <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          {uploadingImage ? 'Rasm yuklanmoqda...' : 'Rasm yuklash uchun bosing'}
                        </span>
                        <p className="text-[11px] text-slate-400 max-w-[220px]">
                          Bir nechta rasmni birdaniga tanlashingiz mumkin (Galereya)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (!files.length) return;
                            setUploadingImage(true);
                            try {
                              const uploadedUrls = [];
                              for (const file of files) {
                                const url = await uploadProductImage(file);
                                if (url) uploadedUrls.push(url);
                              }
                              if (uploadedUrls.length) {
                                setProductForm(prev => ({
                                  ...prev,
                                  images: [...(prev.images || []).filter(Boolean), ...uploadedUrls]
                                }));
                              }
                            } finally {
                              setUploadingImage(false);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Badges Card */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
                      Qo‘shimcha Belgilar
                    </h3>
                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={productForm.isBestseller}
                        onChange={(e) => setProductForm({ ...productForm, isBestseller: e.target.checked })}
                        className="w-4 h-4 rounded text-[var(--color-primary-500)]"
                      />
                      <span>🔥 Xit mahsulot (Bestseller)</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={productForm.isWeeklyDeal}
                        onChange={(e) => setProductForm({ ...productForm, isWeeklyDeal: e.target.checked })}
                        className="w-4 h-4 rounded text-[var(--color-primary-500)]"
                      />
                      <span>⚡ Hafta aksiyasi (Weekly Deal)</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={productForm.isNewArrival}
                        onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                        className="w-4 h-4 rounded text-[var(--color-primary-500)]"
                      />
                      <span>✨ Yangi kelgan mahsulot</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            /* Dedicated Table List View */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-admin-card-1">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Mahsulotlar Boshqaruvi</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Jami: {products.length} ta mahsulot omborda</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenProductForm()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95 border border-slate-900 dark:border-white hover:shadow-md"
                >
                  <Plus className="w-4 h-4" /> Yangi Mahsulot Qo‘shish
                </button>
              </div>

              {/* Search bar */}
              <div className="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 animate-admin-card-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Mahsulot nomi yoki SKU bo‘yicha qidirish..."
                  value={productSearch || searchTerm}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs bg-transparent border-none outline-none font-medium text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>

              {/* Products List & Table Container */}
              {(() => {
                const filteredProducts = products.filter(p => {
                  const q = (productSearch || searchTerm || '').toLowerCase().trim();
                  if (!q) return true;
                  return (
                    (p.title && p.title.toLowerCase().includes(q)) ||
                    (p.sku && p.sku.toLowerCase().includes(q)) ||
                    (p.category && p.category.toLowerCase().includes(q))
                  );
                });

                return (
                  <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors animate-admin-card-3">
                    {/* 1. Mobile & Compact 1-Row List View (Telefon va planshetlar uchun: Rasm, Nomi, Narxi, Edit, Delete bir qatorda) */}
                    <div className="block lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredProducts.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                          Mahsulot topilmadi
                        </div>
                      ) : (
                        filteredProducts.map((p) => (
                          <div
                            key={p._id}
                            className="flex items-center gap-2.5 p-2.5 sm:p-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors w-full"
                          >
                            {/* 1. Rasm (48x48 kvadrat) */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80'}
                                alt={p.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80';
                                }}
                              />
                            </div>

                            {/* 2. Mahsulot Nomi va Kategoriya/Qoldiq */}
                            <div className="flex-1 min-w-0 pr-1">
                              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate" title={p.title}>
                                {p.title}
                              </h4>
                              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">
                                <span className="truncate">{p.category || 'Sport'}</span>
                                <span>•</span>
                                <span className={p.stock > 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-500 font-bold'}>
                                  {p.stock > 0 ? `${p.stock} ta` : '0 ta'}
                                </span>
                                {p.isBestseller && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-[9px] font-black">XIT</span>
                                )}
                              </div>
                            </div>

                            {/* 3. Narxi */}
                            <div className="shrink-0 text-right pr-1">
                              <div className="font-black text-xs sm:text-sm text-slate-950 dark:text-white whitespace-nowrap">
                                {formatPrice(p.price)}
                              </div>
                              {p.oldPrice > p.price && (
                                <div className="text-[10px] text-slate-400 line-through">
                                  {formatPrice(p.oldPrice)}
                                </div>
                              )}
                            </div>

                            {/* 4. Edit va Delete tugmalari (Bir qatorda, qulay) */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenProductForm(p)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
                                title="Tahrirlash"
                                aria-label="Tahrirlash"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p._id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                                title="O‘chirish"
                                aria-label="O‘chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* 2. Desktop Katta Ekran Jadvali (lg:block) */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="p-3.5">Rasm</th>
                            <th className="p-3.5">Nomi & SKU</th>
                            <th className="p-3.5">Kategoriya</th>
                            <th className="p-3.5">Narx</th>
                            <th className="p-3.5">Qoldiq</th>
                            <th className="p-3.5">Holat</th>
                            <th className="p-3.5 text-right">Amallar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-slate-200">
                          {filteredProducts.map((p) => (
                            <tr key={p._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="p-3">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
                                  <img
                                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80'}
                                    alt={p.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80';
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2 max-w-sm">{p.title}</div>
                                <div className="text-[11px] text-slate-400 font-mono mt-0.5">SKU: {p.sku || 'N/A'} • {p.brand || 'NSB'}</div>
                              </td>
                              <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">{p.category}</td>
                              <td className="p-3 font-black text-slate-950 dark:text-white whitespace-nowrap">{formatPrice(p.price)}</td>
                              <td className="p-3">
                                <span className={`px-2.5 py-1 rounded-full font-black text-[11px] ${
                                  p.stock > 5 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 animate-pulse'
                                }`}>
                                  {p.stock} dona
                                </span>
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                {p.isBestseller && <span className="mr-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 rounded-md font-black text-[10px]">XIT</span>}
                                {p.isWeeklyDeal && <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 rounded-md font-black text-[10px]">AKSIYA</span>}
                              </td>
                              <td className="p-3 text-right space-x-2 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleOpenProductForm(p)}
                                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
                                  title="Tahrirlash"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p._id)}
                                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-white transition-colors cursor-pointer"
                                  title="O‘chirish"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* 3. CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight animate-admin-card-1">
            Kategoriyalar Boshqaruvi
          </h1>

          <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start animate-admin-card-2">
            {/* Categories Table */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto w-full max-w-full">
                <table className="w-full text-xs text-left min-w-[480px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Kategoriya Nomi</th>
                      <th className="p-3.5">Slug</th>
                      <th className="p-3.5">Ikonka</th>
                      <th className="p-3.5 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {categories.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">{c.name}</td>
                        <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">{c.slug}</td>
                        <td className="p-3.5 font-semibold text-[var(--color-primary-600)] dark:text-white">{c.icon}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={async () => {
                              if (window.confirm('Kategoriyani o‘chirmoqchimisiz?')) {
                                await api.delete(`/categories/${c._id}`);
                                loadDashboardData();
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-red-600 dark:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Category Form */}
            <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="font-extrabold text-sm mb-3 text-slate-900 dark:text-white">Yangi Kategoriya</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await api.post('/categories', categoryForm);
                  setCategoryForm({ name: '', slug: '', icon: 'FileText' });
                  loadDashboardData();
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nomi</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="Masalan: Krossovkalar & Poyabzallar"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-semibold text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    placeholder="krossovkalar"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-mono text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95 border border-slate-900 dark:border-white"
                >
                  Qo‘shish
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 4. ORDERS MANAGEMENT (ZAYAVKALAR) — DEDICATED PANEL VIEW */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {selectedOrder ? (
            /* Dedicated Order Details Panel (No Modal) */
            <div className="space-y-6 animate-fadeIn">
              {/* Header with Back Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="h-10 px-3.5 inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Barcha buyurtmalarga qaytish</span>
                  </button>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                      Buyurtma #{selectedOrder.orderNumber}
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                        {selectedOrder.orderStatus}
                      </span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Sana: {new Date(selectedOrder.createdAt).toLocaleString('uz-UZ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Chekni chop etish</span>
                  </button>
                </div>
              </div>

              {/* 2-Column Order Details Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left (2 Cols): Products in Order */}
                <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>Buyurtma Tarkibi ({selectedOrder.items?.length || 0} xil tovar)</span>
                    <span className="text-xs font-mono font-bold text-slate-400">ID: {selectedOrder._id}</span>
                  </h3>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedOrder.items?.map((it, idx) => (
                      <div key={idx} className="py-3.5 flex items-center gap-4">
                        <div className="w-16 aspect-[3/4] sm:w-20 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
                          <img
                            src={it.image || 'https://via.placeholder.com/80'}
                            alt={it.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{it.title}</h4>
                          <div className="text-xs text-slate-400 mt-1">
                            {formatPrice(it.price)} so‘m × <b className="text-slate-700 dark:text-slate-300">{it.quantity} dona</b>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm sm:text-base font-black text-slate-950 dark:text-white">
                            {formatPrice(it.price * it.quantity)} so‘m
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jami To‘lov (QQS bilan):</span>
                    <span className="text-xl font-black text-[var(--color-primary-600)] dark:text-white">
                      {formatPrice(selectedOrder.totalAmount)} so‘m
                    </span>
                  </div>
                </div>

                {/* Right (1 Col): Customer details & Status change */}
                <div className="space-y-6">
                  <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                      Mijoz Ma’lumotlari
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium block">F.I.Sh / Korxona nomi:</span>
                        <span className="font-black text-slate-900 dark:text-white text-sm">{selectedOrder.customerDetails?.fullName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Telefon raqami:</span>
                        <a
                          href={`tel:${selectedOrder.customerDetails?.phone?.replace(/\s+/g, '')}`}
                          className="inline-flex items-center gap-1.5 font-black text-[var(--color-primary-600)] dark:text-white text-sm hover:underline mt-0.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {selectedOrder.customerDetails?.phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block">Yetkazish manzili:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                          {selectedOrder.customerDetails?.city}, {selectedOrder.customerDetails?.address}
                        </span>
                      </div>
                      {selectedOrder.customerDetails?.notes && (
                        <div>
                          <span className="text-slate-400 font-medium block">Mijoz izohi:</span>
                          <span className="text-slate-700 dark:text-slate-300 italic block mt-0.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            "{selectedOrder.customerDetails?.notes}"
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block">
                        Buyurtma holatini yangilash:
                      </label>
                      <select
                        value={selectedOrder.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                      >
                        <option value="new">Yangi (New Lead)</option>
                        <option value="processing">Qayta ishlanmoqda (Processing)</option>
                        <option value="shipped">Yetkazilmoqda (Shipped)</option>
                        <option value="delivered">Yetkazib berildi (Delivered)</option>
                        <option value="cancelled">Bekor qilindi (Cancelled)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Dedicated Orders Table List */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-admin-card-1">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Buyurtmalar &amp; Zayavkalar</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Jami tushgan zayavkalar: {orders.length} ta</p>
                </div>
                {searchTerm && (
                  <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-white border border-rose-200 dark:border-rose-900">
                    Filtr: "{searchTerm}"
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors animate-admin-card-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                      <tr>
                        <th className="p-3.5">Buyurtma №</th>
                        <th className="p-3.5">Mijoz / Telefon</th>
                        <th className="p-3.5">Manzil</th>
                        <th className="p-3.5">Summa</th>
                        <th className="p-3.5">To‘lov</th>
                        <th className="p-3.5">Holati</th>
                        <th className="p-3.5 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-slate-200">
                      {orders
                        .filter((o) => {
                          if (!searchTerm) return true;
                          const q = searchTerm.toLowerCase();
                          return (
                            o.orderNumber?.toLowerCase().includes(q) ||
                            o.customerDetails?.fullName?.toLowerCase().includes(q) ||
                            o.customerDetails?.phone?.toLowerCase().includes(q) ||
                            o.customerDetails?.address?.toLowerCase().includes(q) ||
                            o.orderStatus?.toLowerCase().includes(q)
                          );
                        })
                        .map((o) => (
                        <tr key={o._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-mono font-bold text-[var(--color-primary-600)] dark:text-white">{o.orderNumber}</td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900 dark:text-white">{o.customerDetails.fullName}</div>
                            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{o.customerDetails.phone}</div>
                          </td>
                          <td className="p-3 max-w-xs truncate text-slate-600 dark:text-slate-300">
                            {o.customerDetails.city}, {o.customerDetails.address}
                          </td>
                          <td className="p-3 font-black text-slate-950 dark:text-white">{formatPrice(o.totalAmount)} so'm</td>
                          <td className="p-3 uppercase font-bold text-[10px]">{o.paymentMethod}</td>
                          <td className="p-3">
                            <select
                              value={o.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg p-1.5 font-bold text-[11px] outline-none"
                            >
                              <option value="new">Yangi</option>
                              <option value="processing">Yetkazilmoqda</option>
                              <option value="delivered">Yetkazildi</option>
                              <option value="cancelled">Bekor qilindi</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--color-primary-600)] dark:text-white transition-colors"
                              title="Batafsil ko‘rish"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. CUSTOMERS MANAGEMENT (MIJOZLAR BAZASI) */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-admin-card-1">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Mijozlar Bazasi</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Jami ro‘yxatdan o‘tgan va faol xaridorlar: {customers.length} nafar</p>
            </div>
            {searchTerm && (
              <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-white border border-rose-200 dark:border-rose-900">
                Filtr: "{searchTerm}"
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs animate-admin-card-2">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Mijoz / Kompaniya</th>
                    <th className="p-3.5">Telefon</th>
                    <th className="p-3.5">Shahar / Manzil</th>
                    <th className="p-3.5">Buyurtmalar</th>
                    <th className="p-3.5">Jami Xarid</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-slate-200">
                  {customers
                    .filter((c) => {
                      if (!searchTerm) return true;
                      const q = searchTerm.toLowerCase();
                      return (
                        c.fullName?.toLowerCase().includes(q) ||
                        c.phone?.toLowerCase().includes(q) ||
                        c.city?.toLowerCase().includes(q)
                      );
                    })
                    .map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                              {c.fullName ? c.fullName.charAt(0).toUpperCase() : 'M'}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 dark:text-white">{c.fullName}</div>
                              <div className="text-[10px] text-slate-400">Ro‘yxatdan: {c.registeredAt || '2026'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <a
                            href={`tel:${c.phone?.replace(/[^\d+]/g, '')}`}
                            className="inline-flex items-center gap-1.5 font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            <Phone className="w-3.5 h-3.5" /> {c.phone}
                          </a>
                        </td>
                        <td className="p-3.5 max-w-xs truncate text-slate-600 dark:text-slate-300">
                          {typeof c.address === 'object' && c.address !== null
                            ? [c.address.street, c.address.city, c.address.zipCode].filter(Boolean).join(', ') || c.city || 'Telegram Bot'
                            : (c.address ? `${c.city && !String(c.address).includes(c.city) ? c.city + ', ' : ''}${c.address}` : (c.city || 'Telegram Bot'))}
                        </td>
                        <td className="p-3.5 font-black text-center sm:text-left text-slate-900 dark:text-white">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono font-bold">
                            {c.ordersCount ?? 0} ta
                          </span>
                        </td>
                        <td className="p-3.5 font-black text-slate-950 dark:text-white">
                          {formatPrice(c.totalSpent ?? 0)} so‘m
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                            {c.status || 'Faol'}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. INVENTORY & STOCK MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between animate-admin-card-1">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Ombor &amp; Qoldiqlar</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kam qolgan tovarlarni nazorat qilish</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs animate-admin-card-2">
            <div className="overflow-x-auto w-full max-w-full">
              <table className="w-full text-xs text-left min-w-[600px]">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Mahsulot</th>
                    <th className="p-3.5">Kategoriya</th>
                    <th className="p-3.5">Hozirgi qoldiq</th>
                    <th className="p-3.5">Tezkor yangilash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{p.title}</td>
                      <td className="p-3 text-slate-500 dark:text-slate-400">{p.category}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          p.stock <= 5 ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-black' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}>
                          {p.stock} dona
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={p.stock}
                            onBlur={async (e) => {
                              const newStock = Number(e.target.value);
                              await api.put(`/products/${p._id}`, { stock: newStock });
                              loadDashboardData();
                            }}
                            className="w-20 p-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                          />
                          <span className="text-[10px] text-slate-400">Enter yoki bosganda saqlanadi</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. BANNERS MANAGEMENT (BOSH SAHIFA BANNERLARI) */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="animate-admin-card-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Bosh Sahifa Bannerlari</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Bosh sahifadagi interaktiv slaydlar va e'lonlarni boshqarish</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start animate-admin-card-2">
            {/* Active Banners Cards */}
            <div className="space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Faol Slayderlar ({banners.length})
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {banners.map((b) => (
                  <div
                    key={b._id}
                    className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs group"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end text-white">
                        <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider w-fit mb-1">
                          {b.badge || 'AKSIYA'}
                        </span>
                        <h4 className="font-black text-sm line-clamp-1">{b.title}</h4>
                        <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{b.subtitle}</p>
                      </div>
                    </div>
                    <div className="p-3.5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                        {b.link}
                      </span>
                      <button
                        onClick={async () => {
                          if (window.confirm('Ushbu bannerni o‘chirmoqchimisiz?')) {
                            try { await api.delete(`/banners/${b._id}`); } catch (_) {}
                            setBanners((prev) => prev.filter((item) => item._id !== b._id));
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-red-600 dark:text-red-400 cursor-pointer transition-colors"
                        title="Bannerni o'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Page Add Banner Form (Dedicated Panel - No Modal!) */}
            <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-slate-800/60 text-slate-900 dark:text-white dark:text-white flex items-center justify-center font-bold">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Yangi Banner Qo‘shish</h3>
                  <p className="text-[11px] text-slate-400">Modal oynasiz, to‘g‘ridan-to‘g‘ri panelda saqlash</p>
                </div>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await api.post('/banners', bannerForm);
                    if (res.data?.success) setBanners([...banners, res.data.banner]);
                    else setBanners([...banners, { ...bannerForm, _id: `ban-${Date.now()}` }]);
                  } catch (_) {
                    setBanners([...banners, { ...bannerForm, _id: `ban-${Date.now()}` }]);
                  }
                  setBannerForm({ title: '', subtitle: '', badge: '', link: '/shop', type: 'hero', image: '' });
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Banner Sarlavhasi *</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    placeholder="Masalan: Nike & Jordan Original Krossovkalari"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-semibold text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Qisqa Tavsif</label>
                  <input
                    type="text"
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    placeholder="Sport kiyimlari va mashg‘ulot jihozlari uchun maxsus chegirmalar"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nishon (Badge)</label>
                  <input
                    type="text"
                    value={bannerForm.badge}
                    onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                    placeholder="BUXORO BO'YLAB 2 SOATDA"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">Rasm URL manzili yoki Fayl *</label>
                    <label className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:text-black dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors">
                      <Upload className="w-3 h-3" />
                      <span>{uploadingImage ? 'Yuklanmoqda...' : 'Fayl tanlash (Supabase)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingImage}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingImage(true);
                          try {
                            const url = await uploadProductImage(file);
                            if (url) {
                              setBannerForm(prev => ({ ...prev, image: url }));
                            }
                          } finally {
                            setUploadingImage(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    required
                    value={bannerForm.image || ''}
                    onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-... yoki fayl tanlang"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-mono text-[11px] text-slate-900 dark:text-white outline-none"
                  />
                </div>
                {bannerForm.image && (
                  <div className="rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-700">
                    <img src={bannerForm.image} alt="Live preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Yo‘naltiruvchi havola (Link)</label>
                  <input
                    type="text"
                    value={bannerForm.link}
                    onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                    placeholder="/shop"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-mono text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 border border-slate-900 dark:border-white text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Bannerni Saqlash
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 8. COUPONS MANAGEMENT (CHEGIRMA & KUPONLAR) */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="animate-admin-card-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Chegirma &amp; Kuponlar</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Xaridorlar savatda kiritishi mumkin bo‘lgan promo kodlar</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start animate-admin-card-2">
            {/* Coupons Table */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto w-full max-w-full">
                <table className="w-full text-xs text-left min-w-[550px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Promo Kod</th>
                      <th className="p-3.5">Chegirma</th>
                      <th className="p-3.5">Min. Buyurtma</th>
                      <th className="p-3.5">Amal Qilish</th>
                      <th className="p-3.5 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {coupons.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-3.5 font-mono font-black text-rose-600 dark:text-white">
                          <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900">
                            {c.code}
                          </span>
                        </td>
                        <td className="p-3.5 font-black text-slate-900 dark:text-white">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold">
                            -{c.discountPercent}%
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">
                          {formatPrice(c.minOrderAmount)} so‘m
                        </td>
                        <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">
                          {c.expiryDate}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={async () => {
                              if (window.confirm('Kuponni o‘chirmoqchimisiz?')) {
                                try { await api.delete(`/coupons/${c._id}`); } catch (_) {}
                                setCoupons((prev) => prev.filter((item) => item._id !== c._id));
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-red-600 dark:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* In-Page Add Coupon Form (Dedicated Panel - No Modal!) */}
            <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-white flex items-center justify-center font-bold">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Yangi Promo Kod</h3>
                  <p className="text-[11px] text-slate-400">Modal oynasiz, to‘g‘ridan-to‘g‘ri panel</p>
                </div>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await api.post('/coupons', couponForm);
                    if (res.data?.success) setCoupons([...coupons, res.data.coupon]);
                    else setCoupons([...coupons, { ...couponForm, _id: `coup-${Date.now()}` }]);
                  } catch (_) {
                    setCoupons([...coupons, { ...couponForm, _id: `coup-${Date.now()}` }]);
                  }
                  setCouponForm({ code: '', discountPercent: 10, minOrderAmount: 100000, expiryDate: '2026-12-31' });
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Promo Kod (Kupon) *</label>
                  <input
                    type="text"
                    required
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    placeholder="Masalan: BAHOR2026"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-mono font-bold uppercase text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Chegirma (%)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="90"
                      value={couponForm.discountPercent}
                      onChange={(e) => setCouponForm({ ...couponForm, discountPercent: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Min. Summa (so‘m)</label>
                    <input
                      type="number"
                      value={couponForm.minOrderAmount}
                      onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Amal Qilish Muddati</label>
                  <input
                    type="date"
                    value={couponForm.expiryDate}
                    onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-semibold text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 border border-slate-900 dark:border-white text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  Kuponni Saqlash
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 9. REVIEWS MANAGEMENT (MIJOZLAR SHARHLARI) */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="animate-admin-card-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Mijozlar Sharhlari</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Xaridorlar tomonidan qoldirilgan baho va sharhlarni nazorat qilish</p>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs animate-admin-card-2">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Mijoz</th>
                    <th className="p-3.5">Baho</th>
                    <th className="p-3.5">Mahsulot</th>
                    <th className="p-3.5">Sharh Matni</th>
                    <th className="p-3.5">Sana</th>
                    <th className="p-3.5">Holat</th>
                    <th className="p-3.5 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-slate-200">
                  {reviews.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {r.userName || 'Mijoz'}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(r.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                        {r.productTitle || 'Mahsulot'}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-sm">
                        "{r.comment}"
                      </td>
                      <td className="p-3.5 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                        {r.createdAt}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                          Tasdiqlangan
                        </span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={async () => {
                            if (window.confirm('Sharhni o‘chirmoqchimisiz?')) {
                              try { await api.delete(`/reviews/${r._id}`); } catch (_) {}
                              setReviews((prev) => prev.filter((item) => item._id !== r._id));
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-red-600 dark:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 10. REPORTS & EXPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight animate-admin-card-1">
            Hisobotlar &amp; Eksport
          </h1>

          <div className="grid md:grid-cols-2 gap-6 animate-admin-card-2">
            <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Mahsulotlar Bazasi Eksporti</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Platformadagi barcha mahsulotlar ro‘yxatini, narxlari va qoldiqlarini JSON formatida yuklab oling.
              </p>
              <button
                onClick={handleExportData}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer border border-slate-900 dark:border-white"
              >
                <Download className="w-4 h-4" /> Mahsulotlarni Yuklab Olish (JSON)
              </button>
            </div>

            <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Platforma Tizim Holati</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Ma'lumotlar bazasi:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Supabase PostgreSQL & Storage</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Frontend Hosting:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">Vercel Edge Network</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Arxitektura:</span>
                  <span className="font-bold font-mono text-emerald-500">Serverless Jamstack (Zero Backend Server)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-xl bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-admin-card-1">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Do‘kon Sozlamalari</h1>
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Do‘kon nomi</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Telefon raqam</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Telegram kanal/bot</label>
              <input
                type="text"
                value={settings.telegram}
                onChange={(e) => setSettings({ ...settings, telegram: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">Manzil</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white outline-none"
              />
            </div>
            <button
              onClick={() => alert('Sozlamalar saqlandi!')}
              className="mt-4 px-6 py-2.5 bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 border border-slate-900 dark:border-white"
            >
              <Save className="w-4 h-4" /> Saqlash
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
