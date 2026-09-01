// API and Socket URL configuration
// In development: uses localhost
// In production: uses the deployed backend URL

const isDev = import.meta.env.DEV;

const API_BASE_URL = isDev
  ? 'http://localhost:3000'
  : import.meta.env.VITE_API_URL || window.location.origin;

const SOCKET_URL = isDev
  ? 'http://localhost:3000'
  : import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || window.location.origin;

export { API_BASE_URL, SOCKET_URL };
