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
