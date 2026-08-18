import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPostById, getPosts } from '@/services/posts';

export function usePosts(search: string, page: number) {
  return useQuery({
    queryKey: ['posts', { search, page }],
    queryFn: () => getPosts(search, page),
    placeholderData: keepPreviousData,
  });
}

export function usePostById(id: number) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => getPostById(id),
    throwOnError: true,
    retry: false,
  });
}
