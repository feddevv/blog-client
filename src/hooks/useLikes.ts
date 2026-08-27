import { toggleCommentLike } from '@/services/commentLikes';
import { togglePostLike } from '@/services/postLikes';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useTogglePostLikes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => togglePostLike({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useToggleCommentLikes = ({ postId }: { postId: number }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => toggleCommentLike({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['post', postId, 'comments'],
      });
    },
  });
};
