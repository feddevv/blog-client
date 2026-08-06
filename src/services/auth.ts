import type { RegisterType, SignInType } from '@/types/zod';
import { blogApi } from './config';

interface LoginResponse {
  token: string;
}
export const login = async (data: SignInType): Promise<LoginResponse> => {
  const res = await blogApi.post<LoginResponse>('/api/auth/login', data);

  return res.data;
};

interface RegisterResponse {
  message: string;
}
export const register = async (
  data: RegisterType
): Promise<RegisterResponse> => {
  const res = await blogApi.post<RegisterResponse>('/api/auth/register', data);

  return res.data;
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
