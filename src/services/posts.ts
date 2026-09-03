import type { ApiError, PaginatedResponse, Post, PostState } from '@/types';
import { blogApi } from './config';
import { isAxiosError, type AxiosRequestConfig } from 'axios';

export const getPosts = async (
  signal: AbortSignal,
  search?: string,
  page = 1,
  state?: PostState
): Promise<PaginatedResponse<Post>> => {
  const config: AxiosRequestConfig = {
    params: {
      search: search?.trim() || undefined,
      page,
      state,
    },
    signal,
  };

  const res = await blogApi.get<PaginatedResponse<Post>>('/api/posts', config);

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
