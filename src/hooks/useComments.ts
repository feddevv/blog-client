import { createComment, getCommentsByPostId } from '@/services/comments';
import type { User } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCommentsByPostId = (id: number) => {
  return useQuery({
    queryKey: ['post', id, 'comments'],
    queryFn: () => getCommentsByPostId(id),
  });
};

export const useCreateComment = (user: User | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      postId,
    }: {
      content: string;
      postId: number;
    }) => {
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
