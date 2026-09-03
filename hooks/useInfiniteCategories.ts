'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Category, PaginatedCategoriesResponse } from '@/lib/types/virtualCatalog';
import { fetchCategoriesPage } from '@/lib/api/virtualCatalogApi';

export interface UseInfiniteCategoriesOptions {
  pageSize?: number;
  latencyMs?: number;
}

export interface UseInfiniteCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  error: Error | null;
  refetch: () => Promise<void>;
  totalCount: number;
}

export function useInfiniteCategories({
  pageSize = 10,
  latencyMs = 0
}: UseInfiniteCategoriesOptions = {}): UseInfiniteCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const isFetchingRef = useRef<boolean>(false);

  // Initial load
  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedCategoriesResponse = await fetchCategoriesPage(1, pageSize, latencyMs);
      setCategories(response.items);
      setHasNextPage(response.hasMore);
      setCurrentPage(1);
      setTotalCount(response.total);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('Ошибка загрузки категорий'));
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, latencyMs]);

  useEffect(() => {
    let active = true;
    fetchCategoriesPage(1, pageSize, latencyMs)
      .then((response) => {
        if (active) {
          setCategories(response.items);
          setHasNextPage(response.hasMore);
          setCurrentPage(1);
          setTotalCount(response.total);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err : new Error('Ошибка загрузки категорий'));
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [pageSize, latencyMs]);

  // Fetch next page
  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || isFetchingRef.current || isLoading) return;

    isFetchingRef.current = true;
    setIsFetchingNextPage(true);
    const nextPageToFetch = currentPage + 1;

    try {
      const response: PaginatedCategoriesResponse = await fetchCategoriesPage(
        nextPageToFetch,
        pageSize,
        latencyMs
      );

      setCategories((prev) => {
        // Prevent duplicate entries
        const existingIds = new Set(prev.map((c) => c.id));
        const newItems = response.items.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });

      setHasNextPage(response.hasMore);
      setCurrentPage(nextPageToFetch);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('Ошибка загрузки следующих категорий'));
    } finally {
      setIsFetchingNextPage(false);
      isFetchingRef.current = false;
    }
  }, [hasNextPage, isLoading, currentPage, pageSize, latencyMs]);

  return {
    categories,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
    totalCount
  };
}
