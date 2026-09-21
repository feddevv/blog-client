import PostForm from '@/components/PostForm';
import Spinner from '@/components/Spinner';
import { usePostById, useUpdatePostById } from '@/hooks/usePosts';
import type { UpdatePostForm } from '@/types/zod';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

export default function UpdatePost() {
  const { id } = useParams();
  const { data: post, isPending: isPendingFetchPost } = usePostById(Number(id));
  const { mutate, isPending: isPendingUpdatePost } = useUpdatePostById();
  const navigate = useNavigate();

  const onSubmit = (data: UpdatePostForm, isDraft = false) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('state', isDraft ? 'DRAFT' : data.state);
    if (data.postImage) {
      formData.append('postImage', data.postImage[0]);
    }

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
      isEdit={true}
      isPending={isPendingUpdatePost}
      onSubmit={onSubmit}
      initialValues={{
        title: post?.title,
        content: post?.content,
        description: post?.description,
        state: post?.state === 'DRAFT' ? 'PUBLISHED' : post?.state,
        postImage: post?.coverImageUrl,
      }}
    />
  );
}
