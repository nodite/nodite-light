import { InternalAxiosRequestConfig } from 'axios';

import cache from '@/plugins/cache';
export const VALID_METHODS = ['post', 'put', 'delete'];

export const LIMIT_REQUEST_SIZE = 1024 * 1024 * 5; // 5MB

export const interceptors = (config: InternalAxiosRequestConfig<unknown>): InternalAxiosRequestConfig<unknown> => {
  const isDupeRequest = config.headers['Duplicate-Request'] === true;

  if (!isDupeRequest) return config;

  if (!VALID_METHODS.includes(config.method?.toLowerCase() || '')) return config;

  const reqObj = {
    url: config.url,
    data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
    time: new Date().getTime(),
  };

  const reqSize = Object.keys(JSON.stringify(reqObj)).length;

  if (reqSize > LIMIT_REQUEST_SIZE) {
    console.warn(`[${config.url}]: Request size is too large, skip validation for duplicate request`);
    return config;
  }

  // compare with cache.
  const cacheObj = (cache.session.getJSON('request') || {
    url: '',
    data: '',
    time: 0,
  }) as typeof reqObj;

  const interval = 1000;

  if (reqObj.data === cacheObj.data && reqObj.url === cacheObj.url && reqObj.time - cacheObj.time < interval) {
    const msg = "Duplicate request, please don't repeat the request";
    console.warn(`[${config.url}]: ${msg}`);
    throw new Error(msg);
  }

  cache.session.setJSON('request', reqObj);

  return config;
};
