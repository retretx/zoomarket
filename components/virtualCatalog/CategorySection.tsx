'use client';

import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import Image from 'next/image';
import { Category, SubCategory } from '@/lib/types/virtualCatalog';
import {
  fetchSubcategoriesForCategory,
  getCachedSubcategories,
  getSubcategorySkeletonPlan,
} from '@/lib/api/virtualCatalogApi';
import { CategorySectionSkeleton } from './CategorySectionSkeleton';
import { MOCK_PRODUCTS } from '@/lib/data';
import { withAssetPrefix } from '@/lib/sitePaths';

interface CategorySectionProps {
  category: Category;
  onSelectSubcategory?: (subId: string, categoryId: string, subSection?: string) => void;
  /** Вызывается, когда контент готов (из кэша или после сети) — для снятия lockedHeight. */
  onContentReady?: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  onSelectSubcategory,
  onContentReady,
}) => {
  const isBrandsCategory = category.id === 'brands';

  const brandNames = useMemo(() => {
    if (!isBrandsCategory) return [];
    const unique = new Set<string>();
    MOCK_PRODUCTS.forEach((product) => {
      if (product.brand?.trim()) {
        unique.add(product.brand.trim());
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'ru'));
  }, [isBrandsCategory]);

  const initialCached = getCachedSubcategories(category.id);
  const [subcategories, setSubcategories] = useState<SubCategory[]>(
    () => (isBrandsCategory ? [] : initialCached ?? [])
  );
  const [isLoading, setIsLoading] = useState(() =>
    isBrandsCategory ? false : !initialCached
  );

  useEffect(() => {
    if (isBrandsCategory) {
      setSubcategories([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const cached = getCachedSubcategories(category.id);

    // Уже в кэше — мгновенно, без скелетона и без сетевой задержки.
    if (cached) {
      setSubcategories(cached);
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);

    // Эмулируем сетевой запрос с задержкой только для первой загрузки раздела.
    // output: 'export' — динамические route.ts недоступны, используем Promise-эмуляцию.
    fetchSubcategoriesForCategory(category.id, 500)
      .then((data) => {
        if (isMounted) {
          setSubcategories(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch subcategories:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category.id, isBrandsCategory]);

  // Сообщаем контейнеру, что высота уже соответствует реальному контенту.
  useLayoutEffect(() => {
    if (!isLoading) {
      onContentReady?.();
    }
  }, [isLoading, onContentReady]);

  return (
    <div
      data-category-id={category.id}
      className="space-y-6 md:space-y-8"
    >
      {/* Category Section Main Animal Header (Only text title, no icon or subtitle) */}
      <div className="pb-1 pt-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-comfortaa text-stone-900 tracking-tight uppercase">
          {category.name}
        </h2>
      </div>

      {isBrandsCategory ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {brandNames.map((brand) => (
            <div
              key={brand}
              onClick={() => onSelectSubcategory?.(brand, category.id)}
              className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-between text-center gap-3 group h-44 relative overflow-hidden"
            >
              <div className="w-14 h-14 bg-stone-50/80 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-stone-100 p-2">
                <Image
                  src={withAssetPrefix('/logo_aibolit.jpg')}
                  alt={brand}
                  width={40}
                  height={40}
                  className="object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>

              <span className="text-[11px] sm:text-xs font-bold font-comfortaa text-stone-800 group-hover:text-orange-500 transition-colors leading-tight line-clamp-2">
                {brand}
              </span>
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <CategorySectionSkeleton
          cardCounts={getSubcategorySkeletonPlan(category.id)}
        />
      ) : (
        <div className="space-y-8">
          {subcategories.map((subcat) => (
            <div key={subcat.id} className="space-y-3">
              {/* Subcategory Header bar in a rounded white container card */}
              <div
                onClick={() => onSelectSubcategory?.(subcat.id, category.id)}
                className="bg-white border border-stone-200/80 rounded-2xl px-5 py-3.5 shadow-xs cursor-pointer hover:border-orange-500 transition-colors"
              >
                <h3 className="text-xs sm:text-sm font-black font-comfortaa text-stone-900 uppercase tracking-wider">
                  {subcat.name}
                </h3>
              </div>

              {/* Grid of subsections */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {subcat.subSections && subcat.subSections.length > 0 ? (
                  subcat.subSections.map((sec) => (
                    <div
                      key={sec}
                      onClick={() =>
                        onSelectSubcategory?.(subcat.id, category.id, sec)
                      }
                      className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-between text-center gap-3 group h-44 relative overflow-hidden"
                    >
                      <div className="w-14 h-14 bg-stone-50/80 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-stone-100 p-2">
                        <Image
                          src={withAssetPrefix('/logo_aibolit.jpg')}
                          alt="Айболит"
                          width={40}
                          height={40}
                          className="object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <span className="text-[11px] sm:text-xs font-bold font-comfortaa text-stone-800 group-hover:text-orange-500 transition-colors leading-tight line-clamp-2">
                        {sec}
                      </span>
                    </div>
                  ))
                ) : (
                  <div
                    onClick={() =>
                      onSelectSubcategory?.(subcat.id, category.id)
                    }
                    className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-between text-center gap-3 group h-44 relative overflow-hidden"
                  >
                    <div className="w-14 h-14 bg-stone-50/80 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-stone-100 p-2">
                      <Image
                        src={withAssetPrefix('/logo_aibolit.jpg')}
                        alt="Айболит"
                        width={40}
                        height={40}
                        className="object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <span className="text-[11px] sm:text-xs font-bold font-comfortaa text-stone-800 group-hover:text-orange-500 transition-colors leading-tight line-clamp-2">
                      {subcat.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
