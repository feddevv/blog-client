import { createComment, getCommentsByPostId } from '@/services/comments';
import type { User } from '@/types';
import type { CreateCommentRequest } from '@/types/zod';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const useCommentsByPostId = (id: number, page?: number) => {
  return useQuery({
    queryKey: ['post', id, 'comments', { page }],
    queryFn: ({ signal }) => getCommentsByPostId(signal, id, page),
    placeholderData: keepPreviousData,
  });
};

export const useCreateComment = (user?: User) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, postId }: CreateCommentRequest) => {
      if (!user) return;

      return createComment({ content, postId });
    },
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({
        queryKey: ['post', variables.postId, 'comments'],
      }),
    mutationKey: ['createComment'],
  });
};
