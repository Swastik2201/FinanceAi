import axios from 'axios';
import { auth } from './firebase';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject Firebase Bearer Token automatically
api.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error fetching Firebase ID token for API request:', error);
      }
    } else {
      // Dev / Fallback mode support
      const mockToken = localStorage.getItem('mock_auth_token');
      if (mockToken) {
        config.headers.Authorization = `Bearer ${mockToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
