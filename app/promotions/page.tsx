'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, ChevronLeft, Gift, Percent, Truck, Heart } from 'lucide-react';

import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { MOCK_PRODUCTS } from '@/lib/data';


export default function PromotionsPage() {
  const hotDeals = MOCK_PRODUCTS.filter(p => p.onSale);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const slides = [
    {
      id: 1,
      badge: "Грандиозный Сейл",
      badgeBg: "bg-orange-500",
      badgeIcon: <Percent className="w-3.5 h-3.5" />,
      title: (
        <>
          Суперскидки до –30% <br /> на здоровье лапок!
        </>
      ),
      subtitle: "Сроки акции ограничены! Дарите питомцам заботу по сниженным ценам. Вся линейка сертифицирована.",
      expiration: "Действует до 30 июня 2026 г.",
      expireBg: "bg-orange-100 text-orange-850 border-orange-200",
      background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
      borderClass: 'border-orange-100',
      illustrationShellClass: 'bg-white/80 border-orange-200/80 text-orange-500 shadow-[0_20px_60px_-20px_rgba(234,88,12,0.35)]',
      illustration: (
        <Percent className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24" strokeWidth={2.2} absoluteStrokeWidth />
      )
    },
    {
      id: 2,
      badge: "Экспресс-Доставка",
      badgeBg: "bg-emerald-600",
      badgeIcon: <Gift className="w-3.5 h-3.5" />,
      title: (
        <>
          Бесплатная доставка <br /> при заказе от 1500 ₽!
        </>
      ),
      subtitle: "Привезем прямо к вашей двери со скоростью виляния хвостика. Качественная упаковка и бережное отношение.",
      expiration: "Постоянная акция зоомаркета",
      expireBg: "bg-emerald-100 text-emerald-850 border-emerald-200",
      background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
      borderClass: 'border-emerald-100',
      illustrationShellClass: 'bg-white/80 border-emerald-200/80 text-emerald-600 shadow-[0_20px_60px_-20px_rgba(5,150,105,0.32)]',
      illustration: (
        <Truck className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24" strokeWidth={2.1} absoluteStrokeWidth />
      )
    },
    {
      id: 3,
      badge: "Время играть",
      badgeBg: "bg-sky-500",
      badgeIcon: <Sparkles className="w-3.5 h-3.5" />,
      title: (
        <>
          Купи игрушку — <br /> верни хвостику радость!
        </>
      ),
      subtitle: "При покупке развивающих интерактивных игрушек скидка 20% на весь ассортимент. Питомцы будут в восторге!",
      expiration: "Действует до 15 июля 2026 г.",
      expireBg: "bg-sky-100 text-sky-850 border-sky-200",
      background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
      borderClass: 'border-sky-100',
      illustrationShellClass: 'bg-white/80 border-sky-200/80 text-sky-500 shadow-[0_20px_60px_-20px_rgba(2,132,199,0.32)]',
      illustration: (
        <Gift className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24" strokeWidth={2.1} absoluteStrokeWidth />
      )
    }
  ];

  const [timerDuration, setTimerDuration] = React.useState(10000);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    setTimerDuration(15000);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimerDuration(10000);
    }, timerDuration);
    return () => clearTimeout(timer);
  }, [currentSlide, timerDuration, slides.length]);


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">

        {/* Back Link Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-500 font-comfortaa transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Назад в каталог</span>
          </Link>
        </div>

        {/* 1. Hero Banner Carousel with dots */}
        <div className="relative overflow-hidden rounded-[24px] shadow-aibolit h-[440px] sm:h-[340px] md:h-[300px] mb-4">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.55 }}
              className={`absolute inset-0 p-6 sm:p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 border ${slides[currentSlide].borderClass}`}
              style={{ background: slides[currentSlide].background }}
            >
              <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4 text-left flex flex-col items-start justify-center h-full">
                <div className={`inline-flex items-center gap-2 ${slides[currentSlide].badgeBg} text-white font-bold text-[10px] px-3.5 py-1 rounded-full font-comfortaa uppercase tracking-widest shadow-sm`}>
                  {slides[currentSlide].badgeIcon}
                  <span>{slides[currentSlide].badge}</span>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-stone-950 font-comfortaa leading-tight">
                  {slides[currentSlide].title}
                </h1>

                <p className="text-xs sm:text-sm text-stone-700 font-inter leading-relaxed max-w-md">
                  {slides[currentSlide].subtitle}
                </p>

                {/* Expire date indicator */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-sans text-xs font-bold border ${slides[currentSlide].expireBg}`}>
                  <Calendar className="w-4 h-4" />
                  <span>{slides[currentSlide].expiration}</span>
                </div>
              </div>

              {/* Illustration in the Corner */}
              <div
                className={`absolute right-4 bottom-4 opacity-20 sm:relative sm:opacity-100 sm:right-0 sm:bottom-0 shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 p-3 rounded-[32px] border backdrop-blur-sm overflow-hidden flex items-center justify-center ${slides[currentSlide].illustrationShellClass}`}
              >
                {slides[currentSlide].illustration}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {slides.map((_, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDotClick(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer border-0 outline-none ${isActive ? 'w-8 bg-orange-500 shadow-sm' : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                  }`}
                aria-label={`Слайд ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* 2. "Hot Deals" Section: Product cards with the old price crossed out and new price */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-comfortaa tracking-tight">
              Горячие предложения недели
            </h2>
          </div>

          {(() => {
            // Split hot deals into chunks of 16 items (4 rows on xl screen)
            const productChunks: typeof hotDeals[] = [];
            const chunkSize = 16;
            for (let i = 0; i < hotDeals.length; i += chunkSize) {
              productChunks.push(hotDeals.slice(i, i + chunkSize));
            }

            const promoBanners = [
              {
                id: "promo-ins-1",
                badge: "ВИТАМИННЫЙ БУМ",
                badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
                title: "Здоровые суставы и сияющая шерсть",
                subtitle: "Скидки до -25% на комплексные витамины, пребиотики, рыбий жир и полезные лакомства для кошек и собак. Поддержите иммунитет любимца!",
                bgGradient: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                borderClass: "border-amber-200",
                badgeIcon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
                illustration: (
                  <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 text-amber-600 opacity-90">
                    <rect x="35" y="25" width="30" height="55" rx="8" fill="currentColor" opacity="0.2" />
                    <circle cx="50" cy="40" r="12" fill="currentColor" opacity="0.4" />
                    <path d="M44,40 L56,40 M50,34 L50,46" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="50" cy="65" r="5" fill="currentColor" opacity="0.6" />
                    <circle cx="50" cy="72" r="3" fill="currentColor" opacity="0.6" />
                  </svg>
                ),
                link: "/catalog/cat/cat-treat?onSale=true",
                buttonText: "Выбрать витамины 💊"
              },
              {
                id: "promo-ins-2",
                badge: "СТОП-ПАРАЗИТ",
                badgeBg: "bg-sky-100 text-sky-800 border-sky-200",
                title: "Защита от клещей и блох на 100%",
                subtitle: "Ветеринарные ошейники, капли на холку и спреи от ведущих брендов со скидкой -20%. Безопасные и беззаботные прогулки в любую погоду!",
                bgGradient: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
                borderClass: "border-sky-200",
                badgeIcon: <Heart className="w-3.5 h-3.5 text-sky-500" />,
                illustration: (
                  <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 text-sky-600 opacity-90">
                    <path d="M50,15 L75,30 L75,65 C75,80 50,90 50,90 C50,90 25,80 25,65 L25,30 Z" fill="currentColor" opacity="0.2" />
                    <path d="M38,45 L47,54 L65,36" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                ),
                link: "/catalog/cat/cat-flea?onSale=true",
                buttonText: "Защитить любимца 🛡️"
              }
            ];

            return (
              <div className="space-y-12">
                {productChunks.map((chunk, chunkIdx) => {
                  const banner = promoBanners[chunkIdx % promoBanners.length];
                  const hasBanner = chunkIdx < productChunks.length - 1;

                  return (
                    <React.Fragment key={chunkIdx}>
                      {/* Grid of products */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {chunk.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>

                      {/* Dynamic insert banner between chunks */}
                      {hasBanner && (
                        <div
                          className={`relative overflow-hidden rounded-[24px] shadow-aibolit border ${banner.borderClass} p-6 sm:p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 my-10`}
                          style={{ background: banner.bgGradient }}
                        >
                          <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4 text-left flex flex-col items-start justify-center h-full">
                            <div className={`inline-flex items-center gap-2 ${banner.badgeBg} border text-xs font-bold px-3.5 py-1 rounded-full font-comfortaa uppercase tracking-widest shadow-xs`}>
                              {banner.badgeIcon}
                              <span>{banner.badge}</span>
                            </div>

                            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-950 font-comfortaa leading-tight">
                              {banner.title}
                            </h3>

                            <p className="text-xs sm:text-sm text-stone-700 font-inter leading-relaxed max-w-md">
                              {banner.subtitle}
                            </p>

                            <Link
                              href={banner.link}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa rounded-full text-xs transition-all shadow-sm shadow-orange-500/10 cursor-pointer"
                            >
                              <span>{banner.buttonText}</span>
                            </Link>
                          </div>

                          <div className="absolute right-4 bottom-4 opacity-20 sm:relative sm:opacity-100 sm:right-0 sm:bottom-0 shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-white/40 p-3 rounded-3xl border border-white/60 flex items-center justify-center">
                            {banner.illustration}
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })()}
        </section>

        {/* Grid View */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {hotDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section> */}

        {/* Static Gift promo coupon visual (Premium feel) */}
        <section className="mt-16 bg-green-500/10 border border-green-200 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
              🎁
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold font-comfortaa text-green-950">Подарок при покупке корма!</h3>
              <p className="text-xs sm:text-sm text-green-800 font-inter max-w-xl">
                Купите любой сухой корм для котят или щенков от 1000 ₽ и получите успокаивающие витаминные лакомства в подарок.
              </p>
            </div>
          </div>
          <div className="relative font-comfortaa bg-white p-3 px-6 rounded-2xl border-2 border-dashed border-green-500 font-black text-green-700 tracking-wider text-sm shadow-sm">
            ПРОМОКОД: AIBOLIT10
          </div>
        </section>

      </main>

      {/* Primary footer */}
      <footer className="bg-stone-900 text-stone-400 py-10 px-4 mt-16 border-t border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-inter">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-comfortaa text-sm">🐾 Айболит</span>
            <span>— Заботливые скидки хвостикам</span>
          </div>
          <p>© 2026 Айболит Зоомаркет. Все права защищены.</p>
        </div>
      </footer>
    </div >
  );
}
