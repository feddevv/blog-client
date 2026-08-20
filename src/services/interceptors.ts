import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';

interface QueueItem {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}

interface CustomConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefetching = false;
let failedQueue: QueueItem[] = [];

const URL_SKIP_LIST = ['/auth/register', '/auth/login'];

function processQueue(err: unknown, token: string | null = null) {
  failedQueue.forEach((item) => {
    if (err) item.reject(err);
    else if (token) item.resolve(token);
  });

  failedQueue = [];
}

export const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomConfig | undefined;
      if (!originalRequest) return Promise.reject(error);

      const isToSkip = URL_SKIP_LIST.some((url) =>
        originalRequest.url?.includes(url)
      );
      if (
        error.response?.status !== 401 ||
        originalRequest._retry ||
        isToSkip
      ) {
        return Promise.reject(error);
      }

      if (isRefetching) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => instance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefetching = true;

      try {
        const response = await axios.post<{ token: string }>(
          'http://localhost:3000/api/auth/refresh',
          {},
          { withCredentials: true }
        );

        processQueue(null, response.data.token);
        localStorage.setItem('token', response.data.token);

        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        localStorage.removeItem('token');
        return Promise.reject(refreshError);
      } finally {
        isRefetching = false;
      }
    }
  );
};
