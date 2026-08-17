import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { setupInterceptors } from './interceptors';

export const blogApi: AxiosInstance = axios.create({
  baseURL: 'https://blog-api-65st.onrender.com',
  timeout: 5000,
  withCredentials: true,
});

export const interceptors = setupInterceptors(blogApi);
