import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { setupInterceptors } from './interceptors';

export const blogApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 30000,
  withCredentials: true,
});

export const interceptors = setupInterceptors(blogApi);
