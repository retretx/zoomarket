'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Mail, LogOut, Heart, ShoppingBag, History, Award, Settings, MapPin } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import Link from 'next/link';

export default function AuthDrawer() {
  const { user, login, updateAddress, logout, authDrawerOpen, setAuthDrawerOpen } = useApp();

  // Login form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  // Address editing states
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Пожалуйста, введите ваше имя');
      return;
    }
    if (!phone.trim()) {
      setError('Пожалуйста, введите номер телефона');
      return;
    }
    setError('');
    login(name, phone, email, address);
    // Reset form
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
  };

  return (
    <AnimatePresence>
      {authDrawerOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAuthDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm"
          />

          {/* Right-side Slide-over Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-100"
          >
            {/* Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-2">
                <span className="text-xl">🐾</span>
                <span className="font-extrabold font-comfortaa text-stone-950 text-base md:text-lg">
                  {user ? 'Личный кабинет' : 'Вход в Айболит'}
                </span>
              </div>
              <button
                onClick={() => setAuthDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 transition-all cursor-pointer"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {user ? (
                /* --- LOGGED IN USER INTERFACE --- */
                <div className="space-y-6">
                  {/* User Profile Badge */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 p-5 rounded-2xl border border-orange-100 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm border border-orange-200">
                      {user.avatar || '🐱'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-md uppercase tracking-wide">
                          Покупатель
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold font-comfortaa text-stone-900 leading-tight">
                        {user.name}
                      </h4>
                      <p className="text-xs text-stone-500 font-mono font-medium">{user.phone}</p>
                    </div>
                  </div>

                  {/* Profile details details list */}
                  <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-100 text-xs text-stone-700 font-inter">
                    {user.email && (
                      <div className="flex items-center gap-2.5 pb-2 border-b border-stone-150">
                        <Mail className="w-4 h-4 text-stone-400" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                      <span>Дата регистрации:</span>
                      <strong>Сегодня (Тестовый сеанс)</strong>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block pl-1">
                      Адрес доставки покупателя
                    </span>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 text-xs text-stone-700 space-y-3">
                      {isEditingAddress ? (
                        <div className="space-y-2">
                          <textarea
                            value={tempAddress}
                            onChange={(e) => setTempAddress(e.target.value)}
                            placeholder="Например: ул. Александра Невского, д. 14Б, кв. 102"
                            className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-inter text-stone-900 focus:outline-none focus:border-orange-500"
                            rows={3}
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setIsEditingAddress(false)}
                              className="px-3 py-1.5 border border-stone-200 text-stone-500 rounded-lg font-bold font-comfortaa text-[11px] hover:bg-stone-100 cursor-pointer"
                            >
                              Отмена
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateAddress(tempAddress);
                                setIsEditingAddress(false);
                              }}
                              className="px-3 py-1.5 bg-orange-500 text-white rounded-lg font-bold font-comfortaa text-[11px] hover:bg-orange-600 cursor-pointer"
                            >
                              Сохранить
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                            <span className={user.address ? "text-stone-800 font-medium" : "text-stone-400 italic"}>
                              {user.address || 'Адрес не указан. Добавьте его для быстрого заказа!'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setTempAddress(user.address || '');
                              setIsEditingAddress(true);
                            }}
                            className="text-[11px] font-bold text-orange-600 hover:text-orange-700 font-comfortaa cursor-pointer flex-shrink-0"
                          >
                            Изменить
                          </button>
                        </div>
                      )}
                    </div>
                  </div>



                  {/* Recent Activity / Order History */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block pl-1">
                      История заказов
                    </span>

                    <div className="space-y-2.5">
                      <div className="bg-white border border-stone-100 p-3 rounded-xl flex items-center justify-between text-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-stone-800">Заказ № 582914</p>
                          <p className="text-[10px] text-stone-500">3 товара • Оплата курьеру</p>
                        </div>
                        <span className="bg-green-150 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          Доставлен ✅
                        </span>
                      </div>
                      <div className="bg-white border border-stone-100 p-3 rounded-xl flex items-center justify-between text-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-stone-800">Заказ № 581403</p>
                          <p className="text-[10px] text-stone-500">1 товар • Самовывоз</p>
                        </div>
                        <span className="bg-stone-150 text-stone-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          Завершен 👍
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Logout Action Button */}
                  <div className="pt-6 border-t border-stone-100">
                    <button
                      onClick={() => {
                        logout();
                      }}
                      className="w-full py-3 border-2 border-red-500/20 hover:border-red-500/40 hover:bg-red-50 text-red-650 font-bold font-comfortaa rounded-full text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Выйти из аккаунта</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* --- ANONYMOUS AUTHORIZATION FORM --- */
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold font-comfortaa text-stone-900 leading-tight">
                      Авторизуйтесь в 1 клик!
                    </h3>
                    <p className="text-xs text-stone-500 font-inter leading-relaxed">
                      Введите ваше имя и телефон, чтобы сохранять питомцев в избранном, копить бонусы и отслеживать курьера на карте.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3.5 bg-red-50 border border-red-100 text-red-650 text-xs rounded-xl font-medium font-inter">
                      ⚠️ {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                        Ваше Имя *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Василий Иванович"
                          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                        Номер телефона *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+7 (999) 123-45-67"
                          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                        Электронная почта (Email)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@aibolit.ru"
                          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
                        />
                      </div>
                    </div> */}

                    <div className="pt-3">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold font-comfortaa text-sm rounded-full shadow-md shadow-orange-500/10 transition-colors cursor-pointer"
                      >
                        🚀 Войти в личный кабинет
                      </motion.button>
                    </div>
                  </form>

                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
