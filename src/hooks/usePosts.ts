import { useQuery } from '@tanstack/react-query';
import { getPostById, getPosts } from '@/services/posts';

export function usePosts(search: string) {
  return useQuery({
    queryKey: ['posts', { search }],
    queryFn: () => getPosts(search),
  });
}

export function usePostById(id: number) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => getPostById(id),
  });
}
