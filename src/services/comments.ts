import type { Comment } from '@/types';
import { blogApi } from './config';

export const getCommentsByPostId = async (id: number): Promise<Comment[]> => {
  const res = await blogApi.get<Comment[]>(`/api/posts/${id}/comments`);

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
