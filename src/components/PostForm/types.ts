import type { CreatePostFormValues } from '@/types/zod';
import type { UseFormRegister } from 'react-hook-form';

export interface FieldProps {
  register: UseFormRegister<CreatePostFormValues>;
}
