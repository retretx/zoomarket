export interface SubCategory {
  id: string;
  name: string;
  icon: string;
  type: 'food' | 'toy' | 'medicine' | 'accessory';
  itemCount: number;
  subSections: string[];
  imageUrl?: string;
  badge?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  bannerGradient: string;
  subcategoriesCount: number;
  featuredSubcategoryId?: string;
}

export interface PaginatedCategoriesResponse {
  items: Category[];
  nextPage: number | null;
  total: number;
  hasMore: boolean;
}

export interface PaginatedSubcategoriesResponse {
  categoryId: string;
  items: SubCategory[];
  loadedAt: number;
}
