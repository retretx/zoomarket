'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, Trash2, Plus, Minus, CreditCard, 
  ShoppingBag, ShieldCheck, HelpCircle, Truck, RefreshCw, Eye, Store, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LottiePlayer from '@/components/LottiePlayer';
import ProductIcon from '@/components/ProductIcon';
import { useApp } from '@/lib/AppContext';
import { encodeCatalogSlugSegment } from '@/lib/catalogSlug';
import { MOCK_PRODUCTS } from '@/lib/data';
import type { Product } from '@/components/ProductCard';

function getCartItemDetailUrl(itemId: string): string | null {
  const product = MOCK_PRODUCTS.find((p) => p.id === itemId);
  if (!product?.animal || !product?.subcategoryId) return null;

  return `/catalog/${product.animal}/${product.subcategoryId}/${encodeCatalogSlugSegment(product.subSection || 'all')}/${product.id}`;
}

function getRecommendationScore(product: Product): number {
  let score = product.rating * 10;
  if (product.badge === 'Хит' || product.badge === 'Рекомендовано') score += 50;
  if (product.onSale) score += 10;
  return score;
}

export default function CartPage() {
  const router = useRouter();
  const { 
    cart, 
    updateQty, 
    removeFromCart, 
    clearCart,
    checkoutType, 
    setCheckoutType,
    pickupAddress,
    addToCart,
  } = useApp();

  const [promoInput, setPromoInput] = React.useState('');
  const [promoDiscount, setPromoDiscount] = React.useState(0);
  const [promoError, setPromoError] = React.useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = React.useState<string | null>(null);

  const recommendedProducts = React.useMemo(() => {
    const cartIds = new Set(cart.map((item) => item.id));
    const cartAnimals = new Set(
      cart
        .map((item) => MOCK_PRODUCTS.find((p) => p.id === item.id)?.animal)
        .filter((animal): animal is Product['animal'] => Boolean(animal))
    );

    const available = MOCK_PRODUCTS.filter(
      (product) => !cartIds.has(product.id) && product.inStock !== false
    );

    const related = available.filter(
      (product) => cartAnimals.size === 0 || cartAnimals.has(product.animal) || product.animal === 'universal'
    );

    const pool = related.length > 0 ? related : available;

    return [...pool]
      .sort((a, b) => getRecommendationScore(b) - getRecommendationScore(a))
      .slice(0, 3);
  }, [cart]);

  const handleAddRecommendation = (product: Product) => {
    const size = product.sizes?.[2] || product.sizes?.[0];
    addToCart(product, size, { silent: true });
  };

  const itemsSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemsOldSubtotal = cart.reduce((sum, item) => sum + ((item.oldPrice || item.price) * item.quantity), 0);
  const totalSavings = itemsOldSubtotal - itemsSubtotal;
  
  // Delivery calculation (0 if pickup, or free if subtotal >= 1500, otherwise 290)
  const deliveryCost = checkoutType === 'delivery' ? (itemsSubtotal >= 1500 ? 0 : 290) : 0;
  const grandTotal = Math.max(0, itemsSubtotal - promoDiscount + deliveryCost);

  const handleApplyPromo = () => {
    setPromoError(null);
    setPromoSuccess(null);
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError('Введите промокод');
      return;
    }
    if (code === 'AIBOLIT10') {
      const discount = Math.round(itemsSubtotal * 0.1);
      setPromoDiscount(discount);
      setPromoSuccess('Промокод применен');
    } else if (code === 'LOVEPETS') {
      const discount = Math.round(itemsSubtotal * 0.15);
      setPromoDiscount(discount);
      setPromoSuccess('Промокод применен');
    } else {
      setPromoError('Неверный промокод');
      setPromoDiscount(0);
    }
  };

  const renderItemIllustration = (name: string) => (
    <ProductIcon alt={name} className="w-12 h-12" />
  );

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

        <section className="space-y-2 mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-comfortaa tracking-tight inline-flex items-center gap-2">
            <span>Ваша корзина</span>
            <span className="text-sm sm:text-base text-stone-400 font-sans font-bold">
              ({cart.length})
            </span>
          </h1>
        </section>

        <AnimatePresence mode="wait">
          
          {/* CART IS EMPTY STATE */}
          {cart.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full bg-white rounded-[32px] p-8 md:p-16 border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6 py-16"
            >
              <div className="h-48 w-64 mx-auto">
                <LottiePlayer type="sleeping-cat" className="h-full w-full" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-xl sm:text-2xl font-extrabold font-comfortaa text-stone-900">
                  В вашей корзине пусто!
                </h2>
                <p className="text-sm text-stone-500 font-inter leading-relaxed">
                  Похоже, вы еще не баловали своих питомцев... Пора положить им сочной крольчатины или новые игрушки!
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa text-sm rounded-full shadow-md"
                >
                  Вернуться за покупками
                </Link>
              </div>
            </motion.div>
          ) : (
            /* CART HAS ITEMS STATE */
            <motion.div 
              key="normal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
            >
              {/* Product list (8 cells width) */}
              <div className="lg:col-span-8 bg-white p-6 border border-stone-100 rounded-3xl shadow-sm space-y-6">
                <div className="divide-y divide-stone-100">
                  {cart.map((item) => {
                    const detailUrl = getCartItemDetailUrl(item.id);
                    const titleClassName =
                      'text-sm sm:text-base font-bold text-stone-900 leading-tight font-comfortaa pr-2 transition-colors max-w-sm line-clamp-2';

                    return (
                    <div 
                      key={`${item.id}-${item.size}`} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 pt-4 first:pt-0 border-b border-[#F5F5F4]"
                    >
                      {/* Illustration & Metadata */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-stone-50 flex items-center justify-center flex-shrink-0 border border-stone-100">
                          {renderItemIllustration(item.name)}
                        </div>
                        <div className="flex flex-col items-start gap-1.5">
                          <span className="text-[10px] bg-stone-100 text-stone-500 font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                            {item.category}
                          </span>
                          {detailUrl ? (
                            <Link href={detailUrl} className="block">
                              <h3 className={`${titleClassName} hover:text-orange-500`}>
                                {item.name}
                              </h3>
                            </Link>
                          ) : (
                            <h3 className={titleClassName}>{item.name}</h3>
                          )}
                          {item.size && (
                            <span className="text-xs text-stone-500 font-semibold bg-stone-50 border border-stone-200/50 px-2 py-0.5 rounded-md inline-block">
                              Вес/Размер: {item.size}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Counter & Prices */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">
                        
                        {/* Quantity counter */}
                        <div className="flex items-center bg-stone-50 p-1.5 border border-stone-200/80 rounded-full">
                          <button
                            onClick={() => updateQty(item.id, -1, item.size)}
                            className="w-8 h-8 rounded-full bg-white hover:bg-orange-50 hover:text-orange-500 border border-stone-200/50 flex items-center justify-center text-stone-600 transition-colors shadow-xs"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-stone-800 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1, item.size)}
                            className="w-8 h-8 rounded-full bg-white hover:bg-orange-50 hover:text-orange-500 border border-stone-200/50 flex items-center justify-center text-stone-600 transition-colors shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price Display */}
                        <div className="text-right space-y-1 flex-shrink-0 min-w-24">
                          <p className="text-base sm:text-lg font-extrabold text-stone-900 font-comfortaa">
                            {item.price * item.quantity} ₽
                          </p>
                          {item.oldPrice && (
                            <p className="text-xs text-stone-400 line-through font-inter">
                              {item.oldPrice * item.quantity} ₽
                            </p>
                          )}
                        </div>

                        {/* Delete from cart */}
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-stone-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50/50 transition-colors flex-shrink-0"
                          title="Удалить товар"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                  })}
                </div>

                {/* Free delivery bar or Pickup Info */}
                {checkoutType === 'delivery' ? (
                  <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3">
                    <span className="text-xl">🛵</span>
                    <div className="text-xs text-stone-600 font-inter space-y-0.5">
                      {itemsSubtotal >= 1500 ? (
                        <p className="font-bold text-orange-950">Поздравляем! Доставка будет бесплатной!</p>
                      ) : (
                        <p> Добавьте еще товаров на <strong className="text-orange-950">{1500 - itemsSubtotal} ₽</strong> для бесплатной доставки по городу.</p>
                      )}
                      <p className="text-stone-400 font-light">Доставка Айболита работает с заботой во все районы.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                    <span className="text-xl">🏪</span>
                    <div className="text-xs text-stone-600 font-inter space-y-0.5">
                      <p className="font-bold text-green-950">Самовывоз — Бесплатно в любое время!</p>
                      <p className="text-stone-700">Пункт выдачи: <strong className="text-stone-950">{pickupAddress}</strong></p>
                    </div>
                  </div>
                )}

              </div>

              {/* Order Summary Block (4 cells width) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Checkout Toggle Switch and totals */}
                <div className="bg-[#FFF7ED] rounded-[24px] p-6 border border-orange-100 flex flex-col gap-6">
                  
                  {/* Delivery / Pickup Toggle */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-comfortaa block">
                      Способ получения заказа
                    </label>
                    <div className="flex bg-orange-100/40 p-1.5 rounded-full border border-orange-100/50">
                      <button
                        type="button"
                        onClick={() => setCheckoutType('delivery')}
                        className={`flex-1 py-2.5 text-center text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          checkoutType === 'delivery'
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Доставка</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutType('pickup')}
                        className={`flex-1 py-2.5 text-center text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          checkoutType === 'pickup'
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Самовывоз</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-stone-950 font-comfortaa leading-none pt-2 border-t border-orange-200/20">
                    Итого по заказу
                  </h3>

                  <div className="space-y-4 text-sm font-inter text-stone-700">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Подитог ({cart.length} тов.):</span>
                      <span className="font-semibold text-stone-900">{itemsSubtotal} ₽</span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-orange-650">
                        <span>Экономия по акциям:</span>
                        <span className="font-semibold">–{totalSavings} ₽</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-stone-500">Получение заказа:</span>
                      <span className="font-semibold text-stone-900">
                        {checkoutType === 'delivery' 
                          ? (deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`)
                          : 'Самовывоз (Бесплатно)'}
                      </span>
                    </div>

                    {/* Promo Code Input */}
                    <div className="border-t border-orange-200/20 pt-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Промокод (AIBOLIT10, LOVEPETS)"
                          className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500 font-medium placeholder:text-stone-400"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors cursor-pointer whitespace-nowrap border-none"
                        >
                          Применить
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-[10px] text-red-500 font-bold leading-tight">{promoError}</p>
                      )}
                      {promoSuccess && (
                        <p className="text-[10px] text-emerald-600 font-bold leading-tight">{promoSuccess}</p>
                      )}
                    </div>

                    <div className="border-t border-orange-200/50 pt-4 flex justify-between items-end">
                      <span className="font-bold text-stone-950 font-comfortaa text-base">К оплате:</span>
                      <div className="flex items-center gap-2">
                        {promoDiscount > 0 && (
                          <span className="text-sm text-stone-400 line-through font-comfortaa">
                            {itemsSubtotal + deliveryCost} ₽
                          </span>
                        )}
                        <span className="text-2xl font-black text-orange-500 font-comfortaa">{grandTotal} ₽</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Link Action */}
                  <button
                    onClick={() => router.push('/cart/checkout')}
                    className="w-full py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold font-inter rounded-full tracking-wide text-xs sm:text-sm shadow-sm cursor-pointer flex items-center justify-center gap-2 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Перейти к оформлению</span>
                  </button>

                  {/* Cart recommendations */}
                  {recommendedProducts.length > 0 && (
                    <div className="space-y-3 border-t border-orange-200/40 pt-4">
                      <p className="font-comfortaa text-[11px] font-bold uppercase tracking-wide text-stone-500">
                        Часто покупают вместе
                      </p>
                      <div className="space-y-3">
                        {recommendedProducts.map((product) => (
                          <div key={product.id} className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-orange-100/80">
                              <ProductIcon type={product.type} alt={product.name} className="h-8 w-8" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 font-comfortaa text-xs font-bold leading-snug text-stone-900">
                                {product.name}
                              </p>
                              <p className="mt-0.5 font-comfortaa text-sm font-black text-orange-500">
                                {product.price} ₽
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddRecommendation(product)}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition-colors hover:bg-orange-600 cursor-pointer"
                              aria-label={`Добавить ${product.name} в корзину`}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Security Policy */}
                  <div className="space-y-3 pt-2 text-[11px] text-stone-500 leading-normal border-t border-orange-200/40">
                    <div className="flex gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <p><strong>Защита покупателя:</strong> Безопасная бесконтактная передача и выдача препаратов.</p>
                    </div>
                  </div>
                </div>

                {/* Task 2: EMBEDDED DELIVERY TERMS BLOCK (Only shown in Delivery Mode) */}
                {checkoutType === 'delivery' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#FFF7ED] rounded-[24px] p-6 border border-orange-100 space-y-5"
                  >
                    <h3 className="text-sm font-bold font-comfortaa text-orange-950 uppercase tracking-wider flex items-center gap-2">
                      <span>📍 Условия Доставки</span>
                    </h3>
                    
                    <ul className="space-y-4 text-xs text-stone-700 font-inter">
                      <li className="flex gap-3">
                        <span className="text-base">🚀</span>
                        <div>
                          <strong>Бесплатно от 1500 ₽:</strong> При меньшей стоимости заказа доставка по городу составит фиксированные 290 ₽.
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-base">🕒</span>
                        <div>
                          <strong>Экспресс доставка:</strong> Для рецептурных лекарств и экстренных аксессуаров за 1 час! Действует курьерский сбор.
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-base">🦴</span>
                        <div>
                          <strong>Подарок-сюрприз:</strong> В каждую доставку мы упаковываем вкусный экологический комплимент от Айболита.
                        </div>
                      </li>
                    </ul>

                    {/* Micro warning notice */}
                    <div className="text-[11px] text-stone-500 border-t border-orange-200/50 pt-4 leading-normal">
                      Возникли перебои с адресацией? Свяжитесь с нами напрямую по номеру <strong className="text-orange-950 font-bold">8 (800) 555-35-35</strong> для ручной коррекции координации.
                    </div>
                  </motion.div>
                )}

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
}
