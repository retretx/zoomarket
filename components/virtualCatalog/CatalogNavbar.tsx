'use client';

import React, { useRef, useEffect } from 'react';
import { Category } from '@/lib/types/virtualCatalog';
import { motion } from 'motion/react';

interface CatalogNavbarProps {
  categories: Category[];
  activeIndex: number;
  onSelectCategoryIndex: (index: number) => void;
  isLoading?: boolean;
}

export const CatalogNavbar: React.FC<CatalogNavbarProps> = ({
  categories,
  activeIndex,
  onSelectCategoryIndex,
  isLoading = false
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll the active tab into view horizontally in the Navbar
  useEffect(() => {
    if (!scrollContainerRef.current || activeIndex < 0) return;
    const activeTab = scrollContainerRef.current.querySelector<HTMLElement>(
      `[data-nav-index="${activeIndex}"]`
    );
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeIndex]);

  if (isLoading && categories.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-[72px] z-40 py-2.5 px-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-stone-200 rounded-full shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md border-y border-stone-200/80 sticky top-[76px] md:top-[84px] z-40 py-3 px-4 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full"
        >
          {categories.map((category, idx) => {
            const isActive = idx === activeIndex;

            return (
              <button
                key={category.id}
                data-nav-index={idx}
                onClick={() => onSelectCategoryIndex(idx)}
                className={`relative px-4 py-2 rounded-full font-comfortaa text-xs md:text-sm font-extrabold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer border ${
                  isActive
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm scale-105'
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700 border-stone-200/60 hover:text-stone-900'
                }`}
              >
                <span className="text-sm md:text-base">{category.icon}</span>
                <span>{category.name}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeCategoryIndicator"
                    className="absolute inset-0 bg-orange-500 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
