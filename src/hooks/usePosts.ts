import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/services/posts';

export function usePosts(search: string) {
  return useQuery({
    queryKey: ['posts', { search }],
    queryFn: () => getPosts(search),
  });
}
