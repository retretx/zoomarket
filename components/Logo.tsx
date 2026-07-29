'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

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
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-white ring-1 ring-stone-200/80 flex-shrink-0">
        <Image
          src="/logo_aibolit.jpg"
          alt="Айболит"
          width={56}
          height={56}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Brand Name Text Header */}
      {!hideText && (
        <div className="flex flex-col text-left">
          <span className={`text-xl md:text-2xl font-bold font-comfortaa tracking-tight leading-none ${isWhite ? 'text-white' : 'text-stone-900'}`}>
            Айболит
          </span>
          <span className={`text-[10px] md:text-xs font-semibold font-inter uppercase tracking-widest mt-0.5 ${isWhite ? 'text-stone-450' : 'text-orange-500'}`}>
            Заботливый зоомаркет
          </span>
        </div>
      )}
    </div>
  );
}
