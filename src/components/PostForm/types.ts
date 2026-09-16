import type { PostFormValues } from '@/types/zod';
import type { UseFormRegister } from 'react-hook-form';

export interface FieldProps {
  register: UseFormRegister<PostFormValues>;
}
