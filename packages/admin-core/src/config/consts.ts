const API_ROOT_PATH = '/admin-api';
const API_DOCS_PATH = '/api-docs';

const RATELIMIT_WHITELIST = [];

const AUTH_WHITELIST = [
  `${API_ROOT_PATH}/auth/login`,
  `${API_ROOT_PATH}/auth/register`,
  `${API_ROOT_PATH}/locale/i/available`,
  `${API_ROOT_PATH}/locale/message/available`,
];

export default {
  API_ROOT_PATH,
  API_DOCS_PATH,
  RATELIMIT_WHITELIST,
  AUTH_WHITELIST,
};
