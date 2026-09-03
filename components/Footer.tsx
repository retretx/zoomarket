'use client';

import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 px-4 border-t border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-inter">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10" isWhite={true} />
        </div>
        <p>
          © 2026 Сеть зоомаркетов «Айболит». Все права защищены. Лечебные лицензии
          сертифицированы ведомством ухода.
        </p>
      </div>
    </footer>
  );
}
