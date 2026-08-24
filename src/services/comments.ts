import type { Comment, GetCommentsResponse } from '@/types';
import { blogApi } from './config';

export const getCommentsByPostId = async (
  signal: AbortSignal,
  id: number,
  page = 1
): Promise<GetCommentsResponse> => {
  const res = await blogApi.get<GetCommentsResponse>(
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
