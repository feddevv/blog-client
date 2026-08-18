import type { Comment } from '@/types';
import { blogApi } from './config';

interface GetCommentsResponse {
  data: Comment[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export const getCommentsByPostId = async (
  id: number,
  page = 1
): Promise<GetCommentsResponse> => {
  const res = await blogApi.get<GetCommentsResponse>(
    `/api/posts/${id}/comments`,
    {
      params: {
        page,
      },
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
