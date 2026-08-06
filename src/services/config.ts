import { create } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export const blogApi: AxiosInstance = create({
  baseURL: 'https://blog-api-65st.onrender.com',
  timeout: 5000,
});

blogApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});
