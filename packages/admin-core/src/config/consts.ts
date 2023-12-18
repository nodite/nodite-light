const API_ROOT_PATH = '/admin-api';
const API_DOCS_PATH = '/api-docs';

const AUTH_WHITELIST = [`${API_ROOT_PATH}/auth/login`, `${API_ROOT_PATH}/auth/register`];

export default { API_ROOT_PATH, API_DOCS_PATH, AUTH_WHITELIST };
