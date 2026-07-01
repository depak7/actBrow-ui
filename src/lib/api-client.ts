import axios from 'axios';
import { API_BASE_URL } from '@/types';
import { clearSession } from './session';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the signed-in account API key.
api.interceptors.request.use((config) => {
  // Guard localStorage: interceptors can run before window exists (SSR/prerender).
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('actbrow_api_key') : null;
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`;
    config.headers['X-API-Key'] = apiKey;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 means this account key is no longer valid — clear and bounce to login, but never
    // when already on /login (avoids a redirect loop) or during SSR (no window).
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      window.location.pathname !== '/login'
    ) {
      clearSession();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
