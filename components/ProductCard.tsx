'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Star, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

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
  // SVG Custom Illustrations for each product type
  const renderProductIllustration = () => {
    switch (product.type) {
      case 'food':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-orange-400">
            {/* Bag shape */}
            <path d="M30,85 L70,85 L75,30 L60,20 L40,20 L25,30 Z" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
            <path d="M40,20 L60,20 L65,12 L35,12 Z" fill="#F97316" />
            {/* Paw print on the bag */}
            <g transform="translate(50, 52) scale(0.7)" fill="#EA580C">
              <circle cx="0" cy="0" r="8" />
              <circle cx="-11" cy="-12" r="5" />
              <circle cx="0" cy="-17" r="5" />
              <circle cx="11" cy="-12" r="5" />
            </g>
            {/* Text logo */}
            <text x="50" y="78" fill="#7C2D12" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono">
              Premium
            </text>
          </svg>
        );
      case 'toy':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-teal-400">
            {/* Toy Ball */}
            <circle cx="50" cy="50" r="32" fill="#99F6E4" stroke="#0D9488" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="24" fill="#2DD4BF" stroke="#0D9488" strokeWidth="2" />
            {/* Squeaky bone crossing */}
            <path d="M30,30 L70,70" stroke="#0F766E" strokeWidth="6" strokeLinecap="round" />
            <circle cx="30" cy="30" r="6" fill="#0F766E" />
            <circle cx="70" cy="70" r="6" fill="#0F766E" />
          </svg>
        );
      case 'medicine':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            {/* Medicine bottle */}
            <rect x="35" y="30" width="30" height="50" rx="6" fill="#DCFCE7" stroke="#22C55E" strokeWidth="2" />
            <rect x="42" y="18" width="16" height="12" rx="2" fill="#16A34A" />
            {/* Plus sign background */}
            <circle cx="50" cy="55" r="10" fill="#22C55E" />
            <rect x="48" y="50" width="4" height="10" fill="#FFFFFF" rx="1" />
            <rect x="45" y="53" width="10" height="4" fill="#FFFFFF" rx="1" />
            {/* Cute droplet element */}
            <path d="M50,38 C48,40 45,43 45,45 C45,47 47,49 50,49 C53,49 55,47 55,45 Z" fill="#EF4444" />
          </svg>
        );
      case 'accessory':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            {/* Pet Bowl or Collar */}
            <ellipse cx="50" cy="65" rx="35" ry="15" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2.5" />
            <ellipse cx="50" cy="58" rx="25" ry="8" fill="#FCA5A5" />
            {/* Small fish hanging or food kibbles */}
            <circle cx="40" cy="62" r="2.5" fill="#991B1B" />
            <circle cx="50" cy="64" r="3" fill="#991B1B" />
            <circle cx="58" cy="61" r="2.5" fill="#991B1B" />
            {/* Collar shape */}
            <path d="M15,35 Q50,22 85,35" stroke="#EA580C" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Gold Pendant */}
            <circle cx="50" cy="38" r="7" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
            <path d="M50,34 L50,42" stroke="#D97706" strokeWidth="1.5" />
          </svg>
        );
    }
  };

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
          {renderProductIllustration()}
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
