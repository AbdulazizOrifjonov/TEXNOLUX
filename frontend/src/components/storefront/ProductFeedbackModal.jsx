import React, { useState, useEffect } from 'react';
import { Star, X, Check, Sparkles, Send, Loader2, Lock } from 'lucide-react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function ProductFeedbackModal({
  isOpen,
  onClose,
  product,
  canReview = false,
  defaultUserName = '',
  onReviewSubmitted
}) {
  const { t, lang } = useLanguage();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState(defaultUserName);
  const [userEmail, setUserEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultUserName && !userName) {
      setUserName(defaultUserName);
    }
  }, [defaultUserName, isOpen]);

  if (!isOpen || !product) return null;

  const fallbackImage =
    'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80';

  const imageSrc =
    (product.images && product.images[0]) || product.image || fallbackImage;

  const currencyLabel = t('product.currency', 'so‘m');
  const formatPrice = (num) =>
    `${(num || 0).toLocaleString('ru-RU').replace(/,/g, ' ')} ${currencyLabel}`;

  const ratingDescriptions = {
    uz: {
      5: "A’lo darajada! Juda tavsiya qilaman",
      4: "Yaxshi, menga yoqdi",
      3: "O‘rtacha, kutganimdek",
      2: "Qoniqarsiz, kamchiliklari bor",
      1: "Yomon, tavsiya qilmayman"
    },
    ru: {
      5: "Отлично! Очень рекомендую",
      4: "Хорошо, мне понравилось",
      3: "Нормально, как и ожидал",
      2: "Неудовлетворительно",
      1: "Плохо, не рекомендую"
    },
    en: {
      5: "Excellent! Highly recommended",
      4: "Good, I liked it",
      3: "Average, as expected",
      2: "Unsatisfactory",
      1: "Poor, do not recommend"
    }
  };

  const quickTagsByLang = {
    uz: ["A'lo sifat 👍", "Tez yetkazib berish 🚀", "100% Original 💎", "Narxi ma'qul 💰", "Maza qilib ishlatyapman ✨"],
    ru: ["Отличное качество 👍", "Быстрая доставка 🚀", "100% Оригинал 💎", "Доступная цена 💰", "Пользуюсь с удовольствием ✨"],
    en: ["Top Quality 👍", "Fast Delivery 🚀", "100% Original 💎", "Great Value 💰", "Highly Satisfied ✨"]
  };

  const currentDescMap = ratingDescriptions[lang] || ratingDescriptions.uz;
  const currentQuickTags = quickTagsByLang[lang] || quickTagsByLang.uz;

  const texts = {
    uz: {
      title: "Mahsulotni baholash va sharh",
      subtitle: "Sizning fikringiz boshqa xaridorlar uchun juda muhim!",
      rateLabel: "Bahoingizni belgilang:",
      quickFeedback: "Tezkor fikrlar (bosing):",
      nameLabel: "Ismingiz *",
      namePlaceholder: "Masalan: Bekzod",
      contactLabel: "Telefon / Email (ixtiyoriy)",
      contactPlaceholder: "+998 90 123 45 67",
      commentLabel: "Fikr-mulohazangiz yoki sharhingiz *",
      commentPlaceholder: "Mahsulot sifati, yetkazilishi va xizmat haqida o'z fikringizni yozing...",
      cancel: "Bekor qilish",
      submit: "Sharhni yuborish",
      submitting: "Yuborilmoqda...",
      successTitle: "Katta rahmat!",
      successDesc: "Sizning bahongiz va sharhingiz muvaffaqiyatli qabul qilindi va mahsulot sahifasida aks etadi.",
      errorName: "Iltimos, ismingizni kiriting",
      errorComment: "Iltimos, fikr-mulohazangizni yozing"
    },
    ru: {
      title: "Оценка и отзыв о товаре",
      subtitle: "Ваш отзыв очень важен для других покупателей!",
      rateLabel: "Укажите вашу оценку:",
      quickFeedback: "Быстрые отзывы (нажмите):",
      nameLabel: "Ваше имя *",
      namePlaceholder: "Например: Бекзод",
      contactLabel: "Телефон / Email (необязательно)",
      contactPlaceholder: "+998 90 123 45 67",
      commentLabel: "Ваш отзыв или комментарий *",
      commentPlaceholder: "Напишите ваше мнение о качестве, доставке и обслуживании...",
      cancel: "Отмена",
      submit: "Отправить отзыв",
      submitting: "Отправка...",
      successTitle: "Большое спасибо!",
      successDesc: "Ваша оценка и отзыв успешно приняты и будут отображены на странице товара.",
      errorName: "Пожалуйста, введите ваше имя",
      errorComment: "Пожалуйста, напишите ваш отзыв"
    },
    en: {
      title: "Rate Product & Review",
      subtitle: "Your feedback is very important to other shoppers!",
      rateLabel: "Select your rating:",
      quickFeedback: "Quick feedback (tap to add):",
      nameLabel: "Your Name *",
      namePlaceholder: "E.g. Bekzod",
      contactLabel: "Phone / Email (optional)",
      contactPlaceholder: "+998 90 123 45 67",
      commentLabel: "Your Review / Feedback *",
      commentPlaceholder: "Share your thoughts on quality, delivery, and overall experience...",
      cancel: "Cancel",
      submit: "Submit Review",
      submitting: "Submitting...",
      successTitle: "Thank you!",
      successDesc: "Your rating and feedback have been successfully submitted and will appear on the product page.",
      errorName: "Please enter your name",
      errorComment: "Please write your review"
    }
  };

  const ui = texts[lang] || texts.uz;

  const handleAddTag = (tag) => {
    if (comment.includes(tag)) return;
    setComment((prev) => (prev ? `${prev} • ${tag}` : tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError(ui.errorName);
      return;
    }
    if (!comment.trim()) {
      setError(ui.errorComment);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const res = await api.post('/reviews', {
        productId: product._id,
        productTitle: product.title,
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        rating: Number(rating),
        comment: comment.trim()
      });

      if (res.data.success) {
        setSuccess(true);
        if (onReviewSubmitted) {
          onReviewSubmitted(res.data.newRating || rating, res.data.newReviewsCount, res.data.review);
        }
        setTimeout(() => {
          setSuccess(false);
          setComment('');
          onClose();
        }, 1800);
      } else {
        setError(res.data.message || 'Faqat mahsulotni sotib olgan mijozlar sharh qoldirishi mumkin.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-200 scale-100 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-500 shadow-xs">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                {ui.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {ui.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {!canReview ? (
          <div className="p-7 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-500 flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              Faqat xaridorlar uchun
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto font-medium leading-relaxed">
              Faqat ushbu mahsulotni sotib olgan mijozlargina baho va sharh qoldirishi mumkin.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-extrabold cursor-pointer"
            >
              Tushunarli
            </button>
          </div>
        ) : success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-500 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              {ui.successTitle}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto font-medium">
              {ui.successDesc}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Product Mini Preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden">
                <img
                  src={imageSrc}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {product.category || 'Mahsulot'}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {product.title}
                </div>
                <div className="text-[11px] font-extrabold text-[var(--color-primary-600)] dark:text-white">
                  {formatPrice(product.price)}
                </div>
              </div>
            </div>

            {/* Star Rating Selection */}
            <div className="text-center py-2 bg-slate-50/60 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {ui.rateLabel}
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= activeRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-slate-300 dark:text-slate-600 hover:scale-125 transition-all cursor-pointer focus:outline-none"
                      aria-label={`${star} yulduz`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                            : 'text-slate-300 dark:text-slate-600 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="text-[12px] font-extrabold text-amber-500 mt-1">
                {currentDescMap[activeRating]}
              </div>
            </div>

            {/* Quick Tag Pills */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-slate-700 dark:text-slate-300" /> {ui.quickFeedback}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentQuickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* User Details Inputs */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {ui.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={ui.namePlaceholder}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {ui.contactLabel}
                </label>
                <input
                  type="text"
                  placeholder={ui.contactPlaceholder}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {ui.commentLabel}
              </label>
              <textarea
                required
                rows={3}
                placeholder={ui.commentPlaceholder}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-400 outline-none transition-all resize-none"
              />
            </div>

            {error && (
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {ui.cancel}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95 font-extrabold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> {ui.submitting}
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> {ui.submit}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
