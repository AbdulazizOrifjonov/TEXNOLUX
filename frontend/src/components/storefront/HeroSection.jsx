import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function HeroSection() {
  const { t, lang } = useLanguage();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // 4 Full-Bleed Background Slides for TEXNOLUX Home Appliances
  const slides = [
    {
      id: 'kir-yuvish-main',
      badge: {
        uz: "TEXNOLUX — ISHONCHLI VA BARAKALI",
        ru: "TEXNOLUX — НАДЕЖНАЯ ТЕХНИКА",
        en: "TEXNOLUX — HOME APPLIANCES"
      },
      title: {
        uz: "Avtomat Kir Yuvish Mashinalari",
        ru: "Автоматические Стиральные Машины",
        en: "Automatic Washing Machines"
      },
      desc: {
        uz: "Rulls, LG, Samsung, Artel va Shivaki brendlarining 6 kg dan 12 kg gacha bo‘lgan zamonaviy, tejamkor va shovqinsiz kir yuvish mashinalari.",
        ru: "Современные, экономичные и бесшумные стиральные машины Rulls, LG, Samsung, Artel от 6 до 12 кг с официальной гарантией.",
        en: "Modern, energy-efficient washing machines from Rulls, LG, Samsung, Artel and Shivaki with official warranty."
      },
      image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1400&auto=format&fit=crop&q=85",
      btnPrimaryText: {
        uz: "Kir yuvish mashinalari",
        ru: "Стиральные машины",
        en: "Washing Machines"
      },
      btnPrimaryLink: "/shop?category=kir-yuvish-mashinalari",
      btnSecondaryText: {
        uz: "Barcha mahsulotlar",
        ru: "Все товары",
        en: "All Products"
      },
      btnSecondaryLink: "/shop",
      gradient: "from-slate-950/95 via-slate-900/80 to-black/35"
    },
    {
      id: 'muzlatgichlar-main',
      badge: {
        uz: "NO FROST & INVERTER",
        ru: "NO FROST И ИНВЕРТОР",
        en: "NO FROST REFRIGERATORS"
      },
      title: {
        uz: "Zamonaviy Muzlatgichlar va Morozilniklar",
        ru: "Современные Холодильники и Морозильники",
        en: "Modern Refrigerators & Freezers"
      },
      desc: {
        uz: "No Frost tizimli ikki kamerali muzlatgichlar, vitrinalar va chuqur muzlatkichlar hamyonbop narxlarda.",
        ru: "Двухкамерные холодильники No Frost, витрины и морозильные камеры по выгодным ценам.",
        en: "Double-door No Frost refrigerators, display chillers, and deep freezers at great prices."
      },
      image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=1400&auto=format&fit=crop&q=85",
      btnPrimaryText: {
        uz: "Muzlatgichlar katalogi",
        ru: "Каталог холодильников",
        en: "Browse Fridges"
      },
      btnPrimaryLink: "/shop?category=muzlatgichlar",
      btnSecondaryText: {
        uz: "Barcha mahsulotlar",
        ru: "Все товары",
        en: "All Products"
      },
      btnSecondaryLink: "/shop",
      gradient: "from-[#061326]/95 via-[#0b1f3a]/85 to-black/35"
    },
    {
      id: 'televizorlar-main',
      badge: {
        uz: "4K UHD & SMART TV",
        ru: "4K UHD И SMART TV",
        en: "4K UHD & SMART TV"
      },
      title: {
        uz: "Smart Televizorlar va Audio Tizimlar",
        ru: "Smart Телевизоры и Аудиосистемы",
        en: "Smart TVs & Audio Systems"
      },
      desc: {
        uz: "32 dyumdan 85 dyumgacha Google TV, Android TV va QLED ekranli yorqin televizorlar hamda kalonkalar.",
        ru: "Яркие телевизоры Google TV, Android TV и QLED диагональю от 32 до 85 дюймов и акустика.",
        en: "Crystal-clear 32 to 85 inch Android TV, Google TV, and QLED smart televisions."
      },
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1400&auto=format&fit=crop&q=85",
      btnPrimaryText: {
        uz: "Televizorlar katalogi",
        ru: "Каталог телевизоров",
        en: "Browse TVs"
      },
      btnPrimaryLink: "/shop?category=televizorlar",
      btnSecondaryText: {
        uz: "Barcha aksiyalar",
        ru: "Все товары",
        en: "All Deals"
      },
      btnSecondaryLink: "/shop",
      gradient: "from-[#0a0a14]/95 via-[#131836]/85 to-black/35"
    },
    {
      id: 'konditsionerlar-main',
      badge: {
        uz: "IQLIM TEXNIKASI",
        ru: "КЛИМАТИЧЕСКАЯ ТЕХНИКА",
        en: "CLIMATE CONTROL"
      },
      title: {
        uz: "Inverter Konditsionerlar va Oshxona Texnikasi",
        ru: "Инверторные Кондиционеры и Кухонная Техника",
        en: "Inverter Air Conditioners & Kitchen Appliances"
      },
      desc: {
        uz: "Yozda salqin, qishda issiq saqlovchi 12/18/24 BTU konditsionerlar, gaz plitalar, duxovkalar va changyutgichlar.",
        ru: "Кондиционеры 12/18/24 BTU, газовые плиты, духовки, микроволновки и пылесосы с доставкой.",
        en: "All-season 12/18/24 BTU inverter split air conditioners, ovens, cookers, and home appliances."
      },
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1400&auto=format&fit=crop&q=85",
      btnPrimaryText: {
        uz: "Konditsionerlar",
        ru: "Кондиционеры",
        en: "Air Conditioners"
      },
      btnPrimaryLink: "/shop?category=konditsionerlar",
      btnSecondaryText: {
        uz: "Katalogga o‘tish",
        ru: "Перейти в каталог",
        en: "All Products"
      },
      btnSecondaryLink: "/shop",
      gradient: "from-zinc-950/95 via-slate-950/85 to-black/40"
    }
  ];

  // Extended slides with clones for seamless infinite horizontal slider looping
  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  // Start on index 1 (the first real slide)
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [slideKey, setSlideKey] = useState(0);

  // Active real index for indicator dots and counter (0, 1, 2, 3)
  const realIndex = (currentIndex - 1 + slides.length) % slides.length;

  // Auto-play Slider every 5 seconds with automatic smooth animation
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

  const handleNext = () => {
    if (currentIndex >= slides.length + 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setSlideKey((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setSlideKey((prev) => prev + 1);
  };

  const goToSlide = (targetRealIndex) => {
    setIsTransitioning(true);
    setCurrentIndex(targetRealIndex + 1);
    setSlideKey((prev) => prev + 1);
  };

  // Seamless infinite loop handler
  const handleTransitionEnd = () => {
    if (currentIndex >= slides.length + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    } else if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(slides.length);
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    }
  };

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  const getLoc = (obj) => (typeof obj === 'object' ? obj[lang] || obj.uz : obj);

  return (
    <section className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 md:pt-6 pb-6">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-3.5 min-h-[500px] lg:h-[540px]">
        {/* Main Hero Slider with Infinite Smooth Horizontal Carousel Animation */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative rounded-2xl overflow-hidden shadow-lg select-none group h-full flex flex-col justify-between bg-slate-900"
        >
          {/* Continuous Sliding Track with Hardware Accelerated CSS Transform */}
          <div
            className={`flex h-full w-full will-change-transform ${
              isTransitioning
                ? 'transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]'
                : 'transition-none'
            }`}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((s, idx) => (
              <div
                key={`${s.id}-${idx}`}
                className="relative min-w-full w-full h-full shrink-0 flex flex-col justify-between overflow-hidden"
              >
                {/* Full Bleed Background Image */}
                <img
                  src={s.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark Contrast Gradient Overlays for maximum text readability */}
                <div className={`absolute inset-0 bg-gradient-to-r ${s.gradient}`} />
                <div className="absolute inset-0 bg-black/25" />

                {/* Slide Content Layer */}
                <div className="relative z-10 px-7 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 flex flex-col justify-between h-full">
                  {/* Top Slide Badge */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-black tracking-wider uppercase bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/25 shadow-xs w-fit transition-colors">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      {getLoc(s.badge)}
                    </span>
                  </div>

                  {/* Center Hero Heading & Subtitle */}
                  <div className="my-auto max-w-2xl py-4 sm:py-6">
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight drop-shadow-md">
                      {getLoc(s.title)}
                    </h1>
                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-slate-200/90 max-w-xl leading-relaxed drop-shadow-sm font-medium line-clamp-3">
                      {getLoc(s.desc)}
                    </p>

                    {/* Action CTA Buttons */}
                    <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
                      <Link
                        to={s.btnPrimaryLink}
                        className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 group/btn cursor-pointer active:scale-95"
                      >
                        {getLoc(s.btnPrimaryText)}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>

                      <Link
                        to={s.btnSecondaryLink}
                        className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs sm:text-sm tracking-wide transition-all border border-white/20 cursor-pointer active:scale-95"
                      >
                        {getLoc(s.btnSecondaryText)}
                      </Link>
                    </div>
                  </div>

                  {/* Bottom Trust Indicators */}
                  <div className="pt-3 border-t border-white/15 flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] sm:text-xs font-semibold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{t('hero.delivery', 'Tezkor yetkazish')}</span>
                    </div>
                    <span className="text-white/40">•</span>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                      <span>{t('hero.guarantee', '100% Original kafolat')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Oldingi slayd"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 cursor-pointer active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Keyingi slayd"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 cursor-pointer active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom Interactive Slide Indicators */}
          <div className="absolute bottom-5 right-5 sm:right-8 z-20 flex items-center gap-2">
            {slides.map((_, i) => {
              const isActive = i === realIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToSlide(i)}
                  className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                    isActive ? 'w-10 bg-white/30' : 'w-2 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Slayd ${i + 1}`}
                >
                  {isActive && (
                    <span
                      key={`progress-${realIndex}-${slideKey}`}
                      className="absolute inset-y-0 left-0 bg-white rounded-full animate-slide-progress"
                      style={{
                        animationPlayState: isPaused ? 'paused' : 'running',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Side Promo Tiles (Kir Yuvish & Muzlatgichlar) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 h-full">
          {/* Tile 1: Kir Yuvish Mashinalari */}
          <Link
            to="/shop?category=kir-yuvish-mashinalari"
            className="group relative rounded-2xl p-6 bg-slate-900/90 hover:bg-slate-800/95 border-2 border-slate-700/80 shadow-md flex flex-col justify-between hover:-translate-y-0.5 transition-all"
          >
            <div>
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-sky-400 bg-sky-500/15 px-2.5 py-1 rounded-lg border border-sky-500/30">
                Kir Yuvish Mashinalari
              </span>
              <h3 className="mt-2 text-[19px] font-black tracking-tight text-white leading-snug">
                Avtomat &amp; Inverter Kir Yuvish Mashinalari
              </h3>
              <p className="mt-1 text-[12px] text-slate-300 line-clamp-2">
                6 kg dan 12 kg gacha Rulls, LG, Samsung va Artel brendlarining rasmiy kafolatli modellari.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between">
              <span className="text-[13px] font-bold text-white group-hover:underline inline-flex items-center gap-1">
                Katalogga o‘tish <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
              </span>
              <span className="text-[13px] font-black text-sky-400">
                TEXNOLUX
              </span>
            </div>
          </Link>

          {/* Tile 2: Muzlatgichlar & Konditsionerlar */}
          <Link
            to="/shop?category=muzlatgichlar"
            className="group relative rounded-2xl p-6 bg-slate-900/90 hover:bg-slate-800/95 border-2 border-slate-700/80 shadow-md flex flex-col justify-between hover:-translate-y-0.5 transition-all"
          >
            <div>
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                Muzlatgich &amp; Iqlim
              </span>
              <h3 className="mt-2 text-[19px] font-black tracking-tight text-white leading-snug">
                No Frost Muzlatgichlar &amp; Konditsionerlar
              </h3>
              <p className="mt-1 text-[12px] text-slate-300 line-clamp-2">
                Uy va ofis uchun tejamkor No Frost muzlatgichlar hamda qish-yoz invertor konditsionerlar.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between">
              <span className="text-[13px] font-bold text-emerald-300 group-hover:underline inline-flex items-center gap-1">
                Batafsil ko‘rish <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </span>
              <span className="text-[13px] font-black text-emerald-400">
                100% Kafolat
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
