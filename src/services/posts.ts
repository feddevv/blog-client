import type { ApiError, Post } from '@/types';
import { blogApi } from './config';
import { isAxiosError, type AxiosRequestConfig } from 'axios';

interface GetPostsResponse {
  data: Post[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}
export const getPosts = async (
  search?: string,
  page?: number
): Promise<GetPostsResponse> => {
  const config: AxiosRequestConfig = {
    params: {
      search: search?.trim() || undefined,
      page,
    },
  };

  const res = await blogApi.get<GetPostsResponse>('/api/posts', config);

  return res.data;
};

export const getPostById = async (id: number): Promise<Post> => {
  try {
    const res = await blogApi.get<Post>(`/api/posts/${id}`);

    return res.data;
  } catch (err) {
    if (isAxiosError<ApiError>(err)) {
      throw new Error(err.response?.data.message || err.message);
    }

    throw err;
  }
};
