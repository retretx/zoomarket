'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Plus, ShoppingCart } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import ProductIcon from '@/components/ProductIcon';

export default function CartToast() {
  const { toastData, dismissToast, addToCart, pauseToastTimer, resumeToastTimer } = useApp();

  const handleAddRecommendation = () => {
    if (!toastData?.recommendation) return;
    const recommended = toastData.recommendation;
    const size = recommended.sizes?.[2] || recommended.sizes?.[0];
    addToCart(recommended, size);
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col items-end sm:bottom-6 sm:right-6">
      {/* Hover на стабильном wrapper вне key: смена контента тоста не сбрасывает паузу */}
      <div
        className="pointer-events-auto w-full"
        onMouseEnter={pauseToastTimer}
        onMouseLeave={resumeToastTimer}
      >
        <AnimatePresence mode="wait">
          {toastData && (
            <motion.div
              key={`${toastData.product.id}-${toastData.recommendation?.id ?? 'none'}`}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="w-full overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[0_12px_40px_rgba(28,25,23,0.14)]"
              role="region"
              aria-label="Уведомление о корзине"
            >
              <div className="flex items-start gap-3 px-4 pb-3 pt-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-4 w-4 stroke-[2.5]" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="sr-only" aria-live="polite">
                    Товар добавлен: {toastData.product.name}
                  </p>
                  <p className="font-comfortaa text-sm font-bold text-stone-900" aria-hidden>
                    Товар добавлен
                  </p>
                  <p className="mt-0.5 line-clamp-2 font-inter text-xs text-stone-500" aria-hidden>
                    {toastData.product.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={dismissToast}
                  className="shrink-0 rounded-full p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
                  aria-label="Закрыть уведомление"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-4 pb-4">
                <Link
                  href="/cart"
                  onClick={dismissToast}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1917] px-4 py-2.5 font-inter text-xs font-semibold text-white transition-colors hover:bg-black"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Перейти в корзину
                </Link>
              </div>

              {toastData.recommendation && (
                <>
                  <div className="mx-4 border-t border-stone-100" />
                  <div className="px-4 py-4">
                    <p className="mb-3 font-comfortaa text-[11px] font-bold uppercase tracking-wide text-stone-500">
                      С этим часто покупают:
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-stone-50">
                        <ProductIcon type={toastData.recommendation.type} className="h-10 w-10" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-comfortaa text-xs font-bold leading-snug text-stone-900">
                          {toastData.recommendation.name}
                        </p>
                        <p className="mt-1 font-comfortaa text-sm font-black text-orange-500">
                          {toastData.recommendation.price} ₽
                        </p>
                      </div>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAddRecommendation}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition-colors hover:bg-orange-600 cursor-pointer"
                        aria-label={`Добавить ${toastData.recommendation.name} в корзину`}
                      >
                        <Plus className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
