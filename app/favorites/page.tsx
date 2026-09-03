'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useApp } from '@/lib/AppContext';
import { MOCK_PRODUCTS } from '@/lib/data';

export default function FavoritesPage() {
  const { favorites } = useApp();
  // Снимок сессии: только накапливает id; снятие лайка не убирает карточку до ухода со страницы
  const [sessionFavorites, setSessionFavorites] = useState<string[]>([]);

  // Синхронный sync при рендере (до paint), чтобы unlike до накопления снимка не дропал карточку
  const missingFromSession = favorites.filter((id) => !sessionFavorites.includes(id));
  if (missingFromSession.length > 0) {
    setSessionFavorites([...sessionFavorites, ...missingFromSession]);
  }

  const displayFavoriteIds = Array.from(new Set([...sessionFavorites, ...favorites]));
  const sessionProducts = MOCK_PRODUCTS.filter((product) =>
    displayFavoriteIds.includes(product.id)
  );
  const activeFavoriteCount = favorites.length;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
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

        {/* Section Header — как в корзине: без нижней границы и без justify-between */}
        <section className="space-y-2 mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-comfortaa tracking-tight inline-flex items-center gap-2">
            <span>Избранные товары</span>
            <span className="text-sm sm:text-base text-stone-400 font-sans font-bold">
              ({activeFavoriteCount})
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-inter">
            Товары, которые вы сохранили, чтобы порадовать питомца позже.
          </p>
        </section>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {sessionProducts.length === 0 ? (
            /* --- EMPTY FAVORITES STATE — полная ширина контейнера, как empty state корзины --- */
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full bg-white rounded-[32px] p-8 md:p-16 border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6 py-16"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <Heart className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-xl sm:text-2xl font-extrabold font-comfortaa text-stone-900">
                  В избранном пока пусто!
                </h2>
                <p className="text-sm text-stone-500 font-inter leading-relaxed">
                  Нажимайте на сердечко в карточках товаров каталога, чтобы добавить полезные вкусняшки, корма или игрушки в этот список.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa text-sm rounded-full shadow-md"
                >
                  Перейти в каталог
                </Link>
              </div>
            </motion.div>
          ) : (
            /* --- PRODUCTS GRID --- */
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {sessionProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
