'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, MapPin, CheckCircle, CreditCard, Clock,
  User, Phone, FileText, ShoppingBag, ShieldCheck, Mail, Calendar, Truck, Store, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import Navbar from '@/components/Navbar';
import LottiePlayer from '@/components/LottiePlayer';
import { useApp } from '@/lib/AppContext';

// Store locations mock data
const PICKUP_STORES = [
  {
    id: 'center',
    name: 'Зоомаркет «Айболит — Центр»',
    address: 'ул. Ленина, д. 12 (м. Площадь Ленина, Зоомаркет Айболит)',
    hours: '09:00 – 21:50',
    coords: { x: 50, y: 45 }, // relative SVG coords
    phone: '+7 (812) 333-12-12'
  },
  {
    id: 'south',
    name: 'Зоомаркет «Айболит — Юг»',
    address: 'Московский пр., д. 85 (м. Московские ворота, Зоомаркет Айболит)',
    hours: '10:00 – 21:00',
    coords: { x: 42, y: 75 }, // relative SVG coords
    phone: '+7 (812) 333-85-85'
  },
  {
    id: 'north',
    name: 'Зоомаркет «Айболит — Север»',
    address: 'пр. Просвещения, д. 43 (м. Проспект Просвещения, Зоомаркет Айболит)',
    hours: '09:00 – 21:00',
    coords: { x: 58, y: 22 }, // relative SVG coords
    phone: '+7 (812) 333-43-43'
  }
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    checkoutType,
    pickupAddress,
    setPickupAddress,
    user,
    clearCart,
    productRatings,
    submitProductRating
  } = useApp();

  // View state: 'checkout' or 'success'
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [orderId, setOrderId] = useState('');
  const [orderTime, setOrderTime] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);

  // Redirect to cart if empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      router.push('/cart');
    }
  }, [cart, orderPlaced, router]);

  // Form Fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [comment, setComment] = useState('');

  // Delivery address fields
  const [street, setStreet] = useState(user?.address || '');
  const [house, setHouse] = useState(user?.address ? '—' : '');
  const [entrance, setEntrance] = useState('');
  const [flat, setFlat] = useState('');

  // Autofill if user logs in during the session
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setName(user.name || '');
        setPhone(user.phone || '');
        setEmail(user.email || '');
        if (user.address) {
          setStreet(user.address);
          setHouse('—');
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const itemsSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCost = checkoutType === 'delivery' ? (itemsSubtotal >= 1500 ? 0 : 290) : 0;
  const grandTotal = itemsSubtotal + deliveryCost;

  // Selected store details based on pickupAddress string
  const selectedStore = PICKUP_STORES.find(store => store.address === pickupAddress) || PICKUP_STORES[0];

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Save current cart items before clearing
    setPurchasedItems([...cart]);

    // Save current total
    setOrderTotal(grandTotal);

    // Generate simulated order ID
    const randomId = 'AB-' + Math.floor(100000 + Math.random() * 90000);
    setOrderId(randomId);

    // Format date as DD.MM.YYYY HH:MM
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
    setOrderTime(formattedDate);

    setOrderPlaced(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">

        <AnimatePresence mode="wait">
          {!orderPlaced ? (
            /* ================= CHECKOUT PAGE STEP ================= */
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Back Breadcrumb */}
              <div>
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-orange-500 font-comfortaa transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Назад в корзину</span>
                </Link>
              </div>

              {/* Header Title */}
              <div className="border-b border-stone-100 pb-5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-comfortaa tracking-tight">
                  Оформление заказа
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 font-inter mt-1">
                  Пожалуйста, заполните необходимые поля для оформления доставки или самовывоза.
                </p>
              </div>

              <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
                {/* Inputs area (8 columns) - Combined into a single cohesive Card */}
                <div className="lg:col-span-8 bg-white border border-stone-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">

                  {/* Step 1: Contact Details */}
                  <div className="space-y-5 border-b border-stone-100 pb-8">
                    <h2 className="text-base font-bold font-comfortaa text-stone-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-650 flex items-center justify-center text-xs font-bold font-mono">1</span>
                      <span>Контактные данные получателя</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
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
                            disabled={!!user}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Константин Константинопольский"
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium disabled:opacity-75 disabled:bg-stone-100 disabled:cursor-not-allowed disabled:border-stone-200/50"
                          />
                        </div>
                      </div>

                      {/* Phone */}
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
                            disabled={!!user}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+7 (999) 123-45-67"
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium disabled:opacity-75 disabled:bg-stone-100 disabled:cursor-not-allowed disabled:border-stone-200/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                        Электронная почта (для чека)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          disabled={!!user}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="petlover@aibolit.ru"
                          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium disabled:opacity-75 disabled:bg-stone-100 disabled:cursor-not-allowed disabled:border-stone-200/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Receive Details (Dynamic depending on checkoutType) */}
                  <div className="space-y-6 border-b border-stone-100 pb-8">

                    {checkoutType === 'delivery' ? (
                      /* --- DELIVERY DETAILS --- */
                      <div className="space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h2 className="text-base font-bold font-comfortaa text-stone-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-650 flex items-center justify-center text-xs font-bold font-mono">2</span>
                            <span>Адрес и условия доставки</span>
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {/* Street */}
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                              Улица *
                            </label>
                            <input
                              type="text"
                              required
                              value={street}
                              onChange={(e) => setStreet(e.target.value)}
                              placeholder="ул. Александра Невского"
                              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 transition-all font-medium"
                            />
                          </div>

                          {/* House */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                              Дом *
                            </label>
                            <input
                              type="text"
                              required
                              value={house}
                              onChange={(e) => setHouse(e.target.value)}
                              placeholder="д. 14Б"
                              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 transition-all font-medium"
                            />
                          </div>

                          {/* Flat */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                              Квартира / Офис
                            </label>
                            <input
                              type="text"
                              value={flat}
                              onChange={(e) => setFlat(e.target.value)}
                              placeholder="кв. 102"
                              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 transition-all font-medium"
                            />
                          </div>
                        </div>

                        {/* Entrance/intercom */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                              Подъезд / Домофон
                            </label>
                            <input
                              type="text"
                              value={entrance}
                              onChange={(e) => setEntrance(e.target.value)}
                              placeholder="Подъезд 3, код 123"
                              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 transition-all font-medium"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                              Интервал доставки
                            </label>
                            <select className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 transition-all font-semibold">
                              <option>Сегодня (ближайшее время) — 2 часа</option>
                              <option>Завтра с 10:00 до 14:00</option>
                              <option>Завтра с 14:00 до 18:00</option>
                              <option>Завтра с 18:00 до 22:00</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* --- PICKUP STATE (WITHOUT MAP, Task 5) --- */
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <h2 className="text-base font-bold font-comfortaa text-stone-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-650 flex items-center justify-center text-xs font-bold font-mono">2</span>
                            <span>Выбор пункта самовывоза</span>
                          </h2>
                          <p className="text-[11px] text-stone-400 font-inter">
                            Выберите удобный для вас пункт выдачи заказов ветеринарного ведомства «Айболит»:
                          </p>
                        </div>

                        {/* Stores grid layout, taking full width */}
                        <div className="grid grid-cols-1 gap-4">
                          {PICKUP_STORES.map((store) => {
                            const isSelected = pickupAddress === store.address;
                            return (
                              <button
                                key={store.id}
                                type="button"
                                onClick={() => setPickupAddress(store.address)}
                                className={`w-full text-left p-4 border rounded-2xl transition-all cursor-pointer flex gap-3 ${isSelected
                                  ? 'bg-orange-500/10 border-orange-500 shadow-xs'
                                  : 'bg-stone-50 border-stone-150 hover:bg-stone-100/50'
                                  }`}
                              >
                                <MapPin className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSelected ? 'text-orange-500' : 'text-stone-400'}`} />
                                <div className="space-y-1 font-inter">
                                  <h4 className={`text-xs font-extrabold font-comfortaa ${isSelected ? 'text-orange-900' : 'text-stone-900'}`}>
                                    {store.name}
                                  </h4>
                                  <p className="text-[11px] text-stone-500 leading-normal">
                                    {store.address}
                                  </p>
                                  <div className="flex flex-col gap-1 text-[10px] font-semibold text-stone-400 pt-1">
                                    <span>🕒 {store.hours}</span>
                                    <span>📞 {store.phone}</span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 3: Comments */}
                  <div className="space-y-4">
                    <h2 className="text-base font-bold font-comfortaa text-stone-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-650 flex items-center justify-center text-xs font-bold font-mono">3</span>
                      <span>Дополнительные инструкции</span>
                    </h2>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                        Комментарий к заказу
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none text-stone-400">
                          <FileText className="w-4 h-4" />
                        </div>
                        <textarea
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Например: Пожалуйста, оставьте пакет у двери или позвоните за 30 минут до прибытия."
                          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 transition-all font-medium placeholder:text-stone-400"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right: Checkout Sidebar summary & Pay button (4 columns) */}
                <div className="lg:col-span-4 bg-white border border-stone-150 rounded-3xl p-6 shadow-sm space-y-6">

                  <h3 className="text-sm font-bold font-comfortaa text-stone-500 uppercase tracking-widest leading-none block">
                    Ваш заказ
                  </h3>

                  {/* Cart review mini list */}
                  <div className="divide-y divide-stone-100 max-h-[220px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="py-3 flex justify-between items-start text-xs font-inter gap-4 first:pt-0">
                        <div className="space-y-0.5">
                          <p className="font-bold text-stone-900 line-clamp-2 leading-tight">
                            {item.name}
                          </p>
                          <div className="flex gap-2 text-[10px] text-stone-400">
                            <span>Кол-во: {item.quantity} шт.</span>
                            {item.size && <span>• Вес: {item.size}</span>}
                          </div>
                        </div>
                        <span className="font-extrabold text-stone-900 flex-shrink-0">
                          {item.price * item.quantity} ₽
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="border-t border-stone-100 pt-4 space-y-3.5 text-xs font-inter text-stone-600">
                    <div className="flex justify-between">
                      <span>Сумма по товарам:</span>
                      <strong className="text-stone-900">{itemsSubtotal} ₽</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Способ получения:</span>
                      <strong className="text-stone-900">{checkoutType === 'delivery' ? 'Доставка' : 'Самовывоз'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Стоимость доставки:</span>
                      <strong className="text-stone-900">{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}</strong>
                    </div>
                    <div className="border-t border-stone-100 pt-4 flex justify-between items-end">
                      <span className="font-bold font-comfortaa text-stone-950 text-sm">Всего к оплате:</span>
                      <span className="text-xl font-extrabold text-orange-500 font-comfortaa">{grandTotal} ₽</span>
                    </div>
                  </div>

                  {/* Final pay trigger CTA */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold font-comfortaa text-xs sm:text-sm rounded-full tracking-wide shadow-md shadow-green-500/10 cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Подтвердить и заказать</span>
                  </motion.button>

                  {/* <div className="flex gap-2.5 text-[10px] text-stone-400 font-inter leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <p>Нажимая кнопку, вы соглашаетесь с условиями пользовательского соглашения ветеринарного ведомства «Айболит».</p>
                  </div> */}

                </div>

              </form>
            </motion.div>
          ) : (
            /* ===================================================================== */
            /* ================= ORDER SUCCESS PAGE (Task 2) ======================= */
            /* ===================================================================== */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-8 py-10"
              onViewportEnter={() => {
                // Clear global cart after successful purchase
                clearCart();
              }}
            >
              {/* Confetti Visual & Tick Badge */}
              <div className="text-center space-y-4">
                {/* {checkoutType === 'delivery' ? (
                  <div className="h-52 w-full max-w-lg mx-auto mb-2">
                    <LottiePlayer type="courier-scooter" className="h-full w-full" />
                  </div>
                ) : (
                  <div className="h-44 w-full max-w-lg mx-auto mb-2 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100 shadow-sm text-green-500">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <p className="text-xs font-semibold text-stone-600 font-inter mt-3">Ваш заказ успешно оформлен! 🎉🐾</p>
                  </div>
                )} */}

                <div className="space-y-1">
                  <div className="h-20 w-full max-w-lg mx-auto mb-2 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100 shadow-sm text-green-500">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-green-600 bg-green-100/70 px-3 py-1 rounded-full uppercase tracking-wider font-comfortaa">
                    Заказ принят в обработку!
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-comfortaa tracking-tight pt-2">
                    Спасибо за доверие, {name}!
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500 font-inter max-w-lg mx-auto leading-relaxed">
                    Наши специалисты уже упаковывают самые свежие вкусняшки для вашего пушистого любимца!
                  </p>
                </div>
              </div>

              {/* Core Receipt Card (Aesthetic Details) */}
              <div className="bg-white border border-stone-150 rounded-[28px] shadow-sm overflow-hidden divide-y divide-stone-150">

                {/* Meta details header block */}
                <div className="p-6 bg-stone-50/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-inter font-medium text-stone-600">
                  <div className="space-y-1 border-r border-stone-150/60 pr-2">
                    <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Номер Заказа</span>
                    <strong className="text-stone-900 font-mono text-sm">{orderId}</strong>
                  </div>
                  <div className="space-y-1 sm:border-r border-stone-150/60 pr-2">
                    <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Дата Заказа</span>
                    <strong className="text-stone-800 text-[11px] leading-tight block">{orderTime}</strong>
                  </div>
                  <div className="space-y-1 border-r border-stone-150/60 pr-2 pt-2 sm:pt-0">
                    <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Получение</span>
                    <strong className="text-orange-650 flex items-center gap-1">
                      {checkoutType === 'delivery' ? (
                        <>
                          <Truck className="w-3.5 h-3.5" />
                          <span>Курьер</span>
                        </>
                      ) : (
                        <>
                          <Store className="w-3.5 h-3.5" />
                          <span>Самовывоз</span>
                        </>
                      )}
                    </strong>
                  </div>
                  <div className="space-y-1 pt-2 sm:pt-0">
                    <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Сумма заказа</span>
                    <strong className="text-stone-900 text-sm font-comfortaa">{orderTotal} ₽</strong>
                  </div>
                </div>

                {/* Receiver Details */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-comfortaa">
                    Детали доставки и контакты
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-inter">
                    <div className="space-y-1 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                      <span className="text-stone-400 font-bold block">Получатель:</span>
                      <span className="font-semibold text-stone-850 block">{name}</span>
                      <span className="text-stone-500 block font-mono">{phone}</span>
                      {email && <span className="text-stone-500 block">{email}</span>}
                    </div>

                    <div className="space-y-1 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                      <span className="text-stone-400 font-bold block">
                        {checkoutType === 'delivery' ? 'Адрес Доставки:' : 'Адрес Самовывоза:'}
                      </span>
                      {checkoutType === 'delivery' ? (
                        <p className="font-semibold text-stone-850 leading-relaxed">
                          ул. {street}, д. {house}
                          {entrance && `, под. ${entrance}`}
                          {flat && `, кв. ${flat}`}
                        </p>
                      ) : (
                        <p className="font-semibold text-stone-850 leading-relaxed">
                          {pickupAddress}
                          <span className="block text-[10px] text-stone-400 font-normal mt-0.5">Часы работы: {selectedStore.hours}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {comment && (
                    <div className="p-3 bg-orange-50/50 border border-orange-100 text-stone-650 text-xs rounded-xl font-medium font-inter">
                      💬 <strong>Ваш комментарий:</strong> &quot;{comment}&quot;
                    </div>
                  )}
                </div>

                {/* Summary Guarantee */}
                <div className="p-6 bg-stone-50/30 text-center text-xs font-inter text-stone-500 leading-normal">
                  Копия чека и статус отслеживания курьера отправлены вам по SMS на номер <strong>{phone}</strong>. Мы сохраняем историю вашей заботы о питомце!
                </div>

              </div>

              {/* RATE PURCHASED PRODUCTS */}
              {/* {purchasedItems.length > 0 && (
                <div className="bg-white border border-stone-150 rounded-[28px] p-6 shadow-sm space-y-6">
                  <div className="space-y-1.5 border-b border-stone-100 pb-4">
                    <h2 className="text-base font-bold font-comfortaa text-stone-900 flex items-center gap-2">
                      <span className="text-lg">⭐</span>
                      <span>Оцените купленные товары</span>
                    </h2>
                    <p className="text-xs text-stone-500 font-inter">
                      Помогите другим владельцам животных с выбором. Поставьте оценку товарам, которые вы только что приобрели!
                    </p>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {purchasedItems.map((item) => {
                      const itemUserRating = productRatings[item.id]?.userRating;
                      return (
                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg flex-shrink-0">
                              {item.imageType === 'food' ? '🍖' : item.imageType === 'toy' ? '🧸' : item.imageType === 'medicine' ? '💊' : '🐾'}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-stone-850 block line-clamp-1 leading-tight">{item.name}</span>
                              <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">{item.size || 'Стандартный размер'} • {item.category}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((stars) => {
                                const isLit = stars <= (itemUserRating ?? 0);
                                return (
                                  <button
                                    key={stars}
                                    type="button"
                                    onClick={() => submitProductRating(item.id, stars)}
                                    className="p-1 hover:scale-110 transition-transform cursor-pointer border-none bg-transparent"
                                    aria-label={`Оценить на ${stars}`}
                                  >
                                    <Star
                                      className={`w-5 h-5 ${isLit ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                                        } transition-colors`}
                                    />
                                  </button>
                                );
                              })}
                            </div>

                            {itemUserRating !== undefined ? (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 animate-pulse">
                                Оценено!
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400 font-medium">
                                Оценить
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )} */}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2.5">
                <Link
                  href="/"
                  className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa text-xs sm:text-sm rounded-full shadow-md shadow-orange-500/10 text-center w-full sm:w-auto"
                >
                  Вернуться в каталог 🛍️
                </Link>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <footer className="bg-stone-900 text-stone-400 py-10 px-4 mt-20 border-t border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-inter">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-comfortaa text-sm">🐾 Айболит</span>
            <span>— Забота в каждой крохе</span>
          </div>
          <p>© 2026 Сеть зоомаркетов «Айболит». Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
