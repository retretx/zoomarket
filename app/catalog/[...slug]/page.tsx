import React from 'react';
import CatalogClient from './CatalogClient';
import { catalogSlugParamVariants } from '@/lib/catalogSlug';
import { CATALOG_STRUCTURE, MOCK_PRODUCTS } from '@/lib/data';

interface CatalogProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const paths: Array<{ slug: string[] }> = [];
  const seen = new Set<string>();

  const add = (segments: string[]) => {
    for (const slug of catalogSlugParamVariants(segments)) {
      const key = slug.join('\0');
      if (seen.has(key)) continue;
      seen.add(key);
      paths.push({ slug });
    }
  };

  Object.keys(CATALOG_STRUCTURE).forEach((animal) => {
    add([animal]);
    const group = CATALOG_STRUCTURE[animal];
    if (group && group.subcategories) {
      group.subcategories.forEach((sub) => {
        add([animal, sub.id]);
        add([animal, sub.id, 'all']);
        if (sub.subSections) {
          sub.subSections.forEach((sec) => {
            add([animal, sub.id, sec]);
          });
        }
      });
    }
  });

  add(['brands']);
  const uniqueBrands = new Set<string>();
  MOCK_PRODUCTS.forEach((product) => {
    if (product.brand?.trim()) {
      uniqueBrands.add(product.brand.trim());
    }
  });
  uniqueBrands.forEach((brand) => {
    add(['brands', brand]);
  });

  MOCK_PRODUCTS.forEach((product) => {
    if (product.animal && product.subcategoryId) {
      add([
        product.animal,
        product.subcategoryId,
        product.subSection || 'all',
        product.id,
      ]);
    }
  });

  return paths;
}

export default function CatalogPage({ params }: CatalogProps) {
  return <CatalogClient params={params} />;
}
