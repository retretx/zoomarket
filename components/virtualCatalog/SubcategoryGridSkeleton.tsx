'use client';

import React from 'react';

interface SubcategoryGridSkeletonProps {
  /** Число карточек в сетке подразделов. */
  count?: number;
}

/**
 * Скелетон сетки карточек — размеры как у реальных ячеек CategorySection (h-44).
 */
export const SubcategoryGridSkeleton: React.FC<SubcategoryGridSkeletonProps> = ({
  count = 4,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between gap-3 h-44"
        >
          <div className="w-14 h-14 bg-stone-200 rounded-2xl shrink-0" />
          <div className="h-3 bg-stone-200 rounded-md w-3/5" />
        </div>
      ))}
    </div>
  );
};
