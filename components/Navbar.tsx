'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Heart, ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '@/lib/AppContext';
import { MOCK_PRODUCTS } from '@/lib/data';
import { encodeCatalogSlugSegment } from '@/lib/catalogSlug';
import AuthDrawer from './AuthDrawer';

function SearchParamsSync({ 
  onSyncSearch, 
}: { 
  onSyncSearch: (q: string) => void;
}) {
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const q = searchParams?.get('search') || '';
    onSyncSearch(q);
  }, [searchParams, onSyncSearch]);
  return null;
}

export default function Navbar({ heroBgClass }: { heroBgClass?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart, favorites, user, setAuthDrawerOpen } = useApp();

  const navContainerRef = React.useRef<HTMLElement | null>(null);

  // Категория из URL: только явный раздел (/catalog/cat и т.п.), без дефолта «Кошки»
  const routeCategory = React.useMemo(() => {
    if (pathname.startsWith('/catalog/')) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts[1] && ['cat', 'dog', 'bird', 'rodent', 'fish', 'vet', 'brands'].includes(parts[1])) {
        return parts[1];
      }
    }
    return '';
  }, [pathname]);

  // null = ещё не было события скролла;
  // '' = явно вне разделов (герой/промо) — ничего не подсвечиваем
  const [scrolledCategory, setScrolledCategory] = useState<string | null>(null);

  // На обзоре каталога (герой + вирт. разделы) не доверяем URL:
  // иначе /catalog/cat подсвечивает «Кошки», пока пользователь ещё в герое.
  const isOverviewCatalog =
    pathname === '/' ||
    pathname === '/catalog' ||
    /^\/catalog\/(cat|dog|bird|rodent|fish|vet|brands)$/.test(pathname);

  const activeCatalogCategory = isOverviewCatalog
    ? scrolledCategory ?? ''
    : scrolledCategory !== null
      ? scrolledCategory
      : routeCategory;

  React.useEffect(() => {
    // Soft-sync /catalog ↔ /catalog/cat не должен сбрасывать подсветку.
    // Сбрасываем только при уходе на другие страницы (акции, товар и т.п.).
    const isOverview =
      pathname === '/' ||
      pathname === '/catalog' ||
      /^\/catalog\/(cat|dog|bird|rodent|fish|vet|brands)$/.test(pathname);
    if (!isOverview) {
      setScrolledCategory(null);
    }
  }, [pathname]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const handleCategoryChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (typeof customEvent.detail === 'string') {
        setScrolledCategory(customEvent.detail);
      }
    };
    window.addEventListener('catalogActiveCategoryChange', handleCategoryChange);
    return () => window.removeEventListener('catalogActiveCategoryChange', handleCategoryChange);
  }, []);

  // Auto-scroll active pill into view in horizontal nav on mobile
  React.useEffect(() => {
    if (!navContainerRef.current) return;
    const activeEl = navContainerRef.current.querySelector<HTMLElement>('[data-active-nav="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCatalogCategory, pathname]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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

  // Nav items for row 3 (in exact requested order, without emojis):
  // акции (выделенные), кошки, собаки, птицы, грызуны, рыбки, ветаптека, бренды
  const categoryNavItems = [
    { id: 'promotions', name: 'Акции', href: '/promotions', isPromo: true, match: (p: string) => p === '/promotions' },
    { id: 'cat', name: 'Кошки', href: '/catalog/cat', match: (p: string) => p.startsWith('/catalog/cat') && !p.includes('cat-flea') },
    { id: 'dog', name: 'Собаки', href: '/catalog/dog', match: (p: string) => p.startsWith('/catalog/dog') },
    { id: 'bird', name: 'Птицы', href: '/catalog/bird', match: (p: string) => p.startsWith('/catalog/bird') },
    { id: 'rodent', name: 'Грызуны', href: '/catalog/rodent', match: (p: string) => p.startsWith('/catalog/rodent') },
    { id: 'fish', name: 'Рыбки', href: '/catalog/fish', match: (p: string) => p.startsWith('/catalog/fish') },
    { id: 'vet', name: 'Ветаптека', href: '/catalog/vet', match: (p: string) => p.includes('cat-flea') || p.includes('pharmacy') || p.startsWith('/catalog/vet') },
    { id: 'brands', name: 'Бренды', href: '/catalog/brands', match: (p: string) => p === '/catalog/brands' || p.startsWith('/catalog/brands/') },
  ];

  return (
    <>
      <React.Suspense fallback={null}>
        <SearchParamsSync onSyncSearch={setSearchQuery} />
      </React.Suspense>
      {showDropdown && searchQuery.trim() && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setShowDropdown(false)} 
        />
      )}
      
      {/* 
        Header sticky across the entire site, transparent background always, white on hover.
      */}
      <header className="sticky top-0 z-50 w-full transition-colors duration-300 backdrop-blur-md border-b border-stone-200/30 bg-transparent hover:bg-white/95">
        
        {/* MAIN ROW: Logo, Search Bar, Action Icons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            
            {/* Logo on Left */}
            <Link href="/catalog" className="flex-shrink-0 flex items-center gap-2 group">
              <Image 
                src="/logo_aibolit.jpg" 
                alt="Айболит" 
                width={52} 
                height={52} 
                className="w-10 h-10 md:w-11 md:h-11 object-cover rounded-full group-hover:scale-105 transition-transform" 
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col select-none text-left">
                <span className="text-lg md:text-xl font-black font-comfortaa text-stone-900 leading-none tracking-tight">
                  Айболит
                </span>
                <span className="text-[9px] md:text-[10px] font-extrabold text-orange-500 font-inter uppercase tracking-wider mt-0.5">
                  Зоомаркет
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 relative z-50">
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
                  placeholder="Поиск по товарам, брендам, категориям..."
                  className="w-full pl-11 pr-10 py-2.5 md:py-3 bg-white/90 hover:bg-white border border-stone-200/80 text-stone-900 rounded-full text-xs md:text-sm font-inter focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 shadow-2xs transition-all placeholder:text-stone-400 font-medium"
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

              {/* Instant Search Results Dropdown */}
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
                          href={`/catalog/${product.animal}/${product.subcategoryId}/${encodeCatalogSlugSegment(product.subSection || 'all')}/${product.id}`}
                          onClick={() => {
                            setShowDropdown(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/40 transition-colors group cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform border border-stone-100 bg-stone-50 overflow-hidden p-1">
                            <Image
                              src="/logo_aibolit.jpg"
                              alt=""
                              width={32}
                              height={32}
                              className="w-full h-full object-cover rounded-full"
                            />
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
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-black text-orange-600 font-mono">
                              {product.price} ₽
                            </span>
                          </div>
                        </Link>
                      ))}
                      <div className="mt-1.5 pb-1 px-1">
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit()}
                          className="w-full text-center py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold font-comfortaa text-xs rounded-xl transition-all cursor-pointer border-none shadow-xs"
                        >
                          Показать все результаты поиска
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center space-y-1">
                      <span className="text-2xl">😿</span>
                      <p className="text-xs font-bold text-stone-800 font-comfortaa">Ничего не найдено</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Action Icons on Right */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* 1. Favorites Icon */}
              <Link href="/favorites" className="relative block">
                <motion.div 
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-full transition-colors relative bg-white/70 backdrop-blur-sm border border-stone-200/60 shadow-2xs ${
                    pathname === '/favorites'
                      ? 'bg-orange-50 text-orange-600 border-orange-200'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                  title="Избранное"
                >
                  <Heart className="w-5 h-5 stroke-[1.8]" />
                </motion.div>
              </Link>

              {/* 2. Cart Icon */}
              <Link href="/cart" className="relative block">
                <motion.div 
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-full text-white transition-colors relative shadow-2xs ${
                    pathname === '/cart' ? 'bg-orange-600' : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                  title="Корзина"
                >
                  <ShoppingBag className="w-5 h-5 stroke-[2]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white min-w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px] px-1 animate-bounce shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* 3. Profile Icon / Auth Drawer trigger */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthDrawerOpen(true)}
                className={
                  user
                    ? 'w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm border border-orange-200 cursor-pointer shrink-0 p-0'
                    : 'p-2.5 rounded-full text-stone-700 bg-white/70 backdrop-blur-sm border border-stone-200/60 shadow-2xs hover:bg-stone-100 hover:text-orange-500 transition-colors relative flex items-center justify-center cursor-pointer'
                }
                title="Личный кабинет"
              >
                {user ? user.avatar : <User className="w-5 h-5 stroke-[1.8]" />}
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2.5 md:hidden rounded-full text-stone-600 bg-white/80 border border-stone-200/60 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* ROW 3: Secondary Navigation Bar */}
        {/* Requirement 1: Highlighted "Акции", centered links, no emojis */}
        <div className="pt-1 pb-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              ref={navContainerRef}
              className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 overflow-x-auto py-1 no-scrollbar scrollbar-none text-xs sm:text-sm font-semibold font-comfortaa"
            >
              {categoryNavItems.map((item) => {
                const isCatalogPage = pathname === '/' || /^\/catalog(\/[a-zA-Z0-9-]+)?$/.test(pathname);
                const isPromoPage = pathname === '/promotions';
                
                let isActive = false;
                if (item.id === 'promotions') {
                  isActive = isPromoPage;
                } else if (isCatalogPage && !isPromoPage) {
                  isActive = activeCatalogCategory === item.id;
                } else {
                  isActive = item.match(pathname);
                }

                const handleNavClick = (e: React.MouseEvent) => {
                  if (isCatalogPage && item.id && item.id !== 'promotions') {
                    e.preventDefault();
                    setScrolledCategory(item.id);
                    window.dispatchEvent(new CustomEvent('catalogScrollToCategory', { detail: item.id }));
                  }
                };

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-active-nav={isActive ? "true" : "false"}
                    onClick={handleNavClick}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full transition-all text-xs sm:text-sm cursor-pointer ${
                      isActive 
                        ? 'bg-stone-900 text-white font-extrabold shadow-xs scale-105' 
                        : item.isPromo
                        ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50/60 font-extrabold'
                        : 'text-stone-800 hover:text-orange-600 hover:bg-white/80 font-bold'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-stone-200 bg-white overflow-hidden shadow-xl"
            >
              <div className="px-4 py-4 space-y-2 font-comfortaa">
                <Link
                  href="/catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm"
                >
                  <Menu className="w-5 h-5" />
                  <span>Весь каталог</span>
                </Link>

                <div className="pt-2 pb-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2">
                  Разделы зоомаркета
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {categoryNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-colors ${
                        item.isPromo ? 'bg-orange-500 text-white' : 'bg-stone-50 hover:bg-orange-50 text-stone-800'
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
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
