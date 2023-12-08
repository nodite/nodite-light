import { InternalAxiosRequestConfig } from 'axios';
import Cookie from 'js-cookie';

export const TokenUtil = {
  KEY: 'Nodite-Admin-Token',
  KEY_EXPIRES_IN: 'Nodite-Admin-Expires-In',

  get: (): string | undefined => Cookie.get(TokenUtil.KEY),

  set: (token: string, expiresIn?: number): void => {
    Cookie.set(TokenUtil.KEY, token, { expires: expiresIn });
    Cookie.set(TokenUtil.KEY_EXPIRES_IN, String(expiresIn), { expires: expiresIn });
  },

  rm: (): void => {
    Cookie.remove(TokenUtil.KEY);
    Cookie.remove(TokenUtil.KEY_EXPIRES_IN);
  },
};

export const interceptors = (config: InternalAxiosRequestConfig<unknown>): InternalAxiosRequestConfig<unknown> => {
  const noAuth = config.headers['No-Auth'] === true;
  if (!noAuth && TokenUtil.get()) {
    config.headers.Authorization = `Bearer ${TokenUtil.get()}`;
  }
  return config;
};
