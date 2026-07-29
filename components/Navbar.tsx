'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { withBasePath } from '@/lib/basePath';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Heart, ShoppingBag, Search, Menu, X, HelpCircle, PhoneCall, Gift, Truck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '@/lib/AppContext';
import { MOCK_PRODUCTS } from '@/lib/data';
import AuthDrawer from './AuthDrawer';
import Logo from './Logo';

function SearchQuerySync({ onSync }: { onSync: (q: string) => void }) {
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const q = searchParams?.get('search') || '';
    const timer = setTimeout(() => {
      onSync(q);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams, onSync]);
  return null;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { cart, favorites, user, setAuthDrawerOpen } = useApp();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const favoritesCount = favorites.length;

  const allSearchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MOCK_PRODUCTS.filter((product) => {
      return (
        product.name.toLowerCase().includes(q) ||
        product.brand?.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.subSection && product.subSection.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const searchResults = React.useMemo(() => {
    return allSearchResults.slice(0, 5);
  }, [allSearchResults]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const links = [
    { name: 'Каталог', href: '/catalog', icon: Menu },
    { name: 'Акции и скидки', href: '/promotions', icon: Gift },
  ];

  return (
    <>
      <React.Suspense fallback={null}>
        <SearchQuerySync onSync={setSearchQuery} />
      </React.Suspense>
      {showDropdown && searchQuery.trim() && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setShowDropdown(false)}
        />
      )}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-stone-100 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">

            {/* Logo on Left */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-white ring-1 ring-stone-200/80 flex-shrink-0">
                <Image
                  src={withBasePath('/logo.svg')}
                  alt="Айболит"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col select-none text-left">
                <span className="text-lg md:text-xl font-bold font-comfortaa text-stone-900 leading-none">
                  Айболит
                </span>
                <span className="text-[9px] md:text-[10px] font-semibold text-orange-500 font-inter uppercase tracking-wider mt-0.5">
                  Зоомаркет
                </span>
              </div>
            </Link>

            {/* Search Bar in Current Center (Exact request specifications) */}
            <div className="hidden md:flex flex-1 max-w-lg relative z-50">
              <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-stone-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Поиск кормов, игрушек, витаминов..."
                  className="w-full pl-11 pr-10 py-2.5 bg-white border border-[#E7E5E4] text-stone-900 rounded-full text-sm font-inter focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-all placeholder:text-stone-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowDropdown(false);
                    }}
                    className="absolute right-4 text-stone-400 hover:text-stone-600 bg-transparent border-none p-0 cursor-pointer flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Desktop Instant Results Dropdown */}
              {showDropdown && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200/80 overflow-hidden z-50 text-left font-inter"
                >
                  {searchResults.length > 0 ? (
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-2 text-[10px] font-extrabold text-stone-500 uppercase tracking-wider font-comfortaa bg-stone-50/80 rounded-xl border border-stone-100/50 flex items-center justify-between">
                        <span>Найдено товаров: {allSearchResults.length}</span>
                      </div>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/catalog/${product.animal}/${product.subcategoryId}/${encodeURIComponent(product.subSection || 'all')}/${product.id}`}
                          onClick={() => {
                            setShowDropdown(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/40 transition-colors group cursor-pointer"
                        >
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform text-xl border ${product.type === 'food' ? 'bg-orange-50 border-orange-100' :
                            product.type === 'toy' ? 'bg-teal-50 border-teal-100' :
                              product.type === 'medicine' ? 'bg-emerald-50 border-emerald-100' :
                                'bg-purple-50 border-purple-100'
                            }`}>
                            {product.type === 'food' ? '🍖' : product.type === 'toy' ? '🧸' : product.type === 'medicine' ? '💊' : '🐾'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-stone-800 line-clamp-1 leading-snug group-hover:text-orange-500 transition-colors">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-stone-400">
                              {product.brand && (
                                <span className="font-extrabold font-comfortaa text-[9px] text-orange-650 bg-orange-50/80 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                  {product.brand}
                                </span>
                              )}
                              <span>•</span>
                              <span className="font-medium text-stone-500">{product.category}</span>
                              {product.inStock === false && (
                                <>
                                  <span>•</span>
                                  <span className="text-rose-500 font-bold">Нет в наличии</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-black text-orange-600 font-mono">
                              {product.price} ₽
                            </span>
                            {product.onSale && product.oldPrice && (
                              <span className="block text-[9px] text-stone-400 line-through font-mono">
                                {product.oldPrice} ₽
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                      <div className="mt-1.5 pb-1 px-1">
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit()}
                          className="w-full text-center py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold font-comfortaa text-xs rounded-xl transition-all cursor-pointer border-none shadow-xs flex items-center justify-center gap-2"
                        >
                          <span>Показать все результаты поиска</span>
                          <span className="text-sm">🔍</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center space-y-1">
                      <span className="text-2xl">😿</span>
                      <p className="text-xs font-bold text-stone-800 font-comfortaa">Ничего не найдено</p>
                      <p className="text-[10px] text-stone-400 font-inter">Попробуйте ввести другое название или бренд</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Navigation & Icon Actions */}
            <div className="flex items-center gap-2 md:gap-5">
              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1.5 mr-2">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-2 rounded-full text-sm font-semibold font-comfortaa transition-all ${isActive
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                        }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Action Buttons: Favorites, Cart, Account */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Favorites Icon */}
                <Link href="/favorites" className="relative block">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2.5 rounded-full transition-colors ${pathname === '/favorites'
                      ? 'bg-stone-100 text-stone-800'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
                      }`}
                    title="Избранное"
                  >
                    <Heart className="w-5.5 h-5.5 stroke-[1.75]" />
                  </motion.div>
                </Link>

                {/* Cart Icon */}
                <Link href="/cart" className="relative block">
                  <div
                    className={`p-2.5 rounded-full text-white transition-colors ${pathname === '/cart' ? 'bg-orange-600' : 'bg-orange-500 hover:bg-orange-600'
                      }`}
                    title="Корзина"
                  >
                    <ShoppingBag className="w-5.5 h-5.5 stroke-[2]" />

                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white min-w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px] px-1 shadow">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Account / Auth Trigger icon */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAuthDrawerOpen(true)}
                  className="p-2.5 cursor-pointer rounded-full text-stone-600 hover:bg-stone-50 hover:text-orange-500 transition-colors relative flex items-center justify-center"
                  title="Личный кабинет"
                >
                  {user ? (
                    <div className="w-8.5 h-8.5 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-500 shadow-xs text-sm">
                      {user.avatar}
                    </div>
                  ) : (
                    <User className="w-5.5 h-5.5 stroke-[1.75]" />
                  )}
                </motion.button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2.5 lg:hidden rounded-full text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>

            </div>
          </div>

          {/* Small Screen Search Bar */}
          <div className="mt-3 md:hidden relative z-45">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-stone-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Поиск кормов, игрушек, витаминов..."
                className="w-full pl-11 pr-10 py-2 bg-white border border-[#E7E5E4] text-stone-900 rounded-full text-sm font-inter focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/10 transition-all placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowDropdown(false);
                  }}
                  className="absolute inset-y-0 right-3 px-1 flex items-center text-stone-400 hover:text-stone-600 bg-transparent border-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Mobile Instant Results Dropdown */}
            {showDropdown && searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200/80 overflow-hidden z-50 text-left font-inter"
              >
                {searchResults.length > 0 ? (
                  <div className="p-2 space-y-1 max-h-[320px] overflow-y-auto">
                    <div className="px-3 py-2 text-[10px] font-extrabold text-stone-500 uppercase tracking-wider font-comfortaa bg-stone-50/80 rounded-xl border border-stone-100/50 flex items-center justify-between mb-1">
                      <span>Найдено товаров: {allSearchResults.length}</span>
                    </div>
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/catalog/${product.animal}/${product.subcategoryId}/${encodeURIComponent(product.subSection || 'all')}/${product.id}`}
                        onClick={() => {
                          setShowDropdown(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-orange-50/40 transition-colors group cursor-pointer"
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base border ${product.type === 'food' ? 'bg-orange-50 border-orange-100' :
                          product.type === 'toy' ? 'bg-teal-50 border-teal-100' :
                            product.type === 'medicine' ? 'bg-emerald-50 border-emerald-100' :
                              'bg-purple-50 border-purple-100'
                          }`}>
                          {product.type === 'food' ? '🍖' : product.type === 'toy' ? '🧸' : product.type === 'medicine' ? '💊' : '🐾'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-stone-800 line-clamp-1 leading-snug">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-black text-orange-600 font-mono">
                              {product.price} ₽
                            </span>
                            {product.brand && (
                              <span className="font-extrabold font-comfortaa text-[8px] text-orange-650 bg-orange-50 px-1 rounded-md uppercase tracking-wider">
                                {product.brand}
                              </span>
                            )}
                            {product.inStock === false && (
                              <span className="text-[9px] text-rose-500 font-bold">Нет в наличии</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                    <div className="mt-1.5 pb-1 px-1">
                      <button
                        type="button"
                        onClick={() => handleSearchSubmit()}
                        className="w-full text-center py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold font-comfortaa text-xs rounded-xl transition-all cursor-pointer border-none shadow-xs flex items-center justify-center gap-2"
                      >
                        <span>Показать все результаты</span>
                        <span className="text-sm">🔍</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center space-y-1">
                    <span className="text-xl">😿</span>
                    <p className="text-xs font-bold text-stone-850 font-comfortaa">Ничего не найдено</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-stone-100 bg-white overflow-hidden shadow-lg"
            >
              <div className="px-4 py-4 space-y-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold font-comfortaa transition-all ${isActive
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-stone-700 hover:bg-stone-50'
                        }`}
                    >
                      <Icon className="w-5 h-5 opacity-80" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* Global Auth Drawer overlay */}
      <AuthDrawer />
    </>
  );
}
