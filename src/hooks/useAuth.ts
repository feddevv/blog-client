import { getUser, login, logout, register } from '@/services/auth';
import type { RegisterRequest, SignInRequest } from '@/types/zod';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useLogin = () => {
  return useMutation({
    mutationFn: (obj: SignInRequest) => login(obj),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (obj: RegisterRequest) => register(obj),
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};
