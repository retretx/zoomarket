import React from 'react';
import CatalogClient from './[...slug]/CatalogClient';

export default function CatalogIndexPage() {
  return <CatalogClient params={Promise.resolve({ slug: [] })} />;
}