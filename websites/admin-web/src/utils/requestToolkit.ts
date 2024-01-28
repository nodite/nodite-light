import type { AxiosRequestConfig } from 'axios';
import Cookie from 'js-cookie';

import lodash from '@/utils/lodash';

// toolkit: token
export const token = {
  KEY: 'Nodite-Admin-Token',
  KEY_EXPIRES_IN: 'Nodite-Admin-Expires-In',

  get: (): string | undefined => Cookie.get(token.KEY),

  set: (jwtToken: string, expiresIn?: number): void => {
    Cookie.set(token.KEY, jwtToken);
    Cookie.set(token.KEY_EXPIRES_IN, String(expiresIn));
  },

  remove: (): void => {
    Cookie.remove(token.KEY);
    Cookie.remove(token.KEY_EXPIRES_IN);
  },
};

// toolkit: createFormData
export const createFormData = (input: Record<string, unknown>): FormData => {
  const stringifyFormItem = (formItem: unknown) => {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  };

  return Object.keys(input || {}).reduce((formData, key) => {
    const property = input[key];
    const propertyContent: unknown[] = property instanceof Array ? property : [property];

    for (const formItem of propertyContent) {
      const isFileType = formItem instanceof Blob || formItem instanceof File;
      formData.append(key, isFileType ? formItem : stringifyFormItem(formItem));
    }

    return formData;
  }, new FormData());
};

// toolkit: requestCanceler
export class RequestCanceler {
  public pendingRequestMap: Map<string, AbortController> = new Map();

  public constructor() {
    this.pendingRequestMap = new Map();
  }

  private generateRequestKey({ method, url, params, data }: AxiosRequestConfig): string {
    return [url || '', method || '', JSON.stringify(params || {}), JSON.stringify(data || {})].join(
      '_',
    );
  }

  public addPendingRequest(config: AxiosRequestConfig): void {
    const rKey = this.generateRequestKey(config);
    if (!this.pendingRequestMap.has(rKey)) {
      const abortController = new AbortController();
      config.signal = abortController.signal;
      this.pendingRequestMap.set(rKey, abortController);
      return;
    }
    config.signal = this.pendingRequestMap.get(rKey)?.signal;
  }

  public removePendingRequest(config: AxiosRequestConfig): void {
    const rKey = this.generateRequestKey(config);
    if (!this.pendingRequestMap.has(rKey)) return;
    this.pendingRequestMap.delete(rKey);
  }

  public cleanPendingRequest(): void {
    this.pendingRequestMap.forEach((abortController) => abortController.abort());
    this.pendingRequestMap.clear();
  }
}

// toolkit: redirectToLogin
export const redirectToLogin = (msg?: string) => {
  if (window.location.pathname.includes('/auth/signin')) return;

  const searchParams: Record<string, string> = {
    redirect:
      '/' +
      lodash.trim(window.location.pathname.replace(import.meta.env.VITE_APP_BASE_PATH, ''), '/'),
  };

  if (msg) searchParams.msg = msg;

  window.location.href = `${
    import.meta.env.VITE_APP_BASE_PATH || ''
  }/auth/signin?${new URLSearchParams(searchParams)}`;
};
