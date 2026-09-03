'use client';

import React from 'react';
import { SubcategoryGridSkeleton } from './SubcategoryGridSkeleton';

interface CategorySectionSkeletonProps {
  /**
   * Число карточек в каждом блоке подкатегории (как в реальном контенте).
   * Длина массива = число блоков.
   */
  cardCounts: number[];
}

/**
 * Скелетон контента раздела — повторяет разметку CategorySection
 * (шапка подкатегории + сетка карточек), чтобы удерживать высоту при загрузке.
 */
export const CategorySectionSkeleton: React.FC<CategorySectionSkeletonProps> = ({
  cardCounts,
}) => {
  const blocks = cardCounts.length > 0 ? cardCounts : [4];

  return (
    <div className="space-y-8" aria-hidden="true">
      {blocks.map((cardCount, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <div className="bg-white border border-stone-200/80 rounded-2xl px-5 py-3.5">
            <div className="h-3.5 sm:h-4 bg-stone-200 rounded-md w-40 sm:w-52" />
          </div>
          <SubcategoryGridSkeleton count={Math.max(1, cardCount)} />
        </div>
      ))}
    </div>
  );
};
