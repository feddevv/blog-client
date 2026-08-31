import type { ToggleLikeRequest } from '@/types';
import { blogApi } from './config';

export const toggleCommentLike = async ({ id }: ToggleLikeRequest) => {
  const res = await blogApi.post<{ message: string }>(
    `/api/comments/${id}/likes`
  );

  return res.data;
};
