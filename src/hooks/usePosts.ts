import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPostById, getPosts } from '@/services/posts';

export function usePosts(search: string, page?: number) {
  return useQuery({
    queryKey: ['posts', { search, page }],
    queryFn: ({ signal }) => getPosts(signal, search, page),
    placeholderData: keepPreviousData,
  });
}

export function usePostById(id: number) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: ({ signal }) => getPostById(signal, id),
    throwOnError: true,
    retry: false,
  });
}
