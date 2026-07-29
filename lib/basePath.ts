/** Base path for GitLab Pages project sites (empty for local / root hosting). */
export const basePath =
  (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

/** Prefix a root-relative path with the app basePath. */
export function withBasePath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${basePath}${path}`;
}
