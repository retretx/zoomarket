'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Info, HelpCircle, Shield, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

import Navbar from '@/components/Navbar';
import LottiePlayer from '@/components/LottiePlayer';
import { MOCK_DISTRICTS } from '@/lib/data';

export default function DeliveryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        
        {/* Back Link Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-500 font-comfortaa transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Назад в каталог</span>
          </Link>
        </div>

        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-orange-500 font-comfortaa text-xs font-bold uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full">
            Курьерская Служба
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-950 font-comfortaa tracking-tight">
            Оформить доставку Айболита
          </h1>
          <p className="text-sm text-stone-500 font-inter leading-relaxed">
            Доставим лечебные корма, капли, ошейники и игрушки прямо к вашей двери. Оставьте заявку ниже, наши логисты составят лучший экологический маршрут.
          </p>
        </div>

        {/* Form + Animation Split Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* 1. Request Form Layout (Left 7 Columns) */}
          <section className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-sm space-y-8">
            <h2 className="text-lg md:text-xl font-bold font-comfortaa text-stone-900 pb-3 border-b border-stone-150">
              📋 Анкета доставки лакомств
            </h2>

            {/* Custom Input Styles applied precisely */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              
              {/* Row: Contact Name and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
                    Ваше Имя
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Александр Иванов"
                    className="w-full px-4 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
                    Контактный Телефон
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+7 (999) 123-45-67"
                    className="w-full px-4 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* District Select and Delivery Address */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="col-span-1 space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
                    Район доставки
                  </label>
                  <select
                    className="w-full px-3 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
                  >
                    {MOCK_DISTRICTS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
                    Улица, дом, квартира
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ленинский проспект, д. 45, кв. 112"
                    className="w-full px-4 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Time preferences and Pet Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
                    Интервал доставки
                  </label>
                  <select
                    className="w-full px-3 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
                  >
                    <option>Сегодня: 12:00 – 15:00</option>
                    <option>Сегодня: 15:00 – 18:00</option>
                    <option>Сегодня: 18:00 – 21:00</option>
                    <option>Завтра: Любое время с 09:00</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
                    Кто ждет подарок в заказе?
                  </label>
                  <select
                    className="w-full px-3 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
                  >
                    <option>🐱 Кот / Кошка</option>
                    <option>🐶 Собака / Щенок</option>
                    <option>🐦 Попугай / Птичка</option>
                    <option>🐾 Другой забавный питомец</option>
                  </select>
                </div>
              </div>

              {/* Delivery Comments */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
                  Комментарий для курьера службы доставки
                </label>
                <textarea
                  rows={3}
                  placeholder="Оставьте здесь пожелания: например, позвонить за 15 минут, передать консьержу или не звонить в дверь, так как собака пугается звуков..."
                  className="w-full px-4 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium resize-none"
                ></textarea>
              </div>

              {/* Submit button: size="lg", background: #F97316, rounded-pill */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold font-inter text-sm md:text-base rounded-full shadow-sm transition-colors text-center cursor-pointer"
              >
                🚀 Заказать бережную доставку Айболит
              </motion.button>
            </form>

            {/* Safety policy warning */}
            <div className="flex items-start gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-150">
              <Shield className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-stone-500 space-y-1 font-inter">
                <p className="font-bold text-stone-800">Безопасная бесконтактная передача</p>
                <p>Все медицинские средства защиты соблюдаются. Заказы со сложными ветеринарными препаратами комплектуются в изотермических пакетах с температурными датчиками.</p>
              </div>
            </div>
          </section>

          {/* 2. Side visual area (Right 5 Columns) with Lottie Courier animation */}
          <section className="lg:col-span-5 space-y-6">
            
            {/* Courier scooter motion/lottie block (as required) */}
            <div className="h-72">
              <LottiePlayer type="courier-scooter" className="h-full w-full" />
            </div>

            {/* Key benefits bento layout */}
            <div className="bg-[#FFF7ED] rounded-[24px] p-6 border border-orange-100 space-y-5">
              <h3 className="text-sm font-bold font-comfortaa text-orange-950 uppercase tracking-wider flex items-center gap-2">
                <span>📍 Условия Доставки</span>
              </h3>
              
              <ul className="space-y-4 text-xs text-stone-700 font-inter">
                <li className="flex gap-3">
                  <span className="text-base">🚀</span>
                  <div>
                    <strong>Бесплатно от 1500 ₽:</strong> При меньшей стоимости заказа доставка по городу составит фиксированные 290 ₽.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-base">🕒</span>
                  <div>
                    <strong>Экспресс доставка:</strong> Для рецептурных лекарств и экстренных аксессуаров за 1 час! Действует курьерский сбор.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-base">🦴</span>
                  <div>
                    <strong>Подарок-сюрприз:</strong> В каждую доставку мы упаковываем вкусный экологический комплимент от Айболита.
                  </div>
                </li>
              </ul>

              {/* Micro warning notice */}
              <div className="text-[11px] text-stone-500 border-t border-orange-200/50 pt-4 leading-normal">
                Возникли перебои с адресацией? Свяжитесь с нами напрямую по номеру <strong className="text-orange-950 font-bold">8 (800) 555-35-35</strong> для ручной коррекции координации.
              </div>
            </div>

            {/* Satisfied user metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 text-center">
                <span className="block text-xl md:text-2xl font-bold font-comfortaa text-stone-900">43,000+</span>
                <span className="block text-[10px] sm:text-xs text-stone-500 font-inter mt-1 uppercase tracking-wider">Доставок сделано</span>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 text-center">
                <span className="block text-xl md:text-2xl font-bold font-comfortaa text-green-650">99.4%</span>
                <span className="block text-[10px] sm:text-xs text-stone-500 font-inter mt-1 uppercase tracking-wider">Довольных хвостиков</span>
              </div>
            </div>

          </section>

        </div>
      </main>

      {/* Primary footer */}
      <footer className="bg-stone-900 text-stone-450 py-8 px-4 border-t border-stone-800 text-center">
        <div className="max-w-7xl mx-auto text-xs text-stone-400 font-inter">
          🐾 Айболит за быструю доставку. Разработано с любовью к усатым и крылатым.
        </div>
      </footer>
    </div>
  );
}
