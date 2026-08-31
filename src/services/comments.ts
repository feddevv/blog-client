import type { Comment, PaginatedResponse } from '@/types';
import { blogApi } from './config';

export const getCommentsByPostId = async (
  signal: AbortSignal,
  id: number,
  page = 1
): Promise<PaginatedResponse<Comment>> => {
  const res = await blogApi.get<PaginatedResponse<Comment>>(
    `/api/posts/${id}/comments`,
    {
      params: {
        page,
      },
      signal,
    }
  );

  return res.data;
};

export const createComment = async ({
  postId,
  content,
}: {
  postId: number;
  content: string;
}): Promise<Comment> => {
  const res = await blogApi.post<Comment>(`/api/posts/${postId}/comments`, {
    content,
  });

  return res.data;
};
