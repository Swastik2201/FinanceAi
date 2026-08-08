import axios from 'axios';

// Base API instance
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure token provider function
let getTokenFn: (() => Promise<string | null>) | null = null;
let onUnauthorizedFn: (() => void) | null = null;

export const setupApiInterceptors = (
  tokenProvider: () => Promise<string | null>,
  onUnauthorized?: () => void
) => {
  getTokenFn = tokenProvider;
  onUnauthorizedFn = onUnauthorized || null;
};

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && onUnauthorizedFn) {
      console.warn('API returned 401 Unauthorized. Clearing auth state...');
      onUnauthorizedFn();
    }
    return Promise.reject(error);
  }
);

export default api;
