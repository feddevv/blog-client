import { getUser, login, register } from '@/services/auth';
import type { RegisterType, SignInType } from '@/types/zod';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useLogin = () => {
  return useMutation({
    mutationFn: (obj: SignInType) => login(obj),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (obj: RegisterType) => register(obj),
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
  });
};
