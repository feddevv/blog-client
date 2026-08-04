import { createComment, getCommentsByPostId } from '@/services/comments';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCommentsByPostId = (id: number) => {
  return useQuery({
    queryKey: ['post', id, 'comments'],
    queryFn: () => getCommentsByPostId(id),
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content, postId }: { content: string; postId: number }) =>
      createComment({ content, postId }),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({
        queryKey: ['post', variables.postId, 'comments'],
      }),
  });
};
