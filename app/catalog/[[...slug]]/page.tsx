import React from 'react';
import CatalogClient from './CatalogClient';
import { CATALOG_STRUCTURE, MOCK_PRODUCTS } from '@/lib/data';

interface CatalogProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const paths: any[] = [
    { slug: [] },
    { slug: undefined },
    { slug: [''] }
  ];

  Object.keys(CATALOG_STRUCTURE).forEach((animal) => {
    paths.push({ slug: [animal] });
    const group = CATALOG_STRUCTURE[animal];
    if (group && group.subcategories) {
      group.subcategories.forEach((sub) => {
        paths.push({ slug: [animal, sub.id] });
        paths.push({ slug: [animal, sub.id, 'all'] });
        if (sub.subSections) {
          sub.subSections.forEach((sec) => {
            paths.push({ slug: [animal, sub.id, sec] });
            paths.push({ slug: [animal, sub.id, encodeURIComponent(sec)] });
          });
        }
      });
    }
  });

  // 4-level product detail pages
  MOCK_PRODUCTS.forEach((product) => {
    if (product.animal && product.subcategoryId) {
      const sec = product.subSection || 'all';
      paths.push({
        slug: [
          product.animal,
          product.subcategoryId,
          sec,
          product.id
        ]
      });
      if (sec !== 'all') {
        paths.push({
          slug: [
            product.animal,
            product.subcategoryId,
            encodeURIComponent(sec),
            product.id
          ]
        });
      }
    }
  });

  return paths;
}

export default function CatalogPage({ params }: CatalogProps) {
  return <CatalogClient params={params} />;
}
