import type { ToggleLikeRequest } from '@/types';
import { blogApi } from './config';

export const togglePostLike = async ({ id }: ToggleLikeRequest) => {
  const res = await blogApi.post<{ message: string }>(`/api/posts/${id}/likes`);

  return res.data;
};
