import { blogApi } from './config';

export const toggleCommentLike = async ({ id }: { id: number }) => {
  const res = await blogApi.post<{ message: string }>(
    `/api/comments/${id}/likes`
  );

  return res.data;
};
