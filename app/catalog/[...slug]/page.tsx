import React from 'react';
import CatalogClient from './CatalogClient';
import { decodeCatalogSlugSegment } from '@/lib/catalogSlug';
import { CATALOG_STRUCTURE, MOCK_PRODUCTS } from '@/lib/data';

interface CatalogProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const paths: Array<{ slug: string[] }> = [];

  // Сегменты — человеческие (кириллица, пробелы), не encodeURIComponent.
  // GitHub Pages декодирует URL перед поиском файла: /%D0%A1.../1 → «Сухой корм/1.html».
  // Если записать папку как %D0%A1..., обычная ссылка даст 404 (сработает только двойной encode).
  Object.keys(CATALOG_STRUCTURE).forEach((animal) => {
    paths.push({ slug: [animal] });
    const group = CATALOG_STRUCTURE[animal];
    if (group && group.subcategories) {
      group.subcategories.forEach((sub) => {
        paths.push({ slug: [animal, sub.id] });
        paths.push({ slug: [animal, sub.id, 'all'] });
        if (sub.subSections) {
          sub.subSections.forEach((sec) => {
            paths.push({ slug: [animal, sub.id, decodeCatalogSlugSegment(sec)] });
          });
        }
      });
    }
  });

  // Раздел брендов: обзор + страницы отдельных брендов
  paths.push({ slug: ['brands'] });
  const uniqueBrands = new Set<string>();
  MOCK_PRODUCTS.forEach((product) => {
    if (product.brand?.trim()) {
      uniqueBrands.add(product.brand.trim());
    }
  });
  uniqueBrands.forEach((brand) => {
    paths.push({ slug: ['brands', decodeCatalogSlugSegment(brand)] });
  });

  // 4-level product detail pages
  MOCK_PRODUCTS.forEach((product) => {
    if (product.animal && product.subcategoryId) {
      const sec = product.subSection
        ? decodeCatalogSlugSegment(product.subSection)
        : 'all';
      paths.push({
        slug: [
          product.animal,
          product.subcategoryId,
          sec,
          product.id
        ]
      });
    }
  });

  return paths;
}

export default function CatalogPage({ params }: CatalogProps) {
  return <CatalogClient params={params} />;
}
