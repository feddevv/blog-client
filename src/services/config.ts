import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export const blogApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  withCredentials: true,
});

blogApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

blogApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post<{ token: string }>(
          'http://localhost:3000/api/auth/refresh',
          {},
          { withCredentials: true }
        );

        localStorage.setItem('token', response.data.token);

        return blogApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
