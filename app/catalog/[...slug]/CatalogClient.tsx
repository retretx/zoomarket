'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Sparkles, Filter, ChevronRight, Award, 
  Heart, ThumbsUp, HelpCircle, AlertCircle, RefreshCw,
  Percent, Tag, ArrowRight, Gift, ShoppingCart, Truck, X,
  ArrowLeft, ChevronDown, ChevronUp, Check, Star, ChevronLeft, Plus, Minus
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useApp } from '@/lib/AppContext';
import LottiePlayer from '@/components/LottiePlayer';
import Loader from '@/components/Loader';
import { MOCK_PRODUCTS, CATALOG_STRUCTURE } from '@/lib/data';
import {
  decodeCatalogSlugSegment,
  encodeCatalogSlugSegment,
  getAllCategoryPillLabel,
} from '@/lib/catalogSlug';
import { VirtualizedCatalogContainer } from '@/components/virtualCatalog/VirtualizedCatalogContainer';
import { withAssetPrefix } from '@/lib/sitePaths';

type PetType = 'cat' | 'dog' | 'bird' | 'rodent' | 'fish';

// Иллюстрация категории — единый логотип Айболит
const renderCategoryIllustration = (_id: string) => (
  <Image
    src={withAssetPrefix('/logo_aibolit.jpg')}
    alt=""
    width={56}
    height={56}
    className="w-14 h-14 object-cover rounded-full"
  />
);

interface CatalogProps {
  params: Promise<{ slug?: string[] }>;
}

function CatalogPageContent({ params }: CatalogProps) {
  // Unwrap Next.js 15 page params
  const { slug = [] } = React.use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Decode the URL state parameters (полная раскодировка — защита от двойного encode)
  const selectedAnimal: PetType = (slug[0] as PetType) || 'cat';
  const isBrandsCatalog = slug[0] === 'brands';
  const activeBrandName = isBrandsCatalog && slug[1]
    ? decodeCatalogSlugSegment(slug[1])
    : null;
  const activeSubcategoryId: string | null = isBrandsCatalog ? null : (slug[1] || null);
  const activeSubSection: string = isBrandsCatalog
    ? 'all'
    : (slug[2] ? decodeCatalogSlugSegment(slug[2]) : 'all');

  // Read query parameters
  const priceMin = searchParams?.get('priceMin') || '';
  const priceMax = searchParams?.get('priceMax') || '';
  const selectedBrands = useMemo(() => {
    const b = searchParams?.get('brands');
    return b ? b.split(',') : [];
  }, [searchParams]);
  const onSaleOnly = searchParams?.get('onSale') === 'true';
  const badgeFilterOnly = searchParams?.get('badge') === 'true';
  const sortType = (searchParams?.get('sort') as 'popular' | 'cheap-first' | 'expensive-first') || 'popular';
  const fromSource = searchParams?.get('from') || '';

  // Get active product object
  const activeProduct = useMemo(() => {
    if (slug.length >= 4) {
      const productId = slug[3];
      return MOCK_PRODUCTS.find(p => p.id === productId);
    }
    return null;
  }, [slug]);

  const [isCatalogLoading, setIsCatalogLoading] = React.useState<boolean>(false);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const { isFavorite, toggleFavorite, addToCart, cart, updateQty, productRatings, submitProductRating } = useApp();
  
  const displayRating = useMemo(() => {
    if (!activeProduct) return 0;
    return productRatings[activeProduct.id]?.rating ?? activeProduct.rating;
  }, [activeProduct, productRatings]);

  const displayReviews = useMemo(() => {
    if (!activeProduct) return 0;
    return productRatings[activeProduct.id]?.reviews ?? activeProduct.reviews;
  }, [activeProduct, productRatings]);

  const userRating = useMemo(() => {
    if (!activeProduct) return undefined;
    return productRatings[activeProduct.id]?.userRating;
  }, [activeProduct, productRatings]);

  const [userSelectedSize, setUserSelectedSize] = React.useState<{prodId: string, size: string} | null>(null);
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const [showRatingSuccess, setShowRatingSuccess] = React.useState<boolean>(false);

  const activeSize = useMemo(() => {
    if (!activeProduct) return '';
    if (userSelectedSize?.prodId === activeProduct.id) {
      return userSelectedSize.size;
    }
    return activeProduct.sizes?.[2] || activeProduct.sizes?.[0] || '';
  }, [activeProduct, userSelectedSize]);

  const liked = activeProduct ? isFavorite(activeProduct.id) : false;

  const activeProductCartItem = useMemo(() => {
    if (!activeProduct) return null;
    return cart.find(item => item.id === activeProduct.id && item.size === activeSize);
  }, [cart, activeProduct, activeSize]);
  const activeProductQty = activeProductCartItem ? activeProductCartItem.quantity : 0;

  // Helper function to update the 3-level slug path and filter query params in ONE unified go
  const updateUrl = (updates: {
    newSlug?: string[];
    query?: Record<string, string | null>;
    shouldScroll?: boolean;
  }) => {
    setIsCatalogLoading(true);

    // 1. Build new path
    let pathSegments = slug;
    if (updates.newSlug) {
      pathSegments = updates.newSlug;
    }
    const encodedSegments = pathSegments.map(s => encodeURIComponent(s));
    const path = `/catalog/${encodedSegments.join('/')}`;

    // 2. Build new search params
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    if (updates.query) {
      Object.entries(updates.query).forEach(([key, val]) => {
        if (val === null || val === '') {
          current.delete(key);
        } else {
          current.set(key, val);
        }
      });
    }

    const search = current.toString();
    const queryStr = search ? `?${search}` : '';

    // Non-Scrolling faceted navigation pushes state elegantly without refreshing viewport coordinates
    router.push(`${path}${queryStr}`, { scroll: false });

    setTimeout(() => {
      setIsCatalogLoading(false);
      if (updates.shouldScroll) {
        document.getElementById('large-catalog')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 280);
  };

  const handleClearFilters = () => {
    updateUrl({
      query: {
        priceMin: null,
        priceMax: null,
        brands: null,
        onSale: null,
        badge: null,
        sort: 'popular'
      }
    });
  };

  // Toggle brand array in queries
  const toggleBrandFilter = (brandName: string) => {
    let nextBrands = [...selectedBrands];
    if (nextBrands.includes(brandName)) {
      nextBrands = nextBrands.filter(b => b !== brandName);
    } else {
      nextBrands.push(brandName);
    }
    updateUrl({
      query: { brands: nextBrands.length > 0 ? nextBrands.join(',') : null }
    });
  };

  const searchParamValue = searchParams?.get('search') || '';
  const isSearchActive = !!searchParamValue;

  const [currentSlide, setCurrentSlide] = React.useState<number>(0);
  const [isHeroSliding, setIsHeroSliding] = React.useState(false);
  const [heroTrackWidth, setHeroTrackWidth] = React.useState(0);
  const [heroAnimCustom, setHeroAnimCustom] = React.useState({ direction: 1, offset: 1200 });
  const isHeroSlidingRef = React.useRef(false);
  const currentSlideRef = React.useRef(0);
  const heroTrackRef = React.useRef<HTMLDivElement>(null);
  const [lowerSlide, setLowerSlide] = React.useState<number>(0);
  const [timerDuration, setTimerDuration] = React.useState<number>(10000);
  const shouldReduceMotion = useReducedMotion();

  interface CarouselSlide {
    title: React.ReactNode;
    subtitle: string;
    badge: string;
    bgClass: string;
    bgGradient: string;
    btnText?: string;
    illustration: React.ReactNode;
    link?: { slug: string[]; query?: Record<string, string | null> };
  }

  const carouselSlides: CarouselSlide[] = [
    {
      title: "Новинка Grandin Holistic!",
      subtitle: "Сухой и влажный гипоаллергенный корм супер-премиум класса для кошек и собак.",
      badge: "Новинка",
      bgClass: "bg-[#D1F2D9]",
      bgGradient: "from-emerald-700 via-teal-800 to-green-900",
      btnText: "Перейти",
      illustration: (
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-300/30 rounded-full blur-2xl transform scale-90" />
          <Image
            src={withAssetPrefix('/logo_aibolit.jpg')}
            alt=""
            width={280}
            height={280}
            className="w-full h-full object-cover rounded-full relative z-10 drop-shadow-xl"
          />
        </div>
      ),
      link: { slug: ['cat', 'cat-food'] }
    },
    {
      title: (
        <>
          Все для здоровья <br className="hidden sm:inline" />
          и счастья{' '}
          <span className="text-[#F97316] relative inline-block">
            ваших лапок
            <svg className="absolute left-0 bottom-1 w-full h-2 text-orange-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
          </span>
        </>
      ),
      subtitle: "Отборные фермерские корма, сертифицированные витамины, средства ухода и развивающие интерактивные игрушки для ваших любимых питомцев.",
      badge: "Заботливый зоомаркет Айболит",
      bgClass: "bg-[#FCE3CF]",
      bgGradient: "from-orange-600 via-amber-600 to-yellow-700",
      illustration: (
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-2xl transform scale-90" />
          <Image
            src={withAssetPrefix('/logo_aibolit.jpg')}
            alt=""
            width={280}
            height={280}
            className="w-full h-full object-cover rounded-full relative z-10 drop-shadow-xl"
          />
        </div>
      ),
    },
    {
      title: "Сезонная защита от клещей и паразитов",
      subtitle: "Сертифицированная ветаптека: капли, ошейники, спреи и таблетки от ведущих ветеринарных брендов.",
      badge: "Ветаптека",
      bgClass: "bg-[#D5EBFD]",
      bgGradient: "from-sky-700 via-blue-800 to-indigo-900",
      btnText: "Выбрать защиту",
      illustration: (
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-2xl transform scale-90" />
          <Image
            src={withAssetPrefix('/logo_aibolit.jpg')}
            alt=""
            width={280}
            height={280}
            className="w-full h-full object-cover rounded-full relative z-10 drop-shadow-xl"
          />
        </div>
      ),
      link: { slug: ['cat', 'cat-flea'] }
    }
  ];

  const goToHeroSlide = React.useCallback((index: number, direction: number) => {
    if (isHeroSlidingRef.current) return;
    const total = carouselSlides.length;
    const nextIndex = ((index % total) + total) % total;
    if (nextIndex === currentSlideRef.current) return;

    const offset = heroTrackRef.current?.offsetWidth || heroTrackWidth || 1200;
    isHeroSlidingRef.current = true;
    currentSlideRef.current = nextIndex;
    setHeroAnimCustom({ direction, offset });
    setIsHeroSliding(true);
    setCurrentSlide(nextIndex);
  }, [carouselSlides.length, heroTrackWidth]);

  const unlockHeroSlide = React.useCallback(() => {
    isHeroSlidingRef.current = false;
    setIsHeroSliding(false);
  }, []);

  const handleNextSlide = () => {
    goToHeroSlide(currentSlideRef.current + 1, 1);
  };

  const handlePrevSlide = () => {
    goToHeroSlide(currentSlideRef.current - 1, -1);
  };

  const handleDotClick = (index: number) => {
    if (index === currentSlideRef.current) return;
    goToHeroSlide(index, index > currentSlideRef.current ? 1 : -1);
    setTimerDuration(15000);
  };

  React.useEffect(() => {
    if (slug.length !== 0 || isSearchActive || isHeroSliding) return;
    
    const interval = setTimeout(() => {
      goToHeroSlide(currentSlideRef.current + 1, 1);
      setTimerDuration(10000);
    }, timerDuration);
    
    return () => clearTimeout(interval);
  }, [currentSlide, timerDuration, slug.length, isSearchActive, isHeroSliding, goToHeroSlide]);

  // Страховка: не залипаем в isHeroSliding, если onExitComplete не пришёл
  React.useEffect(() => {
    if (!isHeroSliding) return;
    const unlock = setTimeout(unlockHeroSlide, 900);
    return () => clearTimeout(unlock);
  }, [isHeroSliding, currentSlide, unlockHeroSlide]);

  React.useLayoutEffect(() => {
    const el = heroTrackRef.current;
    if (!el) return;

    const updateWidth = () => setHeroTrackWidth(el.offsetWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, [slug.length, isSearchActive]);

  React.useEffect(() => {
    if (slug.length !== 0 || isSearchActive) return;
    
    const interval = setInterval(() => {
      setLowerSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 12000);
    
    return () => clearInterval(interval);
  }, [slug.length, isSearchActive, carouselSlides.length]);

  // Live filter mock products based on ALL filters
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    // 1. Match Search Query (matches name, brand, category, subSection, or animal)
    if (searchParamValue) {
      const q = searchParamValue.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(q) ||
        product.brand?.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.subSection && product.subSection.toLowerCase().includes(q)) ||
        (product.animal === 'cat' && 'кошка кошачий кот котята'.includes(q)) ||
        (product.animal === 'dog' && 'собака собачий пес щенок'.includes(q));
      
      if (!matchesSearch) return false;
    }

    // 2. Match Pet Type / Brand catalog
    const hasSlugAnimal = slug.length > 0;
    if (isBrandsCatalog) {
      if (activeBrandName && product.brand !== activeBrandName) return false;
    } else if ((hasSlugAnimal || !searchParamValue) && product.animal !== selectedAnimal) {
      return false;
    }

    // 3. Match Main Subcategory (e.g., cat-food)
    if (!isBrandsCatalog && activeSubcategoryId && product.subcategoryId !== activeSubcategoryId) return false;

    // 4. Match sub-section (e.g., 'Сухой корм')
    if (!isBrandsCatalog && activeSubSection !== 'all' && product.subSection !== activeSubSection) return false;

    // 5. Match On Sale only
    if (onSaleOnly && !product.onSale) return false;

    // 6. Match badge filtering (clearance/recommended items)
    if (badgeFilterOnly && !product.badge) return false;

    // 7. Match Price Range
    const price = product.price;
    if (priceMin !== '') {
      const min = parseFloat(priceMin);
      if (!isNaN(min) && price < min) return false;
    }
    if (priceMax !== '') {
      const max = parseFloat(priceMax);
      if (!isNaN(max) && price > max) return false;
    }

    // 8. Match Brands selection
    if (selectedBrands.length > 0) {
      if (!product.brand || !selectedBrands.includes(product.brand)) return false;
    }

    return true;
  });

  const categoryBaseProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      if (isBrandsCatalog) {
        if (activeBrandName && product.brand !== activeBrandName) return false;
        return true;
      }
      const hasSlugAnimal = slug.length > 0;
      if (hasSlugAnimal && product.animal !== selectedAnimal) return false;
      if (activeSubcategoryId && product.subcategoryId !== activeSubcategoryId) return false;
      if (activeSubSection !== 'all' && product.subSection !== activeSubSection) return false;
      return true;
    });
  }, [slug, selectedAnimal, activeSubcategoryId, activeSubSection, isBrandsCatalog, activeBrandName]);

  // Sorting
  if (sortType === 'cheap-first') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === 'expensive-first') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    // Default or popular (by rating)
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  // Get active subcategory object
  const activeSubcategory = activeSubcategoryId 
    ? Object.values(CATALOG_STRUCTURE)
        .flatMap(group => group.subcategories)
        .find(sub => sub.id === activeSubcategoryId)
    : null;

  // Faceted Brands Count calculations
  const availableBrandsInSubcategory = useMemo(() => {
    const brandsMap: Record<string, number> = {};
    MOCK_PRODUCTS.forEach(p => {
      const matchesScope = isBrandsCatalog
        ? (!activeBrandName || p.brand === activeBrandName)
        : (p.animal === selectedAnimal && (!activeSubcategoryId || p.subcategoryId === activeSubcategoryId));

      if (matchesScope && p.brand) {
        brandsMap[p.brand] = (brandsMap[p.brand] || 0) + 1;
      }
    });
    return Object.entries(brandsMap).map(([name, count]) => ({ name, count }));
  }, [selectedAnimal, activeSubcategoryId, isBrandsCatalog, activeBrandName]);

  const onSaleCount = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      if (isBrandsCatalog) {
        return (!activeBrandName || p.brand === activeBrandName) && p.onSale;
      }
      return p.animal === selectedAnimal && (!activeSubcategoryId || p.subcategoryId === activeSubcategoryId) && p.onSale;
    }).length;
  }, [selectedAnimal, activeSubcategoryId, isBrandsCatalog, activeBrandName]);

  const onBadgeCount = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      if (isBrandsCatalog) {
        return (!activeBrandName || p.brand === activeBrandName) && p.badge;
      }
      return p.animal === selectedAnimal && (!activeSubcategoryId || p.subcategoryId === activeSubcategoryId) && p.badge;
    }).length;
  }, [selectedAnimal, activeSubcategoryId, isBrandsCatalog, activeBrandName]);

  // Sidebar animals accordion map
  const [expandedAnimals, setExpandedAnimals] = React.useState<Record<PetType, boolean>>({
    cat: selectedAnimal === 'cat',
    dog: selectedAnimal === 'dog',
    bird: selectedAnimal === 'bird',
    rodent: selectedAnimal === 'rodent',
    fish: selectedAnimal === 'fish'
  });

  const [showAllSubcategories, setShowAllSubcategories] = React.useState<Record<string, boolean>>({});

  // Recently viewed products logic
  const [recentlyViewed, setRecentlyViewed] = React.useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recently_viewed_products');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });

  React.useEffect(() => {
    if (activeProduct) {
      const timer = setTimeout(() => {
        setRecentlyViewed(prev => {
          const filtered = prev.filter(id => id !== activeProduct.id);
          const next = [activeProduct.id, ...filtered].slice(0, 10);
          if (typeof window !== 'undefined') {
            localStorage.setItem('recently_viewed_products', JSON.stringify(next));
          }
          return next;
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeProduct]);

  // Smooth scroll to catalog grid when search query changes
  React.useEffect(() => {
    if (searchParamValue) {
      const timer = setTimeout(() => {
        const catalogEl = document.getElementById('large-catalog');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [searchParamValue]);

  const recentlyViewedProducts = useMemo(() => {
    const viewed = MOCK_PRODUCTS.filter(p => recentlyViewed.includes(p.id) && p.id !== activeProduct?.id);
    if (viewed.length < 8 && activeProduct) {
      const extra = MOCK_PRODUCTS.filter(
        p => p.animal === activeProduct.animal && p.id !== activeProduct.id && !viewed.some(v => v.id === p.id)
      ).slice(0, 8 - viewed.length);
      return [...viewed, ...extra];
    }
    return viewed;
  }, [recentlyViewed, activeProduct]);

  const toggleAnimalAccordion = (animal: PetType) => {
    setExpandedAnimals(prev => {
      const updated = { ...prev };
      (Object.keys(updated) as PetType[]).forEach(k => {
        updated[k] = k === animal ? !prev[animal] : false;
      });
      return updated;
    });
    updateUrl({
      newSlug: [animal]
    });
  };

  // Hot sales items for Carousel Section
  const hotSalesProducts = MOCK_PRODUCTS.filter(p => p.onSale);

  if (slug.length === 4 && activeProduct) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
        <Navbar />

        {/* Dedicated Product Detail Page Content */}
        <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
          <motion.div
            key="product-detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-10 md:space-y-14"
          >
            {/* Top back navigation button and share info */}
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <button
                onClick={() => {
                  if (fromSource === 'all') {
                    updateUrl({ newSlug: [slug[0], slug[1]] });
                  } else {
                    updateUrl({ newSlug: [slug[0], slug[1], slug[2]] });
                  }
                }}
                className="inline-flex items-center gap-2 text-xs font-bold font-comfortaa text-stone-500 hover:text-stone-900 group cursor-pointer bg-transparent border-0 outline-none"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Назад в &ldquo;{fromSource === 'all' ? activeSubcategory?.name : (activeSubSection === 'all' ? activeSubcategory?.name : activeSubSection)}&rdquo;</span>
              </button>
              <span className="text-[10px] font-mono text-stone-400">ID товара: {activeProduct.id}</span>
            </div>

            {/* Main grid: Left image, Right details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
              {/* Left block: Beautiful illustration container */}
              <div className="bg-stone-50 rounded-3xl p-8 flex items-center justify-center aspect-square border border-stone-100/50 relative overflow-hidden group">
                <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
                  {activeProduct.onSale && (
                    <span className="bg-orange-500 text-white text-xs font-black font-comfortaa px-3 py-1 rounded-full shadow-sm">
                      Скидка –{activeProduct.salePct}%
                    </span>
                  )}
                  {activeProduct.badge && (
                    <span className="bg-emerald-500 text-white text-xs font-black font-comfortaa px-3 py-1 rounded-full shadow-sm">
                      {activeProduct.badge}
                    </span>
                  )}
                </div>
                <div className="scale-150 transform group-hover:scale-[1.75] transition-transform duration-500">
                  <Image
                    src={withAssetPrefix('/logo_aibolit.jpg')}
                    alt={activeProduct.name}
                    width={144}
                    height={144}
                    className="w-36 h-36 object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Right block: Information, select options, price, CTA */}
              <div className="space-y-6">
                <div className="space-y-2">
                  {activeProduct.brand && (
                    <span className="text-xs font-bold text-orange-500 font-comfortaa uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                      {activeProduct.brand}
                    </span>
                  )}
                  <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-comfortaa leading-tight mt-2">
                    {activeProduct.name}
                  </h1>
                  
                  {/* Rating, reviews, and status info */}
                  <div className="flex items-center gap-4 text-xs font-medium text-stone-500 pt-1">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-stone-700 text-sm">{displayRating}</span>
                      <span>({displayReviews} отзывов)</span>
                    </div>
                    <span>•</span>
                    {activeProduct.inStock !== false ? (
                      <span className="text-emerald-600 font-bold">🐾 В наличии</span>
                    ) : (
                      <span className="text-rose-600 font-bold">❌ Нет в наличии</span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-stone-100" />

                {/* Sizes / Weight selection */}
                {activeProduct.sizes && activeProduct.sizes.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest font-comfortaa">Выберите фасовку / размер:</span>
                    <div className="flex flex-wrap gap-2">
                      {activeProduct.sizes.map((sz) => {
                        const isSel = activeSize === sz;
                        return (
                          <button
                            key={sz}
                            onClick={() => setUserSelectedSize({ prodId: activeProduct.id, size: sz })}
                            className={`px-4 py-2 text-xs font-bold font-comfortaa rounded-xl border transition-all cursor-pointer ${
                              isSel 
                                ? 'bg-stone-900 border-stone-900 text-white shadow-xs' 
                                : 'bg-stone-50 border-stone-200/50 text-stone-600 hover:bg-stone-100'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price and Add to Cart Section */}
                <div className="bg-stone-50 border border-stone-100 rounded-3xl p-5 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-orange-500 font-comfortaa">
                      {activeProduct.price} ₽
                    </span>
                    {activeProduct.onSale && activeProduct.oldPrice && (
                      <span className="text-sm sm:text-base text-stone-400 line-through font-inter">
                        {activeProduct.oldPrice} ₽
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {activeProductQty > 0 ? (
                      <div className="flex-1 flex items-center justify-between bg-white p-1 rounded-full border border-stone-200 shadow-xs h-[52px] px-2">
                        <button
                          onClick={() => updateQty(activeProduct.id, -1, activeSize)}
                          className="w-10 h-10 rounded-full bg-stone-50 hover:bg-orange-50 hover:text-orange-500 flex items-center justify-center text-stone-600 transition-colors shadow-xs cursor-pointer border-0"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-base font-black text-stone-900 font-mono">
                          {activeProductQty} шт.
                        </span>
                        <button
                          onClick={() => updateQty(activeProduct.id, 1, activeSize)}
                          className="w-10 h-10 rounded-full bg-stone-50 hover:bg-orange-50 hover:text-orange-500 flex items-center justify-center text-stone-600 transition-colors shadow-xs cursor-pointer border-0"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : activeProduct.inStock === false ? (
                      <button
                        disabled
                        className="flex-1 bg-stone-100 text-stone-400 font-bold font-comfortaa py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all text-sm cursor-not-allowed border-0 outline-none h-[52px]"
                      >
                        <span>Товар временно отсутствует</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(activeProduct, activeSize)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 text-sm cursor-pointer border-0 outline-none h-[52px]"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Добавить в корзину</span>
                      </button>
                    )}
                    <button
                      onClick={() => toggleFavorite(activeProduct.id)}
                      className={`p-3.5 rounded-full border border-stone-200 transition-colors flex items-center justify-center cursor-pointer h-[52px] w-[52px] ${
                        liked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white text-stone-500 hover:bg-stone-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Fast delivery and pick-up options */}
                <div className="grid grid-cols-2 gap-4 text-[11px] font-inter text-stone-600">
                  <div className="flex items-start gap-2 bg-stone-50/50 border border-stone-100 p-3 rounded-2xl">
                    <Truck className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-800 block">Быстрая доставка</span>
                      <span>Курьером на дом сегодня или завтра. Бесплатно от 2000₽.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-stone-50/50 border border-stone-100 p-3 rounded-2xl">
                    <Award className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-800 block">Забрать в магазине</span>
                      <span>Самовывоз через 30 минут из любого зоомаркета бесплатно.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product detailed description & nutrition */}
            <div className="border-t border-stone-100 pt-8 space-y-6">
              <h3 className="text-sm font-black font-comfortaa text-stone-900 uppercase tracking-wider">Описание и характеристики товара</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-3 text-xs leading-relaxed text-stone-600 font-inter">
                  <p>
                    Высококачественный сбалансированный рацион класса супер-премиум разработан ведущими ветеринарными диетологами специально для вашего питомца. Содержит отборное свежее мясо, комплекс незаменимых витаминов и минералов, а также натуральные пребиотики для отличного пищеварения и крепкого иммунитета.
                  </p>
                  <p>
                    Уникальная рецептура бережно заботится о здоровье кожи и шерсти питомца благодаря оптимальному балансу жирных кислот Омега-3 и Омега-6. Хрустящие гранулы обеспечивают бережную механическую чистку зубов и профилактику зубного камня.
                  </p>
                </div>
                
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 font-inter space-y-2.5 text-xs text-stone-600">
                  <span className="font-bold text-stone-800 block">Спецификация:</span>
                  <div className="flex justify-between border-b border-stone-200/50 pb-1.5">
                    <span>Тип корма</span>
                    <span className="font-semibold text-stone-800">{activeProduct.type === 'food' ? 'Полнорационный' : 'Вспомогательный'}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/50 pb-1.5">
                    <span>Животное</span>
                    <span className="font-semibold text-stone-800 capitalize">
                      {activeProduct.animal === 'cat' && 'Кошки'}
                      {activeProduct.animal === 'dog' && 'Собаки'}
                      {activeProduct.animal === 'bird' && 'Птицы'}
                      {activeProduct.animal === 'universal' && 'Универсальное'}
                    </span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Класс товара</span>
                    <span className="font-semibold text-stone-800">Супер-Премиум / Холистик</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Rating Section */}
            <div className="border-t border-stone-100 pt-8 pb-4 space-y-4">
              <h3 className="text-sm font-black font-comfortaa text-stone-900 uppercase tracking-wider">
                Оценка товара покупателями
              </h3>
              <div className="bg-stone-50 border border-stone-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 text-center md:text-left">
                  <span className="text-sm font-bold text-stone-800 block">Как вам этот товар?</span>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-md">
                    Поделитесь своим мнением о товаре с другими владельцами питомцев. Ваша оценка поможет сделать правильный выбор!
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((stars) => {
                      const isLit = hoverRating !== null ? stars <= hoverRating : stars <= (userRating ?? 0);
                      return (
                        <button
                          key={stars}
                          type="button"
                          onMouseEnter={() => setHoverRating(stars)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => {
                            submitProductRating(activeProduct.id, stars);
                            setShowRatingSuccess(true);
                            setTimeout(() => setShowRatingSuccess(false), 3000);
                          }}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer border-none bg-transparent"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              isLit ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                            } transition-colors`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {userRating !== undefined ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                      <span>Ваша оценка: {userRating} из 5. Спасибо! 🐾</span>
                    </span>
                  ) : showRatingSuccess ? (
                    <span className="text-xs font-bold text-orange-650 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 animate-pulse">
                      Оценка сохранена! 🎉
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400 font-medium">
                      Нажмите на звезду, чтобы поставить оценку
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION: RECENTLY VIEWED (Вы смотрели недавно) */}
            {/* Нужно чтобы было "Похожие товары" или "Рекоммендуемые товары" */}
            {recentlyViewedProducts.length > 0 && (
              <div className="border-t border-stone-100 pt-10 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg sm:text-xl font-black font-comfortaa text-stone-900 uppercase tracking-tight flex items-center gap-2">
                    <span>Похожие</span>
                  </h3>

                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollCarousel('left')}
                      className="p-1.5 rounded-full border border-stone-200 bg-white hover:bg-orange-50 hover:border-orange-500 text-stone-600 hover:text-orange-500 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
                      aria-label="Назад"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollCarousel('right')}
                      className="p-1.5 rounded-full border border-stone-200 bg-white hover:bg-orange-50 hover:border-orange-500 text-stone-600 hover:text-orange-500 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
                      aria-label="Вперед"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scroll container with no-scrollbar style */}
                <div 
                  ref={carouselRef}
                  className="flex gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {recentlyViewedProducts.map((p) => (
                    <div 
                      key={p.id} 
                      className="w-[280px] sm:w-[300px] flex-shrink-0 snap-start"
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    );
  }

    const currentHeroSlide = carouselSlides[currentSlide] || carouselSlides[0];
    // Premium ease-out Quint
    const heroSlideEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
    const heroSlideDuration = shouldReduceMotion ? 0 : 0.65;

    return (
      <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
        <Navbar />

        {/* SECTION 1: HERO — full-bleed panel slide (фон + контент вместе) */}
        <section
          className="relative overflow-hidden -mt-[114px]"
          aria-roledescription="carousel"
          aria-label="Промо-баннер"
        >
          <div
            ref={heroTrackRef}
            className="relative h-[542px] sm:h-[594px] md:h-[634px] overflow-hidden"
          >
            <AnimatePresence
              initial={false}
              custom={heroAnimCustom}
              onExitComplete={unlockHeroSlide}
            >
              <motion.div
                key={currentSlide}
                custom={heroAnimCustom}
                variants={{
                  enter: ({ direction, offset }: { direction: number; offset: number }) => ({
                    x: direction * offset,
                  }),
                  center: { x: 0 },
                  exit: ({ direction, offset }: { direction: number; offset: number }) => ({
                    x: direction * -offset,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: heroSlideDuration, ease: heroSlideEase }}
                className={`absolute inset-0 ${currentHeroSlide.bgClass} pt-[114px] ${
                  isHeroSliding ? 'pointer-events-none' : ''
                }`}
              >
                <div className="h-full py-6 md:py-10 px-4 sm:px-6 lg:px-8 flex items-center">
                  <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center h-[380px] sm:h-[400px] md:h-[440px]">
                    <div className="lg:col-span-7 space-y-4 md:space-y-5 text-left flex flex-col justify-center h-full">
                      <div>
                        <span className="inline-block bg-black/10 text-stone-900 font-extrabold font-comfortaa text-xs md:text-sm px-4 py-1.5 rounded-full uppercase tracking-wider">
                          {currentHeroSlide.badge}
                        </span>
                      </div>

                      <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-stone-900 font-comfortaa leading-[1.1] tracking-tight">
                        {currentHeroSlide.title}
                      </h1>

                      <p className="text-base sm:text-lg text-stone-800 font-inter max-w-xl leading-relaxed font-medium">
                        {currentHeroSlide.subtitle}
                      </p>

                      {currentHeroSlide.btnText && currentHeroSlide.link && (
                        <div className="pt-1 flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              updateUrl({
                                newSlug: currentHeroSlide.link!.slug,
                                query: currentHeroSlide.link!.query,
                                shouldScroll: true
                              });
                            }}
                            className="px-8 py-3.5 bg-black hover:bg-stone-800 text-white font-black font-comfortaa text-sm md:text-base rounded-full shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group cursor-pointer"
                          >
                            <span>{currentHeroSlide.btnText}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-5 flex justify-center lg:justify-end items-center h-full">
                      {currentHeroSlide.illustration}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls поверх трека, ниже навбара */}
          <div className="absolute inset-x-0 top-[114px] bottom-0 z-30 pointer-events-none">
            <button
              type="button"
              onClick={handlePrevSlide}
              disabled={isHeroSliding}
              className="pointer-events-auto absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-13 md:h-13 bg-black/90 hover:bg-stone-800 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer group disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-default backdrop-blur-[2px]"
              title="Предыдущий слайд"
              aria-label="Предыдущий слайд"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleNextSlide}
              disabled={isHeroSliding}
              className="pointer-events-auto absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-13 md:h-13 bg-black/90 hover:bg-stone-800 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer group disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-default backdrop-blur-[2px]"
              title="Следующий слайд"
              aria-label="Следующий слайд"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="pointer-events-auto absolute inset-x-0 bottom-5 md:bottom-7 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex items-center gap-2">
                  {carouselSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleDotClick(idx)}
                      disabled={isHeroSliding}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer disabled:cursor-default ${
                        idx === currentSlide
                          ? 'w-10 bg-stone-900'
                          : 'w-6 bg-stone-900/25 hover:bg-stone-900/45'
                      }`}
                      title={`Слайд ${idx + 1}`}
                      aria-label={`Слайд ${idx + 1}`}
                      aria-current={idx === currentSlide ? 'true' : undefined}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* SECTION 2: HOT WEEKLY OFFERS CAROUSEL — временно отключено */}
      {false && (
      <section id="promotions-area" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 border-b border-stone-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold font-comfortaa text-orange-650 uppercase tracking-widest block bg-orange-100/60 px-2.5 py-1 rounded-full w-max">Акции зоомагазина</span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-comfortaa tracking-tight">Горячие скидки недели 🔥</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#1C1917] to-[#292524] text-white p-6 rounded-[28px] relative overflow-hidden flex flex-col justify-between shadow-lg h-72">
            <div className="space-y-2 relative z-10">
              <span className="bg-[#EF4444] text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">Успей купить</span>
              <h3 className="text-lg md:text-xl font-bold font-comfortaa leading-snug pt-2">Скидки до -30% на сухие холистики</h3>
              <p className="text-xs text-stone-300 font-inter font-light">Свежайшее фермерское мясо кролика и индейки для идеального здоровья шерсти.</p>
            </div>
            <div className="flex justify-between items-center pt-4 relative z-10">
              <span className="text-xl font-black font-comfortaa">Ownat & Mera</span>
              <button 
                onClick={() => {
                  const targetAnimal = selectedAnimal === 'dog' ? 'dog' : 'cat';
                  updateUrl({
                    newSlug: [targetAnimal, `${targetAnimal}-food`],
                    query: { onSale: 'true' },
                    shouldScroll: true
                  });
                }}
                className="p-3 bg-white hover:bg-orange-500 hover:text-white text-stone-950 rounded-full transition-all group/btn cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
            {/* Absolute background patterns */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-orange-500/10 rounded-full blur-2xl" />
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-[28px] relative overflow-hidden flex flex-col justify-between shadow-lg h-72">
            <div className="space-y-2 relative z-10">
              <span className="bg-white/20 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">Забота</span>
              <h3 className="text-lg md:text-xl font-bold font-comfortaa leading-snug pt-2">Бесплатная экспресс доставка от 1500₽</h3>
              <p className="text-xs text-orange-50 font-inter font-light">Доставляем любые корма, тяжелые наполнители и ветаптеку прямо в коридор вашей квартиры за 1 час!</p>
            </div>
            <div className="flex justify-between items-center pt-4 relative z-10">
              <span className="text-xl font-black font-comfortaa">Айболит Экспресс</span>
              <Link href="/cart" className="p-3 bg-white text-orange-600 hover:bg-orange-50 hover:scale-105 rounded-full transition-all flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white p-6 rounded-[28px] relative overflow-hidden flex flex-col justify-between shadow-lg h-72">
            <div className="space-y-2 relative z-10">
              <span className="bg-emerald-500 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">Безопасно</span>
              <h3 className="text-lg md:text-xl font-bold font-comfortaa leading-snug pt-2">Защита от паразитов до -20%</h3>
              <p className="text-xs text-sky-100 font-inter font-light">Брендовые ошейники Foresto, капли на холку Inspector и капли Elanco для мелких и крупных пород собак.</p>
            </div>
            <div className="flex justify-between items-center pt-4 relative z-10">
              <span className="text-xl font-black font-comfortaa">Паразитология 🔬</span>
              <button 
                onClick={() => {
                  const targetAnimal = selectedAnimal === 'dog' ? 'dog' : 'cat';
                  updateUrl({
                    newSlug: [targetAnimal, `${targetAnimal}-flea`],
                    query: { onSale: 'true' },
                    shouldScroll: true
                  });
                }}
                className="p-3 bg-white text-[#0284C7] hover:bg-orange-50 hover:scale-105 rounded-full transition-all flex items-center justify-center cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Big Banner Carousel for Homepage and Subpages (Point 6 & Point 4) */}
        {slug.length < 4 && !isSearchActive && (
          <div className="pt-10 space-y-6">
            <div className="relative overflow-hidden rounded-[32px] shadow-xl h-[420px] sm:h-[320px]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={lowerSlide}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.55 }}
                  className={`absolute inset-0 w-full h-full bg-gradient-to-br ${carouselSlides[lowerSlide].bgGradient} text-white p-6 sm:p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden`}
                >
                  <div className="space-y-3 sm:space-y-4 max-w-xl text-left relative z-10 flex flex-col justify-center h-full">
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-black font-comfortaa leading-tight pt-1">
                      {carouselSlides[lowerSlide].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-100/90 font-inter font-light leading-relaxed max-w-xl">
                      {carouselSlides[lowerSlide].subtitle}
                    </p>
                    {carouselSlides[lowerSlide].link && (
                      <button
                        onClick={() => updateUrl({
                          newSlug: carouselSlides[lowerSlide].link!.slug,
                          query: carouselSlides[lowerSlide].link!.query,
                          shouldScroll: true
                        })}
                        className="mt-1 px-6 py-2.5 bg-white hover:bg-orange-500 text-stone-900 hover:text-white font-extrabold font-comfortaa text-xs rounded-full shadow-md hover:-translate-y-0.5 transition-all w-max cursor-pointer border-0 outline-none block"
                      >
                        Подробнее ⚡
                      </button>
                    )}
                  </div>
                  
                  <div className="absolute right-4 bottom-4 opacity-15 sm:relative sm:opacity-90 sm:right-0 sm:bottom-0 shrink-0 w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 flex items-center justify-center">
                    {carouselSlides[lowerSlide].illustration}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Navigation Dots */}
            <div className="flex items-center justify-center gap-2.5">
              {carouselSlides.map((_, idx) => {
                const isActive = idx === lowerSlide;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLowerSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer border-0 outline-none ${
                      isActive ? 'w-8 bg-orange-500 shadow-sm' : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`Слайд ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </section>
      )}

      {/* SECTION 3: THE MAIN INTERACTIVE VIRTUALIZED CATALOG AREA */}
      {slug.length <= 1 && !isSearchActive ? (
        <section id="large-catalog" className="py-6 space-y-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-comfortaa tracking-tight">
              Каталог товаров зоомаркета 🐾
            </h2>
          </div>

          <VirtualizedCatalogContainer
            selectedAnimal={slug[0] || 'all'}
            onSelectSubcategory={(subId, categoryId, subSection) => {
              if (subId === 'all') {
                updateUrl({ newSlug: [categoryId] });
              } else if (subSection) {
                updateUrl({ newSlug: [categoryId, subId, subSection] });
              } else {
                updateUrl({ newSlug: [categoryId, subId] });
              }
            }}
          />
        </section>
      ) : (
        <section id="large-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          
          {/* Title area */}
        <div className="flex flex-col gap-3.5 border-b border-stone-150 pb-5">
          {/* Active Breadcrumbs (Task 3 URL level visualization) */}
          {slug.length > 0 && (
            <div className="flex items-center flex-wrap gap-1.5 text-xs text-stone-500 font-comfortaa bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200 w-fit">
              {slug.length >= 1 && (
                <button onClick={() => updateUrl({ newSlug: [slug[0]], query: { search: null, priceMin: null, priceMax: null, brands: null, onSale: null, badge: null } })} className="hover:text-orange-500 font-bold capitalize bg-transparent border-none p-0 cursor-pointer">
                  {isBrandsCatalog ? 'Бренды' : (CATALOG_STRUCTURE[slug[0]]?.name || slug[0])}
                </button>
              )}
              {isBrandsCatalog && activeBrandName && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-semibold text-orange-500">{activeBrandName}</span>
                </>
              )}
              {!isBrandsCatalog && slug.length >= 2 && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  <button onClick={() => updateUrl({ newSlug: [slug[0], slug[1]], query: { search: null, priceMin: null, priceMax: null, brands: null, onSale: null, badge: null } })} className="hover:text-orange-500 font-bold bg-transparent border-none p-0 cursor-pointer">
                    {activeSubcategory?.name || slug[1]}
                  </button>
                </>
              )}
              {!isBrandsCatalog && slug.length >= 3 && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  {slug.length === 3 ? (
                    <span className="font-semibold text-orange-500">{activeSubSection}</span>
                  ) : (
                    <button onClick={() => updateUrl({ newSlug: [slug[0], slug[1], slug[2]], query: { search: null, priceMin: null, priceMax: null, brands: null, onSale: null, badge: null } })} className="hover:text-orange-500 font-bold bg-transparent border-none p-0 cursor-pointer">
                      {activeSubSection}
                    </button>
                  )}
                </>
              )}
              {!isBrandsCatalog && slug.length >= 4 && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-semibold text-orange-500 max-w-[140px] truncate">{activeProduct?.name || slug[3]}</span>
                </>
              )}
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-comfortaa tracking-tight">
              {(() => {
                const animalName = CATALOG_STRUCTURE[selectedAnimal]?.name;
                
                let targetAnimal = 'питомцев';
                if (selectedAnimal === 'cat') targetAnimal = 'кошек';
                else if (selectedAnimal === 'dog') targetAnimal = 'собак';
                else if (selectedAnimal === 'bird') targetAnimal = 'птиц';
                else if (selectedAnimal === 'rodent') targetAnimal = 'грызунов';
                else if (selectedAnimal === 'fish') targetAnimal = 'рыб';

                if (slug.length === 0) {
                  return searchParamValue 
                    ? `Результаты поиска по запросу «${searchParamValue}»` 
                    : 'Каталог товаров зоомаркета';
                }
                if (isBrandsCatalog) {
                  if (activeBrandName) {
                    return `Товары бренда ${activeBrandName}`;
                  }
                  return 'Бренды';
                }
                if (slug.length === 1) {
                  return `Товары для ${targetAnimal}`;
                }
                if (slug.length >= 4 && activeProduct) {
                  return activeProduct.brand ? `Товар бренда ${activeProduct.brand}` : 'Карточка товара';
                }
                if (activeSubcategory) {
                  if (activeSubSection !== 'all') {
                    return `${activeSubSection} для ${targetAnimal}`;
                  }
                  return `${activeSubcategory.name} для ${targetAnimal}`;
                }
                return 'Каталог зоомаркета';
              })()}
            </h2>
          </div>
        </div>

        {/* Catalog core structure wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar (Animal selection and Subcategories, 3 columns width) */}
          {slug.length < 4 && (
            <aside className="lg:col-span-3 space-y-6">
            
            {/* Level 3: Seamless Filters Sidebar */}
            {true && (
              <div className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-xs space-y-6">
                {/* Seamless Divider & Filters */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-sm font-bold font-comfortaa text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Filter className="w-4 h-4 text-stone-500" />
                      <span>Фильтры поиска</span>
                    </span>
                    {(priceMin || priceMax || selectedBrands.length > 0 || onSaleOnly || badgeFilterOnly) && (
                      <button 
                        type="button"
                        onClick={handleClearFilters}
                        className="text-xs font-bold text-red-500 hover:text-red-700 font-comfortaa uppercase tracking-wider cursor-pointer bg-transparent border-0"
                      >
                        Сбросить
                      </button>
                    )}
                  </div>

                  {/* Sale/Recommended filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block font-comfortaa">Полезные свойства</label>
                    
                    <div className="space-y-1.5 font-inter">
                      <button
                        type="button"
                        onClick={() => updateUrl({ query: { onSale: onSaleOnly ? null : 'true' } })}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs md:text-sm font-semibold cursor-pointer transition-all border-0 ${
                          onSaleOnly ? 'bg-orange-500/10 text-orange-650 font-bold' : 'bg-transparent text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 opacity-75" />
                          <span>Только со скидкой</span>
                        </div>
                        <span className="bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full text-[10px] font-mono">{onSaleCount}</span>
                      </button>
                    </div>
                  </div>

                  {/* Price filter */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block font-comfortaa">Диапазон цены (₽)</label>
                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <input
                        type="number"
                        value={priceMin}
                        onChange={(e) => updateUrl({ query: { priceMin: e.target.value } })}
                        placeholder="От"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:text-sm focus:outline-none focus:border-orange-500 font-medium"
                      />
                      <input
                        type="number"
                        value={priceMax}
                        onChange={(e) => updateUrl({ query: { priceMax: e.target.value } })}
                        placeholder="До"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:text-sm focus:outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Brands filter */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block font-comfortaa">Бренды производители</label>
                    
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {availableBrandsInSubcategory.map((brand) => {
                        const isSelected = selectedBrands.includes(brand.name);
                        return (
                          <button
                            key={brand.name}
                            type="button"
                            onClick={() => toggleBrandFilter(brand.name)}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-xs md:text-sm font-semibold cursor-pointer transition-all border-0 ${
                              isSelected ? 'bg-orange-500/10 text-orange-650 font-bold' : 'bg-transparent text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${
                                isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-stone-300 bg-white'
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span>{brand.name}</span>
                            </div>
                            <span className="text-[10px] text-stone-400 font-mono">({brand.count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </aside>
        )}

          {/* Right Product Grid Column / Product Detail Page */}
          <div className={`${slug.length === 4 ? 'lg:col-span-12' : 'lg:col-span-9'} space-y-6`}>
            
            <AnimatePresence mode="wait">
              {/* --- LEVEL 1: ROOT CATALOG OVERVIEW --- */}
              {slug.length === 0 && !isSearchActive && (
                <motion.div
                  key="root-catalog-overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-12"
                >
                  {(Object.keys(CATALOG_STRUCTURE) as PetType[]).map((animalKey) => {
                    const animal = CATALOG_STRUCTURE[animalKey];
                    return (
                      <div key={animalKey} className="space-y-4">
                        {/* Header block */}
                        <div 
                          onClick={() => {
                            updateUrl({ newSlug: [animalKey] });
                          }}
                          className="bg-white border border-stone-200/80 hover:border-orange-500 rounded-2xl px-6 py-4 flex items-center justify-between shadow-xs cursor-pointer group hover:shadow-sm transition-all"
                        >
                          <h3 className="text-sm sm:text-base font-extrabold font-comfortaa text-stone-900 group-hover:text-orange-500 transition-colors uppercase tracking-wide">
                            {animal.name}
                          </h3>
                          <button
                            type="button"
                            className="text-xs font-bold text-stone-600 hover:text-orange-500 flex items-center gap-1 group/link cursor-pointer"
                          >
                            <span>Все категории</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        {/* Grid of the first 4 subcategories */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {animal.subcategories.slice(0, 4).map((subcat) => (
                            <motion.div
                              key={subcat.id}
                              onClick={() => {
                                updateUrl({ newSlug: [animalKey, subcat.id] });
                              }}
                              className="bg-white border border-stone-200/80 rounded-2xl p-5 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-between text-center gap-3 group h-44 relative overflow-hidden"
                            >
                              <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                                {renderCategoryIllustration(subcat.id)}
                              </div>
                              
                              <span className="text-[11px] font-extrabold font-comfortaa text-stone-800 group-hover:text-orange-500 transition-colors leading-tight line-clamp-2">
                                {subcat.name}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {/* --- LEVEL 2: SELECTED ANIMAL CATEGORIES OVERVIEW --- */}
              {slug.length === 1 && !isSearchActive && (
                <motion.div
                  key="animal-catalog-overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-12"
                >
                  {CATALOG_STRUCTURE[selectedAnimal]?.subcategories.map((subcat) => {
                    return (
                      <div key={subcat.id} className="space-y-4">
                        {/* Header block */}
                        <div 
                          onClick={() => {
                            updateUrl({ newSlug: [selectedAnimal, subcat.id] });
                          }}
                          className="bg-white border border-stone-200/80 hover:border-orange-500 rounded-2xl px-6 py-4 flex items-center justify-between shadow-xs cursor-pointer group hover:shadow-sm transition-all"
                        >
                          <h3 className="text-sm sm:text-base font-extrabold font-comfortaa text-stone-900 group-hover:text-orange-500 transition-colors uppercase tracking-wide">
                            {subcat.name}
                          </h3>
                          <button
                            type="button"
                            className="text-xs font-bold text-stone-600 hover:text-orange-500 flex items-center gap-1 group/link cursor-pointer"
                          >
                            <span>Все разделы</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        {/* Grid of subsections */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {subcat.subSections.map((sec) => (
                            <motion.div
                              key={sec}
                              onClick={() => {
                                updateUrl({ newSlug: [selectedAnimal, subcat.id, sec] });
                              }}
                              className="bg-white border border-stone-200/80 rounded-2xl p-5 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-between text-center gap-3 group h-44 relative overflow-hidden"
                            >
                              <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                                {renderCategoryIllustration(subcat.id)}
                              </div>
                              
                              <span className="text-[11px] font-extrabold font-comfortaa text-stone-800 group-hover:text-orange-500 transition-colors leading-tight line-clamp-2">
                                {sec}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {/* --- LEVEL 3: PRODUCT LIST & FILTERS GRID --- */}
              {((slug.length >= 2 && slug.length <= 3) || isSearchActive) && (
                <motion.div
                  key="category-product-grid-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >

                  {/* Horizontal Pills for Subcategory Navigation */}
                  {slug.length >= 2 && activeSubcategory && !isSearchActive && (
                    <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
                      <button
                        onClick={() => updateUrl({ newSlug: [selectedAnimal, activeSubcategoryId!] })}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold font-comfortaa transition-all border cursor-pointer ${
                          activeSubSection === 'all'
                            ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-orange-500 hover:text-orange-500'
                        }`}
                      >
                        {getAllCategoryPillLabel(activeSubcategory.name)}
                      </button>
                      {activeSubcategory.subSections.map((sec) => {
                        const isSel = activeSubSection === sec;
                        return (
                          <button
                            key={sec}
                            onClick={() => updateUrl({ newSlug: [selectedAnimal, activeSubcategoryId!, sec] })}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold font-comfortaa transition-all border cursor-pointer ${
                              isSel
                                ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                                : 'bg-white border-stone-200 text-stone-600 hover:border-orange-500 hover:text-orange-500'
                            }`}
                          >
                            {sec}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Dynamic Sorting header bar */}
                  <div className="flex justify-between items-center text-xs py-2 border-b border-stone-100/60 pb-3">
                    <span className="font-semibold font-comfortaa text-stone-500">
                      Найдено <strong className="text-stone-900">{filteredProducts.length}</strong> предложений
                    </span>

                    <div className="flex items-center gap-2 font-inter text-stone-700">
                      <span className="hidden sm:inline text-stone-400">Сортировать по:</span>
                      <select
                        value={sortType}
                        onChange={(e) => updateUrl({ query: { sort: e.target.value } })}
                        className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-orange-500 font-semibold text-xs animate-none"
                      >
                        <option value="popular">По популярности</option>
                        <option value="cheap-first">Сначала дешевые</option>
                        <option value="expensive-first">Сначала дорогие</option>
                      </select>
                    </div>
                  </div>

                  {/* Product card dynamic mapping */}
                  {isCatalogLoading ? (
                    <div className="py-24">
                      <Loader />
                    </div>
                  ) : categoryBaseProducts.length === 0 ? (
                    <div className="max-w-md mx-auto text-center py-16 space-y-4">
                      <span className="text-4xl">🐾</span>
                      <h3 className="text-lg font-bold font-comfortaa text-stone-900">Раздел наполнении</h3>
                      <p className="text-xs text-stone-500 leading-normal">
                        В этой категории пока нет товаров. Мы уже работаем над расширением нашего каталога и скоро завезем качественные новинки для ваших любимцев!
                      </p>
                      <button
                        onClick={() => updateUrl({ newSlug: [selectedAnimal] })}
                        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa rounded-full text-xs transition-all cursor-pointer shadow-sm shadow-orange-500/10"
                      >
                        {isBrandsCatalog ? 'Вернуться к брендам' : 'Вернуться к питомцу'}
                      </button>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="max-w-md mx-auto text-center py-16 space-y-4">
                      <span className="text-4xl">😿</span>
                      <h3 className="text-lg font-bold font-comfortaa text-stone-900">По вашим фильтрам ничего не найдено</h3>
                      <p className="text-xs text-stone-500 leading-normal">
                        Попробуйте смягчить ценовой порог, выбрать другого производителя или сбросить активные фильтры.
                      </p>
                      <button
                        onClick={handleClearFilters}
                        className="px-5 py-2 border-2 border-[#1C1917] hover:bg-[#1C1917] hover:text-white font-bold font-comfortaa rounded-full text-xs transition-all cursor-pointer"
                      >
                        Сбросить фильтры
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}

                </motion.div>
              )}


            </AnimatePresence>

          </div>

        </div>

      </section>
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default function CatalogClient(props: CatalogProps) {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader />
      </div>
    }>
      <CatalogPageContent {...props} />
    </React.Suspense>
  );
}
