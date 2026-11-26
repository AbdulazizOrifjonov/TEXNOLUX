import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, CreditCard, Truck, ShieldCheck, MapPin, ArrowRight, PenLine, Navigation, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import YandexMapPicker from '../../components/storefront/YandexMapPicker';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const couponDiscount = location.state?.couponDiscount || 0;
  const finalTotal = Math.max(0, cartTotal - couponDiscount);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    city: 'Buxoro shahri',
    address: user?.address?.street || '',
    notes: '',
    paymentMethod: 'click',
    deliveryType: 'standard'
  });

  const [addressMode, setAddressMode] = useState('manual'); // 'manual' | 'map'
  const [apartmentDetail, setApartmentDetail] = useState('');
  const [mapCoords, setMapCoords] = useState(null);
  const [mapLocationUrl, setMapLocationUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  const currencyLabel = t('product.currency', 'so‘m');
  const formatPrice = (n) => `${(n || 0).toLocaleString('ru-RU').replace(/,/g, ' ')} ${currencyLabel}`;

  const handleAddressFromMap = ({ address, city, lat, lon, locationUrl }) => {
    setFormData((prev) => ({
      ...prev,
      city: city || prev.city,
      address: address || prev.address
    }));
    setMapCoords({ lat, lon });
    setMapLocationUrl(locationUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Iltimos, barcha majburiy maydonlarni to‘ldiring!');
      return;
    }

    setLoading(true);
    try {
      const finalAddress =
        addressMode === 'map' && apartmentDetail && !formData.address.includes(apartmentDetail)
          ? `${formData.address}, ${apartmentDetail}`
          : formData.address;

      const tgChatId =
        user?.chatId ||
        (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id
          ? String(window.Telegram.WebApp.initDataUnsafe.user.id)
          : null) ||
        (typeof localStorage !== 'undefined' ? localStorage.getItem('texnolux_tg_id') : null);

      const orderPayload = {
        chatId: tgChatId || null,
        customerDetails: {
          fullName: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          address: finalAddress,
          notes: formData.notes,
          coordinates: mapCoords,
          locationUrl: mapLocationUrl
        },
        items: cartItems.map((item) => ({
          product: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || item.image || ''
        })),
        totalAmount: finalTotal,
        paymentMethod: formData.paymentMethod,
        deliveryType: formData.deliveryType
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        setSuccessOrder(res.data.order);
        clearCart();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-xs border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
          {t('checkout.successTitle', 'Buyurtmangiz qabul qilindi!')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium">
          {t('checkout.orderNumber', 'Buyurtma raqami')}:{' '}
          <strong className="text-[var(--color-primary-600)] dark:text-white font-mono text-base">{successOrder.orderNumber}</strong>
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {t('checkout.successDesc', 'Tez orada operatorimiz siz bilan bog‘lanib, yetkazib berish vaqtini aniqlashtiradi.')}
        </p>

        <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-left text-xs space-y-3 shadow-xs">
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-slate-500 dark:text-slate-400">{t('checkout.fullName', 'Qabul qiluvchi')}:</span>
            <span className="font-bold text-slate-900 dark:text-white">{successOrder.customerDetails.fullName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-slate-500 dark:text-slate-400">{t('checkout.phone', 'Telefon')}:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">{successOrder.customerDetails.phone}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-slate-500 dark:text-slate-400">{t('checkout.address', 'Manzil')}:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {successOrder.customerDetails.city}, {successOrder.customerDetails.address}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-slate-500 dark:text-slate-400">{t('checkout.step3', 'To‘lov usuli')}:</span>
            <span className="font-extrabold uppercase text-[var(--color-primary-600)] dark:text-white">{successOrder.paymentMethod}</span>
          </div>
          <div className="pt-2 flex justify-between text-sm items-baseline">
            <span className="font-bold text-slate-900 dark:text-white">{t('checkout.total', 'Jami to‘lov')}:</span>
            <span className="font-black text-slate-950 dark:text-white text-lg">{formatPrice(successOrder.totalAmount)}</span>
          </div>
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-sm shadow-xs transition-all cursor-pointer active:scale-95"
        >
          {t('checkout.backHome', 'Bosh sahifaga qaytish')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('cart.emptyTitle', 'Savatchangiz bo‘sh')}</h2>
        <Link
          to="/shop"
          className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-xs"
        >
          {t('cart.startShopping', 'Katalogga o‘tish')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-8 pb-24 md:pb-10 transition-colors duration-200">
      <h1 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white mb-6 tracking-tight">
        {t('checkout.title', 'Buyurtmani rasmiylashtirish')}
      </h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Left Form: Details, Address, Payment */}
        <div className="space-y-6">
          {/* Recipient Details */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
            <h2 className="text-base font-extrabold text-slate-950 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-950 dark:bg-slate-700 text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>{t('checkout.step1', 'Qabul qiluvchi ma\'lumotlari')}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('checkout.fullName', 'To‘liq ism-familiyangiz')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Jamshid Karimov"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 transition-all"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('checkout.phone', 'Telefon raqamingiz')} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-4 gap-3">
              <h2 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-slate-950 dark:bg-slate-700 text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>{t('checkout.step2', 'Yetkazib berish manzili')}</span>
              </h2>

              {/* Segmented Mode Switcher: Qo'lda kiritish vs Yandex Maps */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs font-bold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setAddressMode('manual')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    addressMode === 'manual'
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <PenLine className="w-3.5 h-3.5" />
                  <span>{t('checkout.manualMode', 'Qo‘lda kiritish')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAddressMode('map')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    addressMode === 'map'
                      ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t('checkout.mapMode', 'Yandex Maps orqali aniqlash')}</span>
                </button>
              </div>
            </div>

            {/* Address Mode 1: Manual Input */}
            {addressMode === 'manual' && (
              <div className="space-y-3.5 text-xs animate-fadeIn">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('checkout.city', 'Shahar / Tuman')} *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-semibold text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 transition-all cursor-pointer"
                  >
                    <option value="Buxoro shahri">Buxoro shahri</option>
                    <option value="Kogon shahri">Kogon shahri</option>
                    <option value="G‘ijduvon tumani">G‘ijduvon tumani</option>
                    <option value="Vobkent tumani">Vobkent tumani</option>
                    <option value="Jondor tumani">Jondor tumani</option>
                    <option value="Qorako‘l tumani">Qorako‘l tumani</option>
                    <option value="Boshqa viloyatlar">Boshqa viloyat (Pochta)</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      {t('checkout.address', 'Aniq manzil')} *
                    </label>
                    <button
                      type="button"
                      onClick={() => setAddressMode('map')}
                      className="text-[11px] font-bold text-slate-900 dark:text-white hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Xaritadan belgilash</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ibn Sino ko‘chasi, 15-uy"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 transition-all"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('checkout.notes', 'Kuryer uchun qo‘shimcha izoh')}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Qulay yetkazish vaqti yoki qo‘shimcha ko‘rsatmalar..."
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* Address Mode 2: Yandex Maps Interactive Picker */}
            {addressMode === 'map' && (
              <div className="space-y-4 text-xs animate-fadeIn">
                <YandexMapPicker
                  initialCoords={mapCoords}
                  onAddressSelected={handleAddressFromMap}
                  apartmentDetail={apartmentDetail}
                  onApartmentChange={setApartmentDetail}
                />

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('checkout.notes', 'Kuryer uchun qo‘shimcha izoh')}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Darvoza kodi, qulay yetkazish vaqti yoki kuryerga qo‘shimcha ko‘rsatmalar..."
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 transition-all resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
            <h2 className="text-base font-extrabold text-slate-950 dark:text-white mb-4 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-950 dark:bg-slate-700 text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>{t('checkout.step3', 'To‘lov usuli')}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { id: 'click', name: t('checkout.payClick', 'Click orqali to‘lov'), badge: t('checkout.badgeOnline', 'Onlayn') },
                { id: 'payme', name: t('checkout.payPayme', 'Payme orqali to‘lov'), badge: t('checkout.badgeOnline', 'Onlayn') },
                { id: 'cash', name: t('checkout.payCash', 'Kuryerga naqd yoki karta'), badge: t('checkout.badgeDelivery', 'Yetkazilganda') },
                { id: 'bank_transfer', name: t('checkout.payB2b', 'Hisob-faktura (B2B QQS bilan)'), badge: t('checkout.badgeB2b', 'Yuridik shaxslarga') }
              ].map((p) => (
                <label
                  key={p.id}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    formData.paymentMethod === p.id
                      ? 'border-slate-950 dark:border-white bg-slate-100 dark:bg-slate-800/80 font-bold text-slate-950 dark:text-white shadow-2xs ring-1 ring-slate-900/20 dark:ring-white/20'
                      : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#111827]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={p.id}
                      checked={formData.paymentMethod === p.id}
                      onChange={() => setFormData({ ...formData, paymentMethod: p.id })}
                      className="text-slate-950 dark:text-white focus:ring-0"
                    />
                    <span>{p.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold">
                    {p.badge}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary Preview */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5 sticky top-24 transition-colors">
          <h3 className="font-extrabold text-base text-slate-950 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 tracking-tight">
            {t('checkout.orderItems', 'Buyurtma tarkibi')}
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-56 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item._id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="truncate">
                  <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{item.title}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">
                    {item.quantity} x {formatPrice(item.price)}
                  </div>
                </div>
                <span className="font-extrabold text-slate-950 dark:text-white flex-shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
              <span>{t('checkout.subtotal', 'Mahsulotlar jami')}:</span>
              <span className="font-bold text-slate-950 dark:text-white">{formatPrice(cartTotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>{t('checkout.discount', 'Kupon chegirmasi')}:</span>
                <span>-{formatPrice(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
              <span>{t('checkout.delivery', 'Yetkazib berish')}:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{t('checkout.freeBukhara', 'Bepul (Buxoro sh.)')}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-200">{t('checkout.total', 'Jami to‘lov')}:</span>
            <span className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">
              {formatPrice(finalTotal)}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-98 font-extrabold text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? t('checkout.submitting', 'Yuborilmoqda...') : t('checkout.confirm', 'Buyurtmani tasdiqlash')}
          </button>
        </div>
      </form>
    </div>
  );
}
