import type {Metadata} from 'next';
import { Comfortaa, Inter } from 'next/font/google';
import './globals.css'; // Global styles
import { AppProvider } from '@/lib/AppContext';

const comfortaa = Comfortaa({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-comfortaa',
  weight: ['600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Айболит — Заботливый зоомагазин',
  description: 'Современный дизайн-макет профессионального e-commerce зоомагазина Айболит.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ru" className={`${comfortaa.variable} ${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="font-inter bg-stone-50/50 text-stone-900 min-h-screen antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
