'use client';

import React from 'react';
import Image from 'next/image';
import { withBasePath } from '@/lib/basePath';

export default function LogoMark({
  className = 'w-24 h-24',
  alt = 'Айболит',
  priority = false,
}: {
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={withBasePath('/logo_aibolit.jpg')}
      alt={alt}
      width={200}
      height={200}
      className={`object-contain ${className}`}
      priority={priority}
    />
  );
}
