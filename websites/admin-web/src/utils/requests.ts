import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import httpStatus from 'http-status';
import lodash from 'lodash';
import { toast } from 'vuetify-sonner';

import i18n from '@/plugins/i18n';
import { ContentType, FullRequestParams, IResponse } from '@/types/request';
import * as toolkit from '@/utils/requestToolkit';

const requestCanceler = new toolkit.RequestCanceler();

// Set default content type
axios.defaults.headers['Content-Type'] = ContentType.Json;

// Create axios instance
const axiosInstance = setupCache(
  axios.create({
    baseURL: '/admin-api',
    timeout: 15 * 1000,
    paramsSerializer: {
      indexes: null,
    },
  }),
  {
    ttl: 1000 * 0.1, // 0.1s to avoid duplicate get
    methods: ['get', 'head'],
  },
);

// Request interceptors
axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${toolkit.token.get()}`;
  config.headers['x-api-key'] = import.meta.env.VITE_APP_ADMIN_API_KEY || '';
  config.headers.datasource = 'master';
  requestCanceler.addPendingRequest(config);
  return config;
});

// Response interceptors
axiosInstance.interceptors.response.use(
  (res) => {
    // TODO: multiple submit.
    requestCanceler.removePendingRequest(res.config);
    return res;
  },
  async (error) => {
    console.error('interceptors.response', error);

    if (error?.config) requestCanceler.removePendingRequest(error.config);

    if (error?.code === 'ERR_CANCELED') return;

    if (!error?.response) {
      toast.error(error.message || i18n.ndt('Network Error, Please try again later.'));
    }

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
    toolkit.redirectToLogin(i18n.ndt('No signed in.'));
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
  if (lodash.get(httpStatus, `${code}_CLASS`) === httpStatus.classes.SUCCESSFUL) {
    return axiosResponse.data?.data ?? axiosResponse.data;
  }

  // 401
  if (code === httpStatus.UNAUTHORIZED) {
    requestCanceler.cleanPendingRequest();
    toolkit.token.remove();
    toolkit.redirectToLogin(
      i18n.ndt(axiosResponse.data?.message || 'Authentication expired, please signin again.'),
    );
  }

  toast.error(i18n.ndt(axiosResponse.data?.message || 'Request failed, please try again later.'));

  throw axiosResponse;
}

export default axiosInstance;
