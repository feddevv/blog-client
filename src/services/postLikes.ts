import { blogApi } from './config';

export const togglePostLike = async ({ id }: { id: number }) => {
  const res = await blogApi.post<{ message: string }>(`/api/posts/${id}/likes`);

  return res.data;
};
