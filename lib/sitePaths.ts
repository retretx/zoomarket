/**
 * Единый источник basePath / assetPrefix.
 * Импортируется и из next.config.ts, и из клиентского кода — без 'use client' и без '@/'.
 */

function normalizePrefix(value: string | undefined): string {
  if (!value || value === '/') return '';
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export const BASE_PATH = normalizePrefix(
  process.env.NEXT_PUBLIC_BASE_PATH ?? '/zoomarket'
);

export const ASSET_PREFIX = normalizePrefix(
  process.env.NEXT_PUBLIC_ASSET_PREFIX ??
    process.env.NEXT_PUBLIC_BASE_PATH ??
    '/zoomarket'
);

function isAbsoluteUrl(path: string): boolean {
  return /^(https?:)?\/\//.test(path);
}

function joinPrefix(prefix: string, path: string): string {
  if (!path.startsWith('/') || isAbsoluteUrl(path)) {
    return path;
  }
  if (!prefix) {
    return path;
  }
  if (path === prefix || path.startsWith(`${prefix}/`)) {
    return path;
  }
  return `${prefix}${path}`;
}

/** Для History API и сырых URL страниц. Не использовать с Link / router. */
export function withBasePath(path: string): string {
  return joinPrefix(BASE_PATH, path);
}

/** Для локальных ассетов (next/image src). */
export function withAssetPrefix(path: string): string {
  return joinPrefix(ASSET_PREFIX, path);
}

/** Снимает basePath с window.location.pathname для сравнений. */
export function stripBasePath(pathname: string): string {
  if (!BASE_PATH) {
    return pathname || '/';
  }
  if (pathname === BASE_PATH) {
    return '/';
  }
  if (pathname.startsWith(`${BASE_PATH}/`)) {
    return pathname.slice(BASE_PATH.length) || '/';
  }
  return pathname || '/';
}
