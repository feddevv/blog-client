import type { ApiError, GetPostsResponse, Post } from '@/types';
import { blogApi } from './config';
import { isAxiosError, type AxiosRequestConfig } from 'axios';

export const getPosts = async (
  signal: AbortSignal,
  search?: string,
  page = 1
): Promise<GetPostsResponse> => {
  const config: AxiosRequestConfig = {
    params: {
      search: search?.trim() || undefined,
      page,
    },
    signal,
  };

  const res = await blogApi.get<GetPostsResponse>('/api/posts', config);

  return res.data;
};

export const getPostById = async (
  signal: AbortSignal,
  id: number
): Promise<Post> => {
  try {
    const res = await blogApi.get<Post>(`/api/posts/${id}`, { signal });

    return res.data;
  } catch (err) {
    if (isAxiosError<ApiError>(err)) {
      throw new Error(err.response?.data.message || err.message);
    }

    throw err;
  }
};
