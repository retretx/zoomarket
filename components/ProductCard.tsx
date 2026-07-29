'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Star, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import LogoMark from '@/components/LogoMark';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  onSale: boolean;
  salePct?: number;
  badge?: string;
  type: 'food' | 'toy' | 'medicine' | 'accessory';
  animal: 'dog' | 'cat' | 'bird' | 'rodent' | 'fish' | 'universal';
  brand?: string;
  sizes?: string[];
  subcategoryId?: string;
  subSection?: string;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite, addToCart, cart, updateQty } = useApp();
  const liked = isFavorite(product.id);
  const [selectedSize, setSelectedSize] = React.useState(
    product.sizes?.[2] || product.sizes?.[0] || ''
  );

  const cartItem = cart.find(item => item.id === product.id && item.size === selectedSize);
  const currentQty = cartItem ? cartItem.quantity : 0;

  const pathname = usePathname();
  const isFromAll = pathname ? (pathname.endsWith(`/${product.subcategoryId}`) || pathname.endsWith(`/${product.subcategoryId}/all`)) : false;

  const detailUrl = `/catalog/${product.animal}/${product.subcategoryId}/${encodeURIComponent(product.subSection || 'all')}/${product.id}${isFromAll ? '?from=all' : ''}`;

  return (
    <div
      className="relative flex flex-col justify-between bg-white rounded-2xl overflow-hidden hover:shadow-aibolit-lg transition-all duration-300 group border border-stone-100 h-full"
      id={`product-card-${product.id}`}
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
    >
      {/* Absolute Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5 pointer-events-none">
        {product.onSale && (
          <span className="bg-orange-500 font-comfortaa text-white font-bold text-[11px] px-3 py-1 rounded-full shadow-sm">
            –{product.salePct}%
          </span>
        )}
        {product.badge && (
          <span className="bg-emerald-500 font-comfortaa text-white font-bold text-[11px] px-3 py-1 rounded-full shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      {/* Favorites Toggle Button */}
      <button
        onClick={() => toggleFavorite(product.id)}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-sm backdrop-blur-xs transition-colors cursor-pointer ${liked ? 'bg-red-50 text-red-500' : 'bg-white/80 hover:bg-white text-stone-400 hover:text-red-500'
          }`}
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image Stage */}
      <Link href={detailUrl} className="relative aspect-square w-full bg-stone-50 flex items-center justify-center overflow-hidden border-b border-stone-50 p-6 block">
        {/* Hover image pulse zoom */}
        <motion.div
          className="w-full h-full flex items-center justify-center"
          whileHover={{ scale: 1.12, rotate: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <LogoMark className="w-28 h-28" alt={product.name} />
        </motion.div>

        {/* Category Label at bottom of image */}
        <span className="absolute bottom-2 right-2 bg-stone-100/95 text-[10px] font-bold text-stone-600 font-inter px-2.5 py-0.5 rounded-md uppercase tracking-wider">
          {product.category}
        </span>
      </Link>

      {/* Product Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Rating and animal badge info */}
          <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[11px] text-stone-500">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-stone-700">{product.rating}</span>
              <span className="text-stone-400">({product.reviews})</span>
            </div>
          </div>

          {/* Product Name */}
          <Link href={detailUrl} className="block">
            <h3 className="text-sm md:text-base font-bold text-stone-900 font-comfortaa leading-tight tracking-tight line-clamp-2 hover:text-orange-500 cursor-pointer transition-colors mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Sizes / Weight Selection Pills */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.sizes.map((size) => {
                const isActive = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`text-[10px] font-bold font-inter px-2 py-1 rounded-md transition-all cursor-pointer border ${isActive
                      ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200/50'
                      }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Price and CTA Grid Row */}
        <div className="space-y-3.5">
          {/* Price Container */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-black text-orange-500 font-comfortaa">
              {product.price} ₽
            </span>
            {product.onSale && product.oldPrice && (
              <span className="text-xs md:text-sm text-stone-400 line-through font-inter">
                {product.oldPrice} ₽
              </span>
            )}
          </div>

          {/* Add to Cart Premium Action Button or Quantity Selector */}
          {product.inStock === false ? (
            <button
              disabled
              className="w-full bg-stone-100 text-stone-400 font-bold font-comfortaa py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all text-xs sm:text-sm cursor-not-allowed border-0 outline-none h-[44px]"
            >
              <span>Нет в наличии</span>
            </button>
          ) : currentQty > 0 ? (
            <div className="flex items-center justify-between w-full bg-stone-100 p-1 rounded-full border border-stone-200/60 h-[44px]">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => updateQty(product.id, -1, selectedSize)}
                className="w-9 h-9 rounded-full bg-white hover:bg-orange-50 hover:text-orange-500 border border-stone-200/50 flex items-center justify-center text-stone-600 transition-colors shadow-xs cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </motion.button>
              <span className="text-sm font-extrabold text-stone-900 font-mono">
                {currentQty}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => updateQty(product.id, 1, selectedSize)}
                className="w-9 h-9 rounded-full bg-white hover:bg-orange-50 hover:text-orange-500 border border-stone-200/50 flex items-center justify-center text-stone-600 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => addToCart(product, selectedSize)}
              className="w-full bg-[#1C1917] hover:bg-black text-white font-semibold font-inter py-2.5 px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors text-xs sm:text-sm h-[44px]"
            >
              <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5" />
              <span>В корзину</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
