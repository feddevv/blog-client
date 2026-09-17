import type {
  CreatePostForm,
  PostFormValues,
  UpdatePostForm,
} from '@/types/zod';
import type { UseFormRegister } from 'react-hook-form';

export interface FieldProps {
  register: UseFormRegister<UpdatePostForm>;
}
