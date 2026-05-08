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
  const apiKey = localStorage.getItem('actbrow_api_key');
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`;
    config.headers['X-API-Key'] = apiKey;
  }
  return config;
});

// An invalid assistant key should not sign the dashboard user out.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
