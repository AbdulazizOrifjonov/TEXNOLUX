import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  LogOut,
  Package,
  Star,
  CheckCircle2,
  MessageSquare,
  Bell,
  BellRing,
  Camera,
  Trash2,
  ShieldCheck,
  Truck,
  Clock,
  XCircle,
  Sparkles,
  Phone,
  ShoppingBag,
  Settings,
  Check,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProductFeedbackModal from '../../components/storefront/ProductFeedbackModal';
import api, { dataService } from '../../services/api';

const ORDER_STEPS = [
  { key: 'new', label: 'Qabul qilindi' },
  { key: 'processing', label: 'Tayyorlanmoqda' },
  { key: 'shipped', label: 'Yo‘lga chiqdi' },
  { key: 'delivered', label: 'Yetkazildi' }
];

const STATUS_BADGE = {
  new: { label: 'Yangi buyurtma', cls: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60' },
  processing: { label: 'Tayyorlanmoqda', cls: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60' },
  shipped: { label: 'Yo‘lga chiqdi', cls: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60' },
  delivered: { label: 'Yetkazib berildi', cls: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' },
  cancelled: { label: 'Bekor qilindi', cls: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60' }
};

function resizeAvatarFile(file, size = 320) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          const minSide = Math.min(img.width, img.height);
          const sx = Math.max(0, (img.width - minSide) / 2);
          const sy = Math.max(0, (img.height - minSide) / 2);
          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
          resolve(canvas.toDataURL('image/jpeg', 0.86));
        } catch (_) {
          resolve(reader.result);
        }
      };
      img.onerror = () => resolve(reader.result);
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatDateTime(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (_) {
    return String(iso).slice(0, 16);
  }
}

export default function AccountPage() {
  const {
    user,
    guestAvatar,
    login,
    register,
    logout,
    updateProfileAvatar,
    removeProfileAvatar,
    refreshUnreadCount,
    isAdmin
  } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'notifications' | 'settings'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [feedbackProduct, setFeedbackProduct] = useState(null);
  const [avatarStatus, setAvatarStatus] = useState('');
  const [avatarBusy, setAvatarBusy] = useState(false);

  const fileInputRef = useRef(null);

  const tgUser =
    typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe?.user || null : null;

  const activeAvatar =
    user?.avatar ||
    guestAvatar ||
    tgUser?.photo_url ||
    '';

  const displayName =
    user?.name ||
    (tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') : '') ||
    'Mijoz';

  const loadAccountData = () => {
    const userParams = {
      chatId: user?.chatId || '',
      phone: user?.phone || '',
      role: user?.role || ''
    };

    api
      .get('/orders/my-orders', { params: userParams })
      .then((res) => {
        if (res.data.success) setOrders(res.data.orders || []);
      })
      .catch(() => {});

    api
      .get('/notifications', { params: userParams })
      .then((res) => {
        if (res.data.success) setNotifications(res.data.notifications || []);
      })
      .catch(() => {});

    api
      .get('/reviews')
      .then((res) => {
        if (res.data.success) setMyReviews(res.data.reviews || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadAccountData();
    if (typeof window === 'undefined') return undefined;
    const onNotifUpdate = () => loadAccountData();
    window.addEventListener('texnolux-notifications-updated', onNotifUpdate);
    window.addEventListener('focus', onNotifUpdate);
    return () => {
      window.removeEventListener('texnolux-notifications-updated', onNotifUpdate);
      window.removeEventListener('focus', onNotifUpdate);
    };
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        await register(name, email, password, phone);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleAvatarSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAvatarStatus('❌ Faqat rasm faylini tanlang');
      return;
    }
    setAvatarBusy(true);
    setAvatarStatus('Rasm yuklanmoqda...');
    try {
      const dataUrl = await resizeAvatarFile(file, 320);
      await updateProfileAvatar(dataUrl);
      setAvatarStatus('✅ Profil rasmi saqlandi!');
    } catch (_) {
      setAvatarStatus('❌ Rasmni saqlashda xatolik');
    } finally {
      setAvatarBusy(false);
      setTimeout(() => setAvatarStatus(''), 3000);
    }
  };

  const handleAvatarRemove = async () => {
    setAvatarBusy(true);
    await removeProfileAvatar();
    setAvatarBusy(false);
    setAvatarStatus('Profil rasmi o‘chirildi');
    setTimeout(() => setAvatarStatus(''), 2500);
  };

  const handleMarkNotificationRead = (notif) => {
    if (!notif || notif.read) return;
    dataService.markNotificationRead(notif, user);
    setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
    refreshUnreadCount(user);
  };

  const handleMarkAllRead = () => {
    const ids = notifications.flatMap((n) => [n.id, n.semKey]).filter(Boolean);
    dataService.markAllNotificationsRead(ids, user);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    refreshUnreadCount(user);
  };

  const formatPrice = (n) => (n || 0).toLocaleString('ru-RU').replace(/,/g, ' ');

  const isProductReviewed = (productId) =>
    myReviews.some((r) => String(r.productId || r.product_id || '') === String(productId || ''));

  const openFeedbackForItem = (item) => {
    const pid = item.product || item.productId || item.id || item._id;
    setFeedbackProduct({
      _id: pid,
      id: pid,
      title: item.title,
      price: item.price,
      images: item.image ? [item.image] : [],
      category: 'Xarid qilingan mahsulot'
    });
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const activeOrdersCount = orders.filter(
    (o) => !['delivered', 'cancelled'].includes(o.orderStatus || o.order_status)
  ).length;

  const renderOrderStepper = (status) => {
    if (status === 'cancelled') {
      return (
        <div className="mt-3 mb-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>Ushbu buyurtma bekor qilingan</span>
        </div>
      );
    }

    const currentIdx = Math.max(
      0,
      ORDER_STEPS.findIndex((s) => s.key === status)
    );

    return (
      <div className="py-3 px-1">
        <div className="grid grid-cols-4 gap-1 relative">
          {ORDER_STEPS.map((st, idx) => {
            const done = idx <= currentIdx;
            const current = idx === currentIdx;
            return (
              <div key={st.key} className="flex flex-col items-center text-center relative">
                {idx > 0 && (
                  <div
                    className={`absolute top-3 right-1/2 w-full h-0.5 -z-0 ${
                      idx <= currentIdx
                        ? 'bg-emerald-500'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}
                <div
                  className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                    done
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  } ${current ? 'ring-4 ring-emerald-500/20 scale-110' : ''}`}
                >
                  {done ? <Check className="w-3.5 h-3.5 stroke-[2.8]" /> : idx + 1}
                </div>
                <span
                  className={`mt-1.5 text-[10px] leading-tight font-bold ${
                    done ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderOrdersSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600 dark:text-sky-400" />
          Buyurtmalarim va xaridlar ({orders.length})
        </h2>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((o) => {
            const st = o.orderStatus || o.order_status || 'new';
            const isCancelled = st === 'cancelled';
            const badge = STATUS_BADGE[st] || STATUS_BADGE.new;
            return (
              <div
                key={o._id || o.id}
                className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-500 dark:text-slate-400">Buyurtma:</span>
                    <strong className="text-slate-950 dark:text-white font-mono text-sm">
                      {o.orderNumber}
                    </strong>
                    <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {formatDateTime(o.createdAt)}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border w-fit ${badge.cls}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {renderOrderStepper(st)}

                <div className="py-2 divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                  {(o.items || []).map((it, idx) => {
                    const pid = it.product || it.productId || it.id || it._id;
                    const alreadyReviewed = isProductReviewed(pid);
                    return (
                      <div
                        key={idx}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-700 dark:text-slate-300"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {it.image && (
                            <img
                              src={it.image}
                              alt={it.title}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {it.title} × {it.quantity}
                            </div>
                            <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {formatPrice(it.price * it.quantity)} so&apos;m
                            </div>
                          </div>
                        </div>

                        {!isCancelled && pid && (
                          <div className="shrink-0">
                            {alreadyReviewed ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Sharh qoldirilgan
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openFeedbackForItem(it)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[11px] transition-all cursor-pointer shadow-xs active:scale-95"
                              >
                                <Star className="w-3.5 h-3.5 fill-slate-950" />
                                <span>Sharh qoldirish</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
                  <div className="text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3">
                    <span>
                      To‘lov: <strong className="uppercase text-slate-900 dark:text-white">{o.paymentMethod}</strong>
                    </span>
                    {o.customerDetails?.address && (
                      <span className="truncate max-w-xs">
                        Manzil: <strong className="text-slate-800 dark:text-slate-200">{o.customerDetails.city}, {o.customerDetails.address}</strong>
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-black text-slate-950 dark:text-white">
                    Jami: {formatPrice(o.totalAmount)} so&apos;m
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 sm:p-10 text-center bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            Hozircha buyurtmalar mavjud emas
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Birinchi buyurtmangizni rasmiylashtiring — barcha holat o‘zgarishlari, eslatmalar va sharh qoldirish shu yerda ochiladi.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-xs hover:opacity-90 transition-all"
          >
            <span>Do‘kon katalogiga o‘tish</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-500" />
            Buyurtma eslatmalari ({notifications.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Buyurtma qabul qilinganda, yo‘lga chiqqanda va yetkazilganda bu bo‘lim hamda Telegram botga xabar keladi.
          </p>
        </div>

        {unreadNotifications.length > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Barchasini o‘qilgan qilish
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => {
            const isReview = n.type === 'review_reminder';
            const isDelivered = n.status === 'delivered';
            const isShipped = n.status === 'shipped';
            const isCancelled = n.status === 'cancelled';

            return (
              <div
                key={n.id}
                onClick={() => handleMarkNotificationRead(n)}
                className={`rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer ${
                  !n.read
                    ? 'bg-blue-50/60 dark:bg-blue-950/25 border-blue-200 dark:border-blue-800/70 shadow-xs'
                    : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isReview
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                        : isDelivered
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : isShipped
                        ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : isCancelled
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                        : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400'
                    }`}
                  >
                    {isReview ? (
                      <Star className="w-5 h-5" />
                    ) : isDelivered ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isShipped ? (
                      <Truck className="w-5 h-5" />
                    ) : isCancelled ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      <Bell className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400 shrink-0" />
                        )}
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                          {n.title}
                        </h3>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(n.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {n.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {n.orderNumber && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkNotificationRead(n);
                            setActiveTab('orders');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                        >
                          <Package className="w-3 h-3" />
                          <span>Buyurtmani ko‘rish ({n.orderNumber})</span>
                        </button>
                      )}

                      {isReview && n.productId && !isProductReviewed(n.productId) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkNotificationRead(n);
                            openFeedbackForItem({
                              productId: n.productId,
                              title: n.productTitle || 'Mahsulot',
                              price: n.productPrice || 0,
                              image: n.productImage || ''
                            });
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-[11px] font-extrabold text-slate-950 transition-colors cursor-pointer"
                        >
                          <Star className="w-3 h-3 fill-slate-950" />
                          <span>Sharh qoldirish</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            Hozircha yangi eslatmalar yo‘q
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Buyurtma berganingizda hamda administrator buyurtma holatini yangilaganda sizga avtomatik eslatma va Telegram xabari keladi.
          </p>
        </div>
      )}
    </div>
  );

  const renderSettingsSection = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Avatar Manager */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600 dark:text-sky-400" />
          Profil rasmi (Avatar)
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-2xl shrink-0 border border-slate-200 dark:border-slate-700">
            {activeAvatar ? (
              <img src={activeAvatar} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="space-y-2">
            <button
              type="button"
              disabled={avatarBusy}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{activeAvatar ? 'Rasmni almashtirish' : 'Yangi rasm yuklash'}</span>
            </button>
            {activeAvatar && (
              <div>
                <button
                  type="button"
                  disabled={avatarBusy}
                  onClick={handleAvatarRemove}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Rasmni o‘chirish</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tanlangan rasm avtomatik ravishda kvadrat ko‘rinishga moslanadi va profilingiz hamda yuqori menyuda ko‘rsatiladi.
        </p>
      </div>

      {/* Personal Data & Reminder Info */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Hisob va eslatma ma’lumotlari
        </h3>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Ism-familiya:</span>
            <span className="font-bold text-slate-900 dark:text-white">{displayName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Telefon:</span>
            <span className="font-bold font-mono text-slate-900 dark:text-white">
              {user?.phone || 'Kiritilmagan'}
            </span>
          </div>
          {(user?.username || tgUser?.username) && (
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Telegram:</span>
              <span className="font-bold text-blue-600 dark:text-sky-400">
                @{user?.username || tgUser?.username}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-500 dark:text-slate-400">Telegram eslatmalari:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" /> Faol (@ReferalPeople_bot)
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileDashboard = () => (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 transition-colors duration-200">
      {/* Hidden Avatar Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarSelected}
        className="hidden"
        aria-label="Profil rasmini yuklash"
      />

      {/* Sleek Hero Banner Profile Card */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        {/* Decorative Gradient Cover */}
        <div className="relative h-28 sm:h-36 bg-gradient-to-br from-slate-950 via-blue-950 to-emerald-950 overflow-hidden px-5 sm:px-8 py-4 flex items-start justify-between">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.45),_transparent_50%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.35),_transparent_45%)]" />
          <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>TEXNOLUX Shaxsiy Kabinet</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold transition-all cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {unreadNotifications.length > 0
                ? `${unreadNotifications.length} ta yangi eslatma`
                : 'Eslatmalar faol'}
            </span>
          </button>
        </div>

        {/* Overlapping Avatar + Details */}
        <div className="px-5 sm:px-8 pb-6 -mt-12 sm:-mt-14 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Interactive Avatar Box */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full rounded-3xl ring-4 ring-white dark:ring-[#111827] bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-xl overflow-hidden cursor-pointer group"
                  title="Profil rasmini o‘zgartirish"
                >
                  {activeAvatar ? (
                    <img
                      src={activeAvatar}
                      alt={displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <span>{displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={avatarBusy}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-lg flex items-center justify-center border-2 border-white dark:border-[#111827] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  title="Rasm yuklash"
                  aria-label="Rasm yuklash"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                    {displayName}
                  </h1>
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" /> Administrator
                    </span>
                  ) : user?.isTelegramRegistered ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Bot orqali ro‘yxatdan o‘tgan
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {(user?.email || tgUser?.username) && (
                    <span>{user?.email || `@${tgUser?.username}`}</span>
                  )}
                  {user?.phone && (
                    <span className="inline-flex items-center gap-1 font-mono text-slate-700 dark:text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      {user.phone}
                    </span>
                  )}
                  {user?.registeredAt && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      A’zo: {user.registeredAt}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={avatarBusy}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{activeAvatar ? 'Rasmni o‘zgartirish' : 'Profil rasmini qo‘yish'}</span>
                  </button>
                  {activeAvatar && (
                    <button
                      type="button"
                      disabled={avatarBusy}
                      onClick={handleAvatarRemove}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>O‘chirish</span>
                    </button>
                  )}
                  {avatarStatus && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {avatarStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-xs border border-slate-800 dark:border-slate-700"
                >
                  Admin Panelga o‘tish
                </Link>
              )}
              {user && (
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-red-600 dark:text-red-400 text-xs font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Chiqish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Compact Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className="text-left bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:border-blue-400/60 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Buyurtmalar</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-950 dark:text-white">{orders.length} ta</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className="text-left bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:border-indigo-400/60 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Jarayonda</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-950 dark:text-white">{activeOrdersCount} ta</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className="text-left bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:border-amber-400/60 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Eslatmalar</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center relative">
              <Bell className="w-4 h-4" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              )}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-950 dark:text-white">
            {unreadNotifications.length > 0 ? `${unreadNotifications.length} yangi` : `${notifications.length} ta`}
          </div>
        </button>

        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Sharhlarim</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-950 dark:text-white">{myReviews.length} ta</div>
        </div>
      </div>

      {/* Latest Unread Reminder Banner */}
      {unreadNotifications.length > 0 && activeTab !== 'notifications' && (
        <div
          onClick={() => setActiveTab('notifications')}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-blue-50 dark:from-amber-950/30 dark:via-[#111827] dark:to-blue-950/30 border border-amber-200/80 dark:border-amber-800/60 cursor-pointer hover:shadow-xs transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
              <BellRing className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-950 dark:text-white truncate">
                {unreadNotifications[0].title}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                {unreadNotifications[0].message}
              </div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[11px] font-bold shrink-0 w-fit">
            <span>Eslatmalarni ko‘rish</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      )}

      {/* Segmented Navigation Tabs */}
      <div className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-white dark:bg-[#111827] text-slate-950 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Buyurtmalarim</span>
          {orders.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-[10px]">
              {orders.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-white dark:bg-[#111827] text-slate-950 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Eslatmalar</span>
          {unreadNotifications.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black">
              {unreadNotifications.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-white dark:bg-[#111827] text-slate-950 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profil va rasm</span>
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'orders' && renderOrdersSection()}
      {activeTab === 'notifications' && renderNotificationsSection()}
      {activeTab === 'settings' && renderSettingsSection()}

      <ProductFeedbackModal
        isOpen={Boolean(feedbackProduct)}
        onClose={() => setFeedbackProduct(null)}
        product={feedbackProduct}
        canReview={true}
        defaultUserName={displayName}
        onReviewSubmitted={() => loadAccountData()}
      />
    </div>
  );

  if (user || tgUser) {
    return renderProfileDashboard();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 transition-colors duration-200">
      {orders.length > 0 && (
        <div className="space-y-6">
          {renderOrdersSection()}
        </div>
      )}

      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xs transition-colors">
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 text-sm font-bold">
            <button
              onClick={() => { setIsLoginTab(true); setError(''); }}
              className={`flex-1 pb-3 text-center transition-colors border-b-2 cursor-pointer ${
                isLoginTab ? 'border-[var(--color-primary-500)] text-[var(--color-primary-600)] dark:text-white' : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Kirish
            </button>
            <button
              onClick={() => { setIsLoginTab(false); setError(''); }}
              className={`flex-1 pb-3 text-center transition-colors border-b-2 cursor-pointer ${
                !isLoginTab ? 'border-[var(--color-primary-500)] text-[var(--color-primary-600)] dark:text-white' : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Ro‘yxatdan o‘tish
            </button>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-red-600 dark:text-red-400 text-xs font-semibold border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {!isLoginTab && (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Ismingiz *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jamshid Karimov"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 transition-all"
                />
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email manzilingiz *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.uz"
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 transition-all"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Parol *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 transition-all"
              />
            </div>

            {!isLoginTab && (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Telefon raqam</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 transition-all font-mono"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 border border-slate-900 dark:border-white font-extrabold text-sm transition-all shadow-xs cursor-pointer active:scale-95"
            >
              {isLoginTab ? 'Tizimga kirish' : 'Ro‘yxatdan o‘tish'}
            </button>

            {isLoginTab && (
              <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                Admin hisob: <span className="font-mono text-slate-900 dark:text-white font-bold">admin@example.com</span> / <span className="font-mono text-slate-900 dark:text-white font-bold">admin123</span>
              </div>
            )}
          </form>
        </div>
      </div>

      <ProductFeedbackModal
        isOpen={Boolean(feedbackProduct)}
        onClose={() => setFeedbackProduct(null)}
        product={feedbackProduct}
        canReview={true}
        defaultUserName={displayName}
        onReviewSubmitted={() => loadAccountData()}
      />
    </div>
  );
}
