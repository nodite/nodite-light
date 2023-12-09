import type { AxiosResponse } from 'axios';
import axios from 'axios';
import httpStatus from 'http-status';

import i18n from '@/plugins/i18n';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { ContentType, FullRequestParams, IResponse } from '@/types/request';
import * as toolkit from '@/utils/request/toolkit';

const snackbarStore = useSnackbarStore();
const requestCanceler = new toolkit.RequestCanceler();

// Set default content type
axios.defaults.headers['Content-Type'] = ContentType.Json;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 8 * 1000,
  paramsSerializer: {
    indexes: null,
  },
});

// Request interceptors
axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${toolkit.token.get()}`;
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
    console.error(error);
    if (error?.config) requestCanceler.removePendingRequest(error.config);
    if (error?.code === 'ERR_CANCELED') return;
    snackbarStore.showErrorMessage(error.message || i18n.global.t('common.networkError'));
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

  const code = axiosResponse.data?.httpCode;

  // 200
  if (code === httpStatus.OK) {
    return axiosResponse.data?.data ?? axiosResponse.data;
  }

  // 401
  if (code === httpStatus.UNAUTHORIZED) {
    requestCanceler.cleanPendingRequest();
    toolkit.token.remove();
    toolkit.redirectToLogin(axiosResponse.data?.message || i18n.global.t('common.authExpired'));
    return;
  }

  snackbarStore.showErrorMessage(axiosResponse.data?.message || i18n.global.t('common.networkError'));

  throw axiosResponse.data;
}
