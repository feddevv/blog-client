import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
} from '@/services/posts';
import type { PostState } from '@/types';

export function usePosts(search: string, page?: number, state?: PostState) {
  return useQuery({
    queryKey: ['posts', { search, page, state }],
    queryFn: ({ signal }) => getPosts(signal, search, page, state),
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

export function useDeletePostById() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePostById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => {
      return createPost(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
  });
}
