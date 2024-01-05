import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import httpStatus from 'http-status';
import { toast } from 'vuetify-sonner';

import i18n from '@/plugins/i18n';
import { ContentType, FullRequestParams, IResponse } from '@/types/request';
import * as toolkit from '@/utils/request/toolkit';

const requestCanceler = new toolkit.RequestCanceler();

// Set default content type
axios.defaults.headers['Content-Type'] = ContentType.Json;

// Create axios instance
const axiosInstance = setupCache(
  axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
    timeout: 8 * 1000,
    paramsSerializer: {
      indexes: null,
    },
  }),
  {
    ttl: 1000 * 1, // 1s to avoid duplicate get
    methods: ['get', 'head'],
  },
);

// Request interceptors
axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${toolkit.token.get()}`;
  config.headers['x-api-key'] = import.meta.env.VITE_APP_API_KEY || '';
  config.headers.datasource = 'master';
  requestCanceler.addPendingRequest(config);
  return config;
});

// Response interceptors
axiosInstance.interceptors.response.use(
  (res) => {
    requestCanceler.removePendingRequest(res.config);
    return res;
  },
  async (error) => {
    console.error('interceptors.response', error);

    if (error?.config) requestCanceler.removePendingRequest(error.config);

    if (error?.code === 'ERR_CANCELED') return;

    toast.error(
      error?.response?.data?.message || error.message || i18n.global.t('common.networkError'),
    );

    return error?.response || Promise.reject(error);
  },
);

// Request for error handler
export async function request<D extends IResponse>(
  params: { skipErrorHandler?: false } & Omit<FullRequestParams, 'skipErrorHandler'>,
): Promise<D['data']>;

// Request for skip error handler
export async function request<D extends IResponse>(
  params: { skipErrorHandler: true } & Omit<FullRequestParams, 'skipErrorHandler'>,
): Promise<AxiosResponse<D>>;

// Request
export async function request({
  secure,
  path,
  type,
  query,
  format,
  body,
  skipErrorHandler,
  ...params
}: FullRequestParams) {
  if (secure && !toolkit.token.get()) {
    toolkit.redirectToLogin(i18n.global.t('common.noSignIn'));
    return;
  }

  let data = body;

  // From data
  if (type === ContentType.FormData && body && typeof body === 'object') {
    data = toolkit.createFormData(body as Record<string, unknown>);
  }

  // Text data
  if (type === ContentType.Text && body && typeof body !== 'string') {
    data = JSON.stringify(body);
  }

  // Axios request
  const axiosResponse = await axiosInstance({
    ...params,
    headers: {
      ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      ...(params.headers || {}),
    },
    params: query,
    responseType: format,
    data,
    url: path,
  });

  // skip error handler
  if (skipErrorHandler) {
    return axiosResponse;
  }

  const code = axiosResponse.data?.httpCode || axiosResponse.status;

  // successful response
  if (httpStatus[`${code}_CLASS`] === httpStatus.classes.SUCCESSFUL) {
    return axiosResponse.data?.data ?? axiosResponse.data;
  }

  // 401
  if (code === httpStatus.UNAUTHORIZED) {
    requestCanceler.cleanPendingRequest();
    toolkit.token.remove();
    toolkit.redirectToLogin(axiosResponse.data?.message || i18n.global.t('common.authExpired'));
  }

  throw axiosResponse;
}
