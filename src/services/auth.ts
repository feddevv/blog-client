import type { RegisterRequest, SignInRequest } from '@/types/zod';
import { blogApi } from './config';
import { isAxiosError } from 'axios';
import type {
  ApiError,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  User,
} from '@/types';

export const login = async (data: SignInRequest): Promise<LoginResponse> => {
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

export const register = async (
  data: RegisterRequest
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

export const getUser = async (): Promise<User> => {
  const res = await blogApi.get<User>('/api/auth/me');

  return res.data;
};

export const logout = async (): Promise<LogoutResponse> => {
  const res = await blogApi.post<LogoutResponse>('/api/auth/logout');

  return res.data;
};
