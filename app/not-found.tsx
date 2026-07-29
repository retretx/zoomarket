'use client';
import React from 'react';
import Link from 'next/link';
import { Home, HelpCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import LottiePlayer from '@/components/LottiePlayer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-16 flex-grow flex flex-col items-center justify-center text-center space-y-8 select-none">
        <div className="h-44 w-full max-w-sm">
          <LottiePlayer type="sleeping-cat" className="h-full w-full" />
        </div>
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3.5 py-1.5 rounded-full text-xs font-bold font-comfortaa uppercase tracking-wider mb-2">
            😿 Ошибка 404: Страница не найдена
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-comfortaa text-stone-900 tracking-tight">
            Ой! Тут ничего нет...
          </h1>
          <p className="text-sm text-stone-500 font-inter leading-relaxed max-w-sm mx-auto">
            Похоже, наш хвостик заигрался и затащил эту страничку под диван! Давайте вернемся в наш каталог и найдем что-нибудь полезное.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa text-xs rounded-full shadow-md shadow-orange-500/15 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>В каталог Айболит</span>
          </Link>
          <Link
            href="/delivery"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold font-comfortaa text-xs rounded-full transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Доставка и оплата</span>
          </Link>
        </div>
      </main>
      <footer className="bg-stone-900 text-stone-400 py-10 px-4 mt-20 border-t border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-inter text-stone-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-comfortaa text-sm">🐾 Айболит</span>
            <span>— Забота в каждой детали</span>
          </div>
          <p>© 2026 Сеть зоомаркетов «Айболит». Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
