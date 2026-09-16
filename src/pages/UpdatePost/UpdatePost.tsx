import PostForm from '@/components/PostForm';
import Spinner from '@/components/Spinner';
import { usePostById, useUpdatePostById } from '@/hooks/usePosts';
import type { PostFormValues } from '@/types/zod';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

export default function UpdatePost() {
  const { id } = useParams();
  const { data: post, isPending: isPendingFetchPost } = usePostById(Number(id));
  const { mutate, isPending: isPendingUpdatePost } = useUpdatePostById();
  const navigate = useNavigate();

  const onSubmit = (data: PostFormValues, isDraft = false) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('state', isDraft ? 'DRAFT' : data.state);
    formData.append('postImage', data.postImage[0]);

    mutate(
      { id: Number(id), data: formData },
      {
        onSuccess: () => {
          navigate(`/posts/${id}`);
        },
        onError: () => {
          toast.error('Failed to update. Try again');
        },
      }
    );
  };

  return isPendingFetchPost ? (
    <Spinner className="m-auto" />
  ) : (
    <PostForm
      isPending={isPendingUpdatePost}
      onSubmit={onSubmit}
      initialValues={{
        title: post?.title,
        content: post?.content,
        description: post?.description,
        state: post?.state === 'DRAFT' ? 'PUBLISHED' : post?.state,
      }}
    />
  );
}
