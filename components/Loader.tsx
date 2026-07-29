'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LottiePlayer from './LottiePlayer';

interface LoaderProps {
  fullPage?: boolean;
  text?: string;
  className?: string;
}

export default function Loader({ fullPage = false, text = 'Загрузка...', className = '' }: LoaderProps) {
  if (fullPage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 gap-4"
      >
        <div className="w-64 h-24 flex items-center justify-center select-none">
          <LottiePlayer type="decor-paws" className="w-full h-full" />
        </div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="text-stone-700 font-bold font-comfortaa text-sm tracking-wide text-center"
        >
          {text}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 gap-3 ${className}`}>
      <div className="w-64 h-16 flex items-center justify-center select-none">
        <LottiePlayer type="decor-paws" className="w-full h-full" />
      </div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        className="text-[#F97316]/80 font-bold font-comfortaa text-xs tracking-wide"
      >
        {text}
      </motion.p>
    </div>
  );
}
