import type { RegisterType, SignInType } from '@/types/zod';
import { blogApi } from './config';
import { isAxiosError } from 'axios';
import type { ApiError } from '@/types';

interface LoginResponse {
  token: string;
}
export const login = async (data: SignInType): Promise<LoginResponse> => {
  try {
    const res = await blogApi.post<LoginResponse>('/api/auth/login', data);

    return res.data;
  } catch (err) {
    if (isAxiosError<ApiError>(err)) {
      throw new Error(err.response?.data.message || err.message);
    }
    throw err;
  }
};

interface RegisterResponse {
  message: string;
}
export const register = async (
  data: RegisterType
): Promise<RegisterResponse> => {
  try {
    const res = await blogApi.post<RegisterResponse>(
      '/api/auth/register',
      data
    );

    return res.data;
  } catch (err) {
    if (isAxiosError<ApiError>(err)) {
      throw new Error(err.response?.data.message || err.message);
    }
    throw err;
  }
};

interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'USER';
}
export const getUser = async (): Promise<UserResponse> => {
  const res = await blogApi.get<UserResponse>('/api/auth/me');

  return res.data;
};
