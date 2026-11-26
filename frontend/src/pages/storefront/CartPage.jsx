import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');

  const currencyLabel = t('product.currency', 'so‘m');
  const formatPrice = (n) => `${(n || 0).toLocaleString('ru-RU').replace(/,/g, ' ')} ${currencyLabel}`;

  const fallbackImage =
    'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=600&auto=format&fit=crop&q=80';

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponError('');
    setCouponMessage('');

    api
      .post('/coupons/validate', { code: couponCode, orderAmount: cartTotal })
      .then((res) => {
        if (res.data.success) {
          setCouponDiscount(res.data.coupon.calculatedDiscount);
          setCouponMessage(`-${formatPrice(res.data.coupon.calculatedDiscount)}`);
        }
      })
      .catch((err) => {
        setCouponError(err.response?.data?.message || 'Error');
        setCouponDiscount(0);
      });
  };

  const finalTotal = Math.max(0, cartTotal - couponDiscount);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
          {t('cart.emptyTitle', 'Savatchangiz bo‘sh')}
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto font-medium">
          {t('cart.emptyDesc', 'Siz hali hech qanday mahsulot tanlamadingiz.')}
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          {t('cart.startShopping', 'Xaridni boshlash')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 transition-colors duration-200">
      <h1 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white mb-6 tracking-tight flex items-center gap-2.5">
        <span>{t('cart.title', 'Savatcha')}</span>
        <span className="text-base font-bold text-slate-400 dark:text-slate-500">({cartItems.length})</span>
      </h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-xs transition-colors">
          {cartItems.map((item) => {
            const imgSrc = (item.images && item.images[0]) || item.image || fallbackImage;
            return (
              <div key={item._id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                {/* Product Info with Full Image */}
                <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                  <Link
                    to={`/product/${item.slug}`}
                    className="relative w-20 aspect-[3/4] sm:w-24 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shrink-0 shadow-2xs group block"
                  >
                    <img
                      src={imgSrc}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                      {item.category || 'Mahsulot'}
                    </div>
                    <Link
                      to={`/product/${item.slug}`}
                      className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 hover:text-slate-950 dark:hover:text-white line-clamp-2 leading-snug transition-colors"
                    >
                      {item.title}
                    </Link>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                </div>

                {/* Quantity Counter + Subtotal + Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80 pt-3 sm:pt-0 shrink-0">
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 cursor-pointer transition-colors active:scale-95"
                      aria-label="Kamaytirish"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-xs font-extrabold text-slate-900 dark:text-white select-none">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 cursor-pointer transition-colors active:scale-95"
                      aria-label="Ko'paytirish"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[110px]">
                    <div className="text-sm sm:text-base font-black text-slate-950 dark:text-white tracking-tight">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                    title={t('cart.clear', 'O‘chirish')}
                    aria-label={t('cart.clear', 'O‘chirish')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Clear Cart & Continue Shopping Bottom Bar */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/shop"
              className="text-slate-950 dark:text-white font-extrabold hover:underline inline-flex items-center gap-1"
            >
              {t('cart.continueShopping', '← Xaridni davom ettirish')}
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-semibold transition-colors cursor-pointer"
            >
              {t('cart.clear', 'Savatchani bo‘shatish')}
            </button>
          </div>
        </div>

        {/* Right: Order Summary + Coupon Code */}
        <div className="space-y-4">
          {/* Coupon Box */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              <span>{t('cart.couponTitle', 'Promokod yoki Kupon')}</span>
            </h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="NSB2026"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-950 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs border border-slate-900 dark:border-slate-700"
              >
                {t('cart.couponApply', 'Qo‘llash')}
              </button>
            </form>
            {couponMessage && (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {couponMessage}
              </p>
            )}
            {couponError && (
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-2">
                {couponError}
              </p>
            )}
          </div>

          {/* Summary Box */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
            <h3 className="font-extrabold text-base text-slate-950 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 tracking-tight">
              {t('cart.summaryTitle', 'Buyurtma hisobi')}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                <span>{t('cart.subtotal', 'Mahsulotlar qiymati')}:</span>
                <span className="font-bold text-slate-950 dark:text-white">{formatPrice(cartTotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>{t('cart.discount', 'Kupon chegirmasi')}:</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                <span>{t('cart.delivery', 'Yetkazib berish (Buxoro sh.)')}:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{t('cart.free', 'Bepul')}</span>
              </div>
              <div className="flex justify-between text-slate-400 dark:text-slate-500 text-[11px]">
                <span>{t('cart.vatIncluded', 'QQS (12%): Narx ichiga kiritilgan')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-200">{t('cart.total', 'Jami to‘lov')}:</span>
              <span className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                {formatPrice(finalTotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout', { state: { couponDiscount } })}
              className="w-full py-3.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-98 font-extrabold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {t('cart.checkout', 'Rasmiylashtirishga o‘tish')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
