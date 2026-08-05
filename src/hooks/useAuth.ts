import { login, register } from '@/services/auth';
import type { RegisterType, SignInType } from '@/types/zod';
import { useMutation } from '@tanstack/react-query';

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
