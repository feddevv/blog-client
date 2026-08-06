import type { Post } from '@/types';
import { blogApi } from './config';
import type { AxiosRequestConfig } from 'axios';

export const getPosts = async (search?: string): Promise<Post[]> => {
  const config: AxiosRequestConfig = {
    params: {
      search: search?.trim() || undefined,
    },
  };

  const res = await blogApi.get<Post[]>('/api/posts', config);

  return res.data;
};

export const getPostById = async (id: number): Promise<Post> => {
  const res = await blogApi.get<Post>(`/api/posts/${id}`);

  return res.data;
};
