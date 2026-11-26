import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  GitCompare,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  X,
  ZoomIn,
  Minus,
  Plus,
  Check,
  MessageSquare,
  Lock
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useLanguage } from '../../context/LanguageContext';
import ProductCard from '../../components/storefront/ProductCard';
import ProductFeedbackModal from '../../components/storefront/ProductFeedbackModal';
import api from '../../services/api';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  const { t } = useLanguage();

  const [product, setProduct] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Lightbox Modal state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Interactive Hover Zoom state (oldinga kattalashish)
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const thumbnailContainerRef = useRef(null);
  const thumbnailRefs = useRef([]);
  const detailPointerStartX = useRef(null);
  const detailPointerStartY = useRef(null);
  const detailHasSwipedRef = useRef(false);


  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailRefs.current && thumbnailRefs.current[selectedImage]) {
      thumbnailRefs.current[selectedImage].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [selectedImage]);

  // Cursor position tracking for smooth hover zoom
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  // Product Variants & Options state
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setLoading(true);
    const fetchProduct = async () => {
      try {
        let res;
        try {
          res = await api.get(`/products/slug/${slug}`);
        } catch {
          res = await api.get(`/products/${slug}`);
        }
        if (res.data.success) {
          setProduct(res.data.product);
          setRelated(res.data.related || []);
          setSelectedImage(0);
          setQuantity(1);

          // Initialize variants
          if (res.data.product?.variants && res.data.product.variants.length > 0) {
            const firstVar = res.data.product.variants[0];
            setSelectedVariant(firstVar);
            if (firstVar.colors && firstVar.colors.length > 0) {
              setSelectedColor(firstVar.colors[0]);
            }
          } else {
            setSelectedVariant(null);
            setSelectedColor('');
          }

          // Fetch reviews & buyer review eligibility for this product
          api
            .get(`/reviews?productId=${res.data.product._id}`)
            .then((revRes) => {
              if (revRes.data.success) setReviews(revRes.data.reviews || []);
            })
            .catch(() => {});
          api
            .get(`/reviews/eligibility?productId=${res.data.product._id}`)
            .then((eligRes) => {
              if (eligRes.data.success) setCanReview(Boolean(eligRes.data.canReview));
            })
            .catch(() => setCanReview(false));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Keyboard navigation for Lightbox and Slider (ESC, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!product) return;
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Body scroll lock when Lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  if (loading) {
    return (
      <div className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-16 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[var(--color-primary-500)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('detail.notFound', 'Mahsulot topilmadi')}</h2>
        <Link
          to="/shop"
          className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold text-sm shadow-xs transition-colors"
        >
          {t('detail.backToCatalog', 'Katalogga qaytish')}
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product._id);
  const isCompared = isInCompare(product._id);
  const inCart = cartItems.some((i) => i._id === product._id);

  const currencyLabel = t('product.currency', 'so‘m');
  const formatPrice = (n) => `${(n || 0).toLocaleString('ru-RU').replace(/,/g, ' ')} ${currencyLabel}`;

  const fallbackImage =
    'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=1000&auto=format&fit=crop&q=80';

  // Product gallery images
  const rawImages = (product.images && product.images.length > 0 && product.images.filter((img) => img && img.trim() !== '')) || [fallbackImage];
  const images = rawImages;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };


  const handlePointerDown = (e) => {
    if (images.length <= 1) return;
    if (e.pointerType === 'touch') return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (_) {}
    detailPointerStartX.current = e.clientX;
    detailPointerStartY.current = e.clientY;
    detailHasSwipedRef.current = false;
  };

  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch') return;
    if (detailPointerStartX.current === null || images.length <= 1) return;
    const diffX = e.clientX - detailPointerStartX.current;
    const diffY = e.clientY - (detailPointerStartY.current ?? e.clientY);
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      detailHasSwipedRef.current = true;
    }
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === 'touch') return;
    try {
      if (e.target.hasPointerCapture && e.target.hasPointerCapture(e.pointerId)) {
        e.target.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}

    if (detailPointerStartX.current === null || images.length <= 1) {
      detailPointerStartX.current = null;
      detailPointerStartY.current = null;
      return;
    }
    const diffX = e.clientX - detailPointerStartX.current;
    const diffY = e.clientY - (detailPointerStartY.current ?? e.clientY);

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 20) {
      if (diffX < 0) {
        nextImage();
      } else {
        prevImage();
      }
      detailHasSwipedRef.current = true;
    }
    detailPointerStartX.current = null;
    detailPointerStartY.current = null;
  };

  const handlePointerCancel = (e) => {
    if (e.pointerType === 'touch') return;
    try {
      if (e.target.hasPointerCapture && e.target.hasPointerCapture(e.pointerId)) {
        e.target.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
    detailPointerStartX.current = null;
    detailPointerStartY.current = null;
  };

  const handleTouchStart = (e) => {
    if (images.length <= 1) return;
    const touch = e.touches[0];
    detailPointerStartX.current = touch.clientX;
    detailPointerStartY.current = touch.clientY;
    detailHasSwipedRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (detailPointerStartX.current === null || images.length <= 1) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - detailPointerStartX.current;
    const diffY = touch.clientY - (detailPointerStartY.current ?? touch.clientY);
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      detailHasSwipedRef.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (detailPointerStartX.current === null || images.length <= 1) {
      detailPointerStartX.current = null;
      detailPointerStartY.current = null;
      return;
    }
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - detailPointerStartX.current;
    const diffY = touch.clientY - (detailPointerStartY.current ?? touch.clientY);

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 20) {
      if (diffX < 0) {
        nextImage();
      } else {
        prevImage();
      }
      detailHasSwipedRef.current = true;
    }
    detailPointerStartX.current = null;
    detailPointerStartY.current = null;
  };

  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeOldPrice = selectedVariant ? selectedVariant.oldPrice : product.oldPrice;

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      _id: selectedVariant ? `${product._id}_${selectedVariant.id || selectedVariant.name}` : product._id,
      title: selectedVariant ? `${product.title} (${selectedVariant.name}${selectedColor ? ` - ${selectedColor}` : ''})` : product.title,
      price: activePrice,
      oldPrice: activeOldPrice,
      selectedVariant,
      selectedColor
    };
    addToCart(itemToAdd, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!canReview || !reviewerName || !reviewComment) return;
    setReviewError('');
    api
      .post('/reviews', {
        productId: product._id,
        productTitle: product.title,
        userName: reviewerName,
        rating: reviewRating,
        comment: reviewComment
      })
      .then((res) => {
        if (res.data.success) {
          setReviews([res.data.review, ...reviews]);
          setReviewSuccess(true);
          setReviewComment('');
        } else {
          setReviewError(res.data.message || 'Sharh yuborishda xatolik');
        }
      });
  };

  return (
    <div className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-1.5 flex-wrap font-medium">
        <Link to="/" className="hover:text-[var(--color-primary-600)] transition-colors">
          {t('catalog.breadcrumbHome', 'Bosh sahifa')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link
          to={`/shop/${product.categorySlug || 'boshqa-texnika'}`}
          className="hover:text-[var(--color-primary-600)] transition-colors"
        >
          {t(`cat.${product.categorySlug}`, product.category)}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Info Grid (Gallery + Details) */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 pb-12 border-b border-slate-200 dark:border-slate-800">
        {/* Left: Image Gallery with Interactive Slider & Thumbnails */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 items-start">
          {/* Thumbnails Column (Tayoqsiz silliq vertikal slider + hoverda oldindan ko'rish) */}
          {images.length > 1 && (
            <div className="relative flex flex-col items-center shrink-0 w-full sm:w-20">
              {/* Up Scroll Button for desktop thumbnails */}
              {images.length > 4 && (
                <button
                  type="button"
                  onClick={() => {
                    if (thumbnailContainerRef.current) {
                      thumbnailContainerRef.current.scrollBy({ top: -110, behavior: 'smooth' });
                    }
                  }}
                  className="hidden sm:flex mb-1.5 w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 items-center justify-center transition-all cursor-pointer shadow-xs border border-slate-200 dark:border-slate-700"
                  title="Tepaga"
                  aria-label="Tepaga"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              )}

              {/* Thumbnails list - 100% tayoqsiz, scrollbar yo'q qilingan */}
              <div
                ref={thumbnailContainerRef}
                className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[460px] sm:max-h-[560px] w-full sm:w-20 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 py-0.5"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    ref={(el) => (thumbnailRefs.current[i] = el)}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    onMouseEnter={() => setSelectedImage(i)}
                    className={`group relative w-16 sm:w-20 aspect-square rounded-xl border-2 p-0 bg-white dark:bg-slate-900 overflow-hidden shrink-0 transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg hover:z-10 ${
                      selectedImage === i
                        ? 'border-slate-950 dark:border-white shadow-md ring-2 ring-slate-900/40 dark:ring-white/40 scale-102'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                    aria-label={`${t('detail.photo', 'Rasm')} ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 will-change-transform"
                    />
                  </button>
                ))}
              </div>

              {/* Down Scroll Button for desktop thumbnails */}
              {images.length > 4 && (
                <button
                  type="button"
                  onClick={() => {
                    if (thumbnailContainerRef.current) {
                      thumbnailContainerRef.current.scrollBy({ top: 110, behavior: 'smooth' });
                    }
                  }}
                  className="hidden sm:flex mt-1.5 w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 items-center justify-center transition-all cursor-pointer shadow-xs border border-slate-200 dark:border-slate-700"
                  title="Pastga"
                  aria-label="Pastga"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Main Selected Image - Kvadrat (1:1) va barcha tomoniga to'liq tegib turadi */}
          <div className="relative flex-1 w-full aspect-square rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs group select-none transition-shadow duration-300 hover:shadow-xl">
            {/* Discount Badge */}
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-lg text-xs font-black bg-red-600 text-white shadow-xs pointer-events-none">
                -{product.discountPercent}%
              </span>
            )}

            {/* Image Counter Badge */}
            {images.length > 1 && (
              <div className="absolute top-4 right-4 z-10 bg-slate-950/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs pointer-events-none">
                {selectedImage + 1} / {images.length}
              </div>
            )}

            {/* Click to open Lightbox Modal - Interactive Mouse Follow Zoom with Touch/Mouse Swipe */}
            <div
              onClick={() => {
                if (detailHasSwipedRef.current) {
                  detailHasSwipedRef.current = false;
                  return;
                }
                setIsLightboxOpen(true);
              }}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => {
                setIsZooming(false);
                setZoomPos({ x: 50, y: 50 });
              }}
              onMouseMove={handleMouseMove}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full h-full cursor-zoom-in block overflow-hidden relative touch-pan-y select-none"
              title={t('detail.zoom', 'Kattalashtirib ko‘rish (bosilsa to‘liq ekran)')}
            >
              <div
                className="flex w-full h-full transition-transform duration-500 ease-out will-change-transform"
                style={{ transform: `translateX(-${selectedImage * 100}%)` }}
              >
                {images.map((img, i) => (
                  <div key={i} className="min-w-full w-full h-full shrink-0 flex items-center justify-center bg-white dark:bg-slate-900 overflow-hidden">
                    <img
                      src={img}
                      alt={`${product.title} ${i + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                      style={{
                        transform: isZooming && selectedImage === i ? 'scale(1.55)' : 'scale(1)',
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transition: isZooming ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out'
                      }}
                      className="w-full h-full object-cover will-change-transform"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Left Slider Arrow Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                aria-label={t('detail.prev', 'Oldingisi')}
              >
                <ChevronLeft className="w-5 h-5 text-slate-800 dark:text-slate-200" />
              </button>
            )}

            {/* Right Slider Arrow Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                aria-label={t('detail.next', 'Keyingisi')}
              >
                <ChevronRight className="w-5 h-5 text-slate-800 dark:text-slate-200" />
              </button>
            )}

            {/* Mobile Dots Indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-3 inset-x-0 z-20 flex sm:hidden justify-center items-center gap-1.5 pointer-events-none">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(i);
                    }}
                    className={`transition-all rounded-full pointer-events-auto cursor-pointer ${
                      selectedImage === i
                        ? 'w-4 h-2 bg-[var(--color-primary-500)]'
                        : 'w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-500'
                    }`}
                    aria-label={`Rasm ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Zoom Tooltip Hint in bottom-right */}
            <div className={`absolute bottom-3 right-3 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md shadow-xs transition-all duration-200 ${
              isZooming
                ? 'bg-emerald-600/95 text-white scale-105 shadow-md'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}>
              <ZoomIn className={`w-3.5 h-3.5 ${isZooming ? 'text-white' : 'text-slate-900 dark:text-white'}`} />
              <span>{isZooming ? '2.1x Yaqinlashtirildi' : t('detail.zoom', 'Kattalashtirish')}</span>
            </div>
          </div>
        </div>

        {/* Right: Buy Area & Specs */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
              <span>
                {t('detail.sku', 'SKU')}: <strong className="text-slate-900 dark:text-white font-mono">{product.sku || 'TXL-001'}</strong>
              </span>
              <span>
                {t('detail.brand', 'Brend')}: <strong className="text-slate-950 dark:text-white font-extrabold">{product.brand || 'TEXNOLUX'}</strong>
              </span>
            </div>

            <h1 className="text-xl md:text-3xl font-black text-slate-950 dark:text-white leading-snug tracking-tight">
              {product.title}
            </h1>

            {/* Rating Stars (Clickable only for verified buyers) */}
            <div className="flex flex-wrap items-center gap-3 mt-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              {canReview ? (
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(true)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-transparent hover:border-amber-200 dark:hover:border-amber-800 transition-all cursor-pointer group"
                  title="Mahsulotni baholash va sharh qoldirish"
                >
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(product.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {Number(product.rating || 5.0).toFixed(1)}
                  </span>
                  {reviews.length > 0 && (
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      ({reviews.length} {t('detail.reviewsCount', 'ta sharh')})
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white ml-1 group-hover:underline">
                    + Baholash
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-1 py-1">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(product.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {Number(product.rating || 5.0).toFixed(1)}
                  </span>
                  {reviews.length > 0 && (
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      ({reviews.length} {t('detail.reviewsCount', 'ta sharh')})
                    </span>
                  )}
                </div>
              )}

              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 ml-auto bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-lg">
                ● {t('detail.inStock', 'Omborda mavjud')} ({product.stock})
              </span>
            </div>

            {/* Product Variants (Qalinlik / O‘lcham / Razmer) */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {product.variantLabel || 'Variantni tanlang (Qalinlik / O‘lcham)'}:
                  </span>
                  {selectedVariant && (
                    <span className="text-xs font-extrabold text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]">
                      {selectedVariant.name || selectedVariant.title}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => {
                    const isSelected = selectedVariant && (selectedVariant.id === v.id || selectedVariant.name === v.name);
                    return (
                      <button
                        key={v.id || idx}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(v);
                          if (v.colors && v.colors.length > 0) {
                            setSelectedColor(v.colors[0]);
                          }
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 border-slate-950 dark:border-white shadow-xs scale-102'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                        }`}
                      >
                        <span className="font-extrabold">{v.name || v.title}</span>
                        {v.price && (
                          <span className={`ml-2 text-[11px] font-semibold ${isSelected ? 'opacity-90' : 'text-slate-500 dark:text-slate-400'}`}>
                            {formatPrice(v.price)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Color selection if selected variant has colors */}
                {selectedVariant && selectedVariant.colors && selectedVariant.colors.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                      Mavjud ranglar: <span className="text-slate-900 dark:text-white font-extrabold">{selectedColor || selectedVariant.colors[0]}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedVariant.colors.map((c, cIdx) => {
                        const isColorSelected = selectedColor === c || (!selectedColor && cIdx === 0);
                        return (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => setSelectedColor(c)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                              isColorSelected
                                ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-400 dark:border-emerald-700 ring-1 ring-emerald-400'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Price Box */}
            <div className="mt-5 p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              {activeOldPrice > activePrice && (
                <div className="text-sm line-through text-slate-400 mb-1 font-medium">
                  {formatPrice(activeOldPrice)}
                </div>
              )}
              <div className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                {formatPrice(activePrice)}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-2">
                  {t('product.vat', '(QQS bilan)')}
                </span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-2 font-medium">
                ✓ {t('detail.fastDeliveryToday', 'Buxoro shahri bo‘ylab bugun yetkazib beriladi')}
              </p>
            </div>

            {/* UNIFIED ACTION BUTTONS ROW (All h-12, single-line, rounded-xl) */}
            <div className="mt-6 flex flex-wrap sm:flex-nowrap items-center gap-3">
              {/* Counter (Strict h-12) */}
              <div className="h-12 flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 px-2 shadow-2xs shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors active:scale-95"
                  aria-label="Kamaytirish"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center font-bold text-sm text-slate-900 dark:text-white select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors active:scale-95"
                  aria-label="Ko'paytirish"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button (Strict h-12, whitespace-nowrap) */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="h-12 flex-1 min-w-[170px] inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 active:scale-98 font-bold text-sm whitespace-nowrap transition-all shadow-xs cursor-pointer border border-slate-950 dark:border-white"
              >
                {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                <span>{inCart ? t('product.inCart', 'Savatda') : t('detail.addToCart', 'Savatchaga qo‘shish')}</span>
              </button>

              {/* Buy Now Direct Button (Strict h-12, whitespace-nowrap) */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="h-12 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-98 text-slate-950 dark:text-white font-bold text-sm whitespace-nowrap transition-all cursor-pointer shadow-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center"
              >
                {t('detail.buyNow', 'Bittalab xarid')}
              </button>

              {/* Wishlist Button (Strict h-12 w-12) */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`h-12 w-12 rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-2xs flex items-center justify-center shrink-0 ${
                  isFavorite
                    ? 'text-red-500 fill-red-500 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900'
                }`}
                title={t('product.toWishlist', 'Sevimlilar')}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              {/* Compare Button (Strict h-12 w-12) */}
              <button
                type="button"
                onClick={() => toggleCompare(product)}
                className={`h-12 w-12 rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-2xs flex items-center justify-center shrink-0 ${
                  isCompared
                    ? 'text-slate-950 dark:text-white bg-slate-100 dark:bg-slate-800 border-slate-400'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900'
                }`}
                title={t('header.compare', 'Taqqoslash')}
              >
                <GitCompare className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>{t('detail.fastDelivery', 'Tezkor yetkazish')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>{t('detail.officialWarranty', 'Rasmiy kafolat')}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>{t('detail.returnDays', '14 kun qaytarish')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table & Description */}
      <div className="py-10 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-extrabold text-slate-950 dark:text-white mb-6 tracking-tight">
          {t('detail.specsAndDesc', 'Xususiyatlari va tavsifi')}
        </h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">{t('detail.techParams', 'Texnik parametrlar')}</h3>
            {product.specifications && product.specifications.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs shadow-2xs">
                {product.specifications.map((s, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between p-3 ${idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900/60' : 'bg-white dark:bg-slate-900'}`}
                  >
                    <span className="text-slate-500 dark:text-slate-400">{s.key || s.label || 'Parametr'}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-right">{s.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Standart parametrlar.</p>
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">{t('detail.description', 'Mahsulot tavsifi')}</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              {product.description ||
                'Ushbu mahsulot TEXNOLUX do‘koni tomonidan rasmiy sifat kafolati bilan taklif etiladi.'}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section on Product Page (Shown ONLY when reviews exist) */}
      {reviews.length > 0 && (
        <div className="py-10 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[var(--color-primary-500)]" />
            {t('detail.customerReviews', 'Xaridorlar fikrlari')} ({reviews.length})
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((r, i) => (
              <div key={r.id || r._id || i} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{r.userName}</span>
                  <div className="flex text-amber-400">
                    {[...Array(r.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div className="py-10">
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white mb-6 tracking-tight">
            {t('detail.relatedProducts', 'O‘xshash mahsulotlar')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL (Kengaytirilgan Rasm Ko'rish Oynasi) */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-2xl p-3 sm:p-6 animate-fadeIn select-none"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Always Visible Corner Close Button (Burchakdagi X tugmasi) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            className="fixed top-3 right-3 sm:top-5 sm:right-5 z-[120] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/80 hover:bg-rose-600 text-white border border-white/30 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 hover:scale-105 group"
            title={t('detail.close', 'Yopish (Esc)')}
            aria-label={t('detail.close', 'Yopish')}
          >
            <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* Lightbox Top Header */}
          <div
            className="flex items-center justify-between text-white max-w-[1820px] mx-auto w-full pb-3 border-b border-white/15 pr-14 sm:pr-16 relative z-10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0 pr-4">
              <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-wider text-emerald-400 block mb-0.5">
                {t(`cat.${product.categorySlug}`, product.category)}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-white truncate max-w-[260px] sm:max-w-2xl drop-shadow-sm">
                {product.title}
              </h3>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-mono font-bold text-white bg-white/15 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl border border-white/20 shadow-xs">
                {selectedImage + 1} / {images.length}
              </span>
            </div>
          </div>

          {/* Lightbox Main Stage with Big Image and Nav Buttons (Supports Touch / Mouse Swipe) */}
          <div
            className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden w-full cursor-pointer touch-pan-y select-none"
            onClick={() => {
              if (detailHasSwipedRef.current) {
                detailHasSwipedRef.current = false;
                return;
              }
              setIsLightboxOpen(false);
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Prev Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 sm:left-6 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-90 border border-white/30 shadow-2xl hover:border-white hover:scale-105"
                aria-label={t('detail.prev', 'Oldingisi')}
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5]" />
              </button>
            )}

            {/* Big High-Res Image */}
            <div
              className="max-w-4xl max-h-[72vh] flex items-center justify-center p-2 sm:p-4 cursor-default select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImage]}
                alt={product.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImage;
                }}
                className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl transition-all duration-200 select-none cursor-default"
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 sm:right-6 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-90 border border-white/30 shadow-2xl hover:border-white hover:scale-105"
                aria-label={t('detail.next', 'Keyingisi')}
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnail Strip */}
          {images.length > 1 && (
            <div
              className="max-w-3xl mx-auto w-full pt-3 border-t border-white/15 flex justify-center items-center gap-2.5 sm:gap-3 overflow-x-auto py-2 relative z-10 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(idx);
                  }}
                  className={`w-14 aspect-square sm:w-16 rounded-xl border-2 p-0 bg-white dark:bg-slate-900 overflow-hidden shrink-0 transition-all cursor-pointer ${
                    selectedImage === idx
                      ? 'border-white scale-110 shadow-2xl ring-2 ring-white opacity-100'
                      : 'border-white/30 opacity-60 hover:opacity-100 hover:scale-105 hover:border-white/80'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ⭐⭐⭐⭐⭐ Baholash va Sharh Modali */}
      <ProductFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        product={product}
        canReview={canReview}
        onReviewSubmitted={(newRating, newCount, newRev) => {
          if (newRev) setReviews((prev) => [newRev, ...prev]);
          setProduct((prev) => ({
            ...prev,
            rating: newRating,
            reviewsCount: newCount
          }));
        }}
      />
    </div>
  );
}
