import { getCommentsByPostId } from '@/services/comments';
import { useQuery } from '@tanstack/react-query';

export const useCommentsByPostId = (id: number) => {
  return useQuery({
    queryKey: ['post', id, 'comments'],
    queryFn: () => getCommentsByPostId(id),
  });
};
