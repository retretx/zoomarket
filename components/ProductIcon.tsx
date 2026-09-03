import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export type ProductIconType = 'food' | 'toy' | 'medicine' | 'accessory';

interface ProductIconProps {
  /** @deprecated Тип больше не влияет на картинку — оставлен для совместимости вызовов */
  type?: ProductIconType;
  className?: string;
  alt?: string;
}

export default function ProductIcon({ className, alt = '' }: ProductIconProps) {
  return (
    <Image
      src="/logo_aibolit.jpg"
      alt={alt}
      width={96}
      height={96}
      className={cn('w-24 h-24 object-cover rounded-full', className)}
    />
  );
}
