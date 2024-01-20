import {
  Cacheable as CoreCacheable,
  CacheClear as CoreCacheClear,
  CacheClearOptions,
  CacheOptions,
  CacheUpdate as CoreCacheUpdate,
  CacheUpdateOptions,
} from '@type-cacheable/core';

/**
 * Cacheable.
 * @param options
 * @returns
 */
export function Cacheable(options: CacheOptions): ReturnType<typeof CoreCacheable> {
  return CoreCacheable({
    ...options,
  });
}

/**
 * CacheClear.
 * @param options
 * @returns
 */
export function CacheClear(options: CacheClearOptions): ReturnType<typeof CoreCacheClear> {
  return CoreCacheClear({
    ...options,
  });
}

/**
 * CacheUpdate.
 * @param options
 * @returns
 */
export function CacheUpdate(options: CacheUpdateOptions): ReturnType<typeof CoreCacheUpdate> {
  return CoreCacheUpdate({
    ...options,
  });
}
