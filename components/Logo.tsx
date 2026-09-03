'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { withAssetPrefix } from '@/lib/sitePaths';

export default function Logo({ 
  className = 'w-12 h-12', 
  hideText = false,
  isWhite = false
}: { 
  className?: string; 
  hideText?: boolean;
  isWhite?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 select-none">
      <motion.div 
        className={`relative ${className} flex-shrink-0 overflow-hidden rounded-full`}
        whileHover={{ scale: 1.05, rotate: 2 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <Image
          src={withAssetPrefix('/logo_aibolit.jpg')}
          alt="Айболит"
          width={96}
          height={96}
          className="w-full h-full object-cover drop-shadow-sm"
          priority
        />
      </motion.div>

      {!hideText && (
        <div className="flex flex-col text-left">
          <span className={`text-xl md:text-2xl font-bold font-comfortaa tracking-tight leading-none ${isWhite ? 'text-white' : 'text-stone-900'}`}>
            Айболит
          </span>
          <span className={`text-[10px] md:text-xs font-semibold font-inter uppercase tracking-widest mt-0.5 ${isWhite ? 'text-stone-450' : 'text-orange-500'}`}>
            Заботливый зоомагазин
          </span>
        </div>
      )}
    </div>
  );
}
