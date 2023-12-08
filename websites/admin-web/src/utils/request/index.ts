import axios from 'axios';
import httpStatus from 'http-status';

import { useSnackbarStore } from '@/stores/snackbarStore';
import * as auth from '@/utils/request/middlewares/auth.middleware';
import * as dupeRequest from '@/utils/request/middlewares/dupeRequest.middleware';

const snackbarStore = useSnackbarStore();
const reLogin = { show: false };

// Set default content type
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 8 * 1000,
});

// Request interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    // auth
    config = auth.interceptors(config);

    // duplicate request
    try {
      config = dupeRequest.interceptors(config);
    } catch (err) {
      return Promise.reject(err);
    }

    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  },
);

// Response interceptors
axiosInstance.interceptors.response.use(
  (res) => {
    const code = res.data.code || httpStatus.OK;
    const errMsg = res.data.message || httpStatus[code];

    // blob response
    if (['blob', 'arraybuffer'].includes(res.request.responseType)) {
      return res.data;
    }

    // 401
    if (code === httpStatus.UNAUTHORIZED) {
      if (!reLogin.show) {
        reLogin.show = true;
        snackbarStore.showErrorMessage(errMsg);
        location.href = '/';
      }
      return Promise.reject(new Error(errMsg));
    }
    // no 200
    else if (code !== httpStatus.OK) {
      snackbarStore.showErrorMessage(errMsg);
      return Promise.reject(new Error(errMsg));
    }

    return Promise.resolve(res.data);
  },
  (error) => {
    console.error(error);
    snackbarStore.showErrorMessage(error.message || 'Network Error');
    return Promise.reject(error);
  },
);

export default { request: axiosInstance };
