'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Heart, Trash2, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { useApp } from '@/lib/AppContext';
import { MOCK_PRODUCTS } from '@/lib/data';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useApp();

  // Find favorited product details
  const favoritedProducts = MOCK_PRODUCTS.filter(product => favorites.includes(product.id));

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
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

        {/* Section Header */}
        <section className="mb-10 flex items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-comfortaa tracking-tight flex items-center gap-2">
              <span>Избранные товары</span>
              <span className="text-sm sm:text-base text-stone-400 font-sans font-bold">
                ({favoritedProducts.length})
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-inter">
              Товары, которые вы сохранили, чтобы порадовать питомца позже.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {favoritedProducts.length === 0 ? (
            /* --- EMPTY FAVORITES STATE --- */
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-md mx-auto text-center space-y-6 py-16 bg-white rounded-[24px] p-8 border border-stone-150 shadow-sm"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                <Heart className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-extrabold font-comfortaa text-stone-900">
                  В избранном пока пусто!
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 font-inter leading-relaxed">
                  Нажимайте на сердечко в карточках товаров каталога, чтобы добавить полезные вкусняшки, корма или игрушки в этот список.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa text-xs sm:text-sm rounded-full shadow-md shadow-orange-500/15"
                >
                  Перейти в каталог 🛍️
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
              {favoritedProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-stone-900 text-stone-400 py-10 px-4 mt-20 border-t border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-inter">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-comfortaa text-sm">🐾 Айболит</span>
            <span>— Забота в каждой крохе</span>
          </div>
          <p>© 2026 Сеть зоомаркетов «Айболит». Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
