'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { MOCK_PRODUCTS } from './data';
import type { Product } from '@/components/ProductCard';
import CartToast from '@/components/CartToast';

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  imageType: 'food' | 'medicine' | 'accessory' | 'toy';
  size?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  address?: string;
}

export interface ToastData {
  product: Product;
  recommendation: Product | null;
}

export interface AddToCartOptions {
  /** Не показывать CartToast (например, при добавлении уже со страницы корзины) */
  silent?: boolean;
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (product: any, size?: string, options?: AddToCartOptions) => void;
  removeFromCart: (id: string, size?: string) => void;
  updateQty: (id: string, delta: number, size?: string) => void;
  clearCart: () => void;
  favorites: string[]; // array of product IDs
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  user: UserProfile | null;
  login: (name: string, phone: string, email: string, address?: string) => void;
  updateAddress: (address: string) => void;
  logout: () => void;
  authDrawerOpen: boolean;
  setAuthDrawerOpen: (open: boolean) => void;
  checkoutType: 'delivery' | 'pickup';
  setCheckoutType: (type: 'delivery' | 'pickup') => void;
  pickupAddress: string;
  setPickupAddress: (address: string) => void;
  productRatings: Record<string, { rating: number; reviews: number; userRating?: number }>;
  submitProductRating: (productId: string, rating: number) => void;
  toastData: ToastData | null;
  dismissToast: () => void;
  pauseToastTimer: () => void;
  resumeToastTimer: () => void;
}

const TOAST_DURATION_MS = 7000;

function findRecommendation(
  product: Product,
  excludeIds: string[] = [],
  cartProductIds: string[] = []
): Product | null {
  const excluded = new Set([product.id, ...excludeIds, ...cartProductIds]);
  const candidates = MOCK_PRODUCTS.filter(
    (p) => p.animal === product.animal && !excluded.has(p.id) && p.inStock !== false
  );

  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function resolveProduct(product: any): Product | null {
  if (product?.animal && product?.type && product?.name) {
    return product as Product;
  }
  return MOCK_PRODUCTS.find((p) => p.id === product?.id) ?? null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'Ownat Adult Sterilized Classic Сухой корм для стерилизованных кошек средней активности, с птицей',
    category: 'Корма',
    price: 2400,
    oldPrice: 2999,
    quantity: 1,
    imageType: 'food',
    size: '1,5 кг'
  },
  {
    id: '3',
    name: 'Ownat Adult Sterilized Grain Free Just Беззерновой сухой корм для взрослых стерилизованных кошек, с курицей',
    category: 'Корма',
    price: 1529,
    quantity: 1,
    imageType: 'food',
    size: '1 кг'
  },
  {
    id: '5',
    name: 'Кошачий защитный ошейник Foresto от блох, клещей и вшей для мелких собак и кошек Elanco Foresto',
    category: 'Ветаптека',
    price: 3450,
    oldPrice: 4300,
    quantity: 1,
    imageType: 'medicine',
    size: '38 см'
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [checkoutType, setCheckoutType] = useState<'delivery' | 'pickup'>('delivery');
  const [pickupAddress, setPickupAddress] = useState('ул. Ленина, д. 12 (м. Площадь Ленина, Зоомаркет Айболит)');
  const [productRatings, setProductRatings] = useState<Record<string, { rating: number; reviews: number; userRating?: number }>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastToastProductIdRef = useRef<string | null>(null);
  const toastVisibleRef = useRef(false);
  const toastPausedRef = useRef(false);

  // Hydration from localStorage
  useEffect(() => {
    setTimeout(() => {
      try {
        const storedCart = localStorage.getItem('aibolit_cart');
        const storedFavs = localStorage.getItem('aibolit_favorites');
        const storedUser = localStorage.getItem('aibolit_user');
        const storedCheckoutType = localStorage.getItem('aibolit_checkout_type');
        const storedPickup = localStorage.getItem('aibolit_pickup_address');
        const storedRatings = localStorage.getItem('aibolit_product_ratings');

        if (storedRatings) {
          setProductRatings(JSON.parse(storedRatings));
        }

        if (storedCart) {
          setCart(JSON.parse(storedCart));
        } else {
          setCart(INITIAL_CART_ITEMS);
        }

        if (storedFavs) {
          setFavorites(JSON.parse(storedFavs));
        } else {
          // Pre-fill some favorites for presentation
          setFavorites(['1', '5']);
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (storedCheckoutType === 'delivery' || storedCheckoutType === 'pickup') {
          setCheckoutType(storedCheckoutType);
        }

        if (storedPickup) {
          setPickupAddress(storedPickup);
        }
      } catch (e) {
        console.error('Error reading localStorage', e);
        setCart(INITIAL_CART_ITEMS);
        setFavorites(['1', '5']);
      }
      setIsLoaded(true);
    }, 0);
  }, []);

  // Save states to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('aibolit_cart', JSON.stringify(cart));
  }, [cart, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('aibolit_favorites', JSON.stringify(favorites));
  }, [favorites, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (user) {
      localStorage.setItem('aibolit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aibolit_user');
    }
  }, [user, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('aibolit_checkout_type', checkoutType);
  }, [checkoutType, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('aibolit_pickup_address', pickupAddress);
  }, [pickupAddress, isLoaded]);

  const clearToastTimer = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
  }, []);

  const scheduleToastDismiss = useCallback(() => {
    clearToastTimer();
    toastTimerRef.current = setTimeout(() => {
      lastToastProductIdRef.current = null;
      toastVisibleRef.current = false;
      toastPausedRef.current = false;
      setToastData(null);
      toastTimerRef.current = null;
    }, TOAST_DURATION_MS);
  }, [clearToastTimer]);

  const dismissToast = useCallback(() => {
    clearToastTimer();
    lastToastProductIdRef.current = null;
    toastVisibleRef.current = false;
    toastPausedRef.current = false;
    setToastData(null);
  }, [clearToastTimer]);

  const pauseToastTimer = useCallback(() => {
    // Игнор hover на пустом wrapper, когда тоста нет
    if (!toastVisibleRef.current) return;
    toastPausedRef.current = true;
    clearToastTimer();
  }, [clearToastTimer]);

  const resumeToastTimer = useCallback(() => {
    if (!toastPausedRef.current) return;
    toastPausedRef.current = false;
    if (!toastVisibleRef.current) return;
    scheduleToastDismiss();
  }, [scheduleToastDismiss]);

  const showCartToast = useCallback((
    product: Product,
    excludeIds: string[] = [],
    cartProductIds: string[] = []
  ) => {
    clearToastTimer();
    lastToastProductIdRef.current = product.id;
    toastVisibleRef.current = true;
    setToastData({
      product,
      recommendation: findRecommendation(product, excludeIds, cartProductIds),
    });
    // Не стартуем таймер, пока курсор над тостом (пауза при наведении)
    if (!toastPausedRef.current) {
      scheduleToastDismiss();
    }
  }, [clearToastTimer, scheduleToastDismiss]);

  useEffect(() => {
    return () => clearToastTimer();
  }, [clearToastTimer]);

  const addToCart = useCallback((product: any, size?: string, options?: AddToCartOptions) => {
    let nextCartProductIds: string[] = [];

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.size === size);
      const nextCart =
        existingIndex > -1
          ? prev.map((item, idx) =>
              idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
            )
          : [
              ...prev,
              {
                id: product.id,
                name: product.name,
                category: product.category || 'Товары',
                price: product.price,
                oldPrice: product.oldPrice,
                quantity: 1,
                imageType: product.type || 'food',
                size: size || (product.sizes?.[0] || undefined)
              }
            ];

      nextCartProductIds = nextCart.map((item) => item.id);
      return nextCart;
    });

    if (options?.silent) {
      // Синхронизируем открытый тост: не предлагать товар, который уже в корзине
      setToastData((prev) => {
        if (!prev?.recommendation) return prev;
        if (!nextCartProductIds.includes(prev.recommendation.id)) return prev;
        return {
          ...prev,
          recommendation: findRecommendation(
            prev.product,
            [prev.recommendation.id],
            nextCartProductIds
          ),
        };
      });
      return;
    }

    const resolved = resolveProduct(product);
    if (resolved) {
      const previousProductId = lastToastProductIdRef.current;
      const excludeIds =
        previousProductId && previousProductId !== resolved.id ? [previousProductId] : [];
      showCartToast(resolved, excludeIds, nextCartProductIds);
    }
  }, [showCartToast]);

  const removeFromCart = (id: string, size?: string) => {
    setCart(prev => prev.filter(item => {
      if (item.id !== id) return true;
      if (size !== undefined && item.size !== size) return true;
      return false;
    }));
  };

  const updateQty = (id: string, delta: number, size?: string) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.id === id && (size === undefined || item.size === size)) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      });
      return updated.filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  const login = (name: string, phone: string, email: string, address?: string) => {
    const avatarList = ['🐱', '🐶', '🐹', '🦜', '🐠'];
    const randomAvatar = avatarList[Math.floor(Math.random() * avatarList.length)];
    setUser({
      name,
      phone,
      email,
      avatar: randomAvatar,
      address: address || ''
    });
    setAuthDrawerOpen(false);
  };

  const updateAddress = (address: string) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        address
      };
    });
  };

  const logout = () => {
    setUser(null);
  };

  const submitProductRating = (productId: string, rating: number) => {
    setProductRatings(prev => {
      const existing = prev[productId];
      const defaultProduct = MOCK_PRODUCTS.find(p => p.id === productId);
      const startRating = defaultProduct ? defaultProduct.rating : 5.0;
      const startReviews = defaultProduct ? defaultProduct.reviews : 0;

      const currentRating = existing ? existing.rating : startRating;
      const currentReviews = existing ? existing.reviews : startReviews;
      const hasUserRated = existing && existing.userRating !== undefined;

      let nextReviews = currentReviews;
      let nextRating = currentRating;

      if (hasUserRated) {
        const prevUserRating = existing.userRating || 0;
        nextRating = Math.round(((currentRating * currentReviews - prevUserRating + rating) / currentReviews) * 10) / 10;
      } else {
        nextReviews = currentReviews + 1;
        nextRating = Math.round(((currentRating * currentReviews + rating) / nextReviews) * 10) / 10;
      }

      const updated = {
        ...prev,
        [productId]: {
          rating: nextRating,
          reviews: nextReviews,
          userRating: rating
        }
      };

      localStorage.setItem('aibolit_product_ratings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      favorites,
      toggleFavorite,
      isFavorite,
      user,
      login,
      updateAddress,
      logout,
      authDrawerOpen,
      setAuthDrawerOpen,
      checkoutType,
      setCheckoutType,
      pickupAddress,
      setPickupAddress,
      productRatings,
      submitProductRating,
      toastData,
      dismissToast,
      pauseToastTimer,
      resumeToastTimer,
    }}>
      {children}
      <CartToast />
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
