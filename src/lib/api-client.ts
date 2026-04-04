import axios from 'axios';
import { API_BASE_URL } from '@/types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add API key
api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('actbrow_api_key');
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`;
    config.headers['X-API-Key'] = apiKey;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('actbrow_api_key');
      localStorage.removeItem('actbrow_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
