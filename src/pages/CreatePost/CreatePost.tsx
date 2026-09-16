import PostForm from '@/components/PostForm';
import { useCreatePost } from '@/hooks/usePosts';
import { type PostFormValues } from '@/types/zod';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function CreatePost() {
  const { mutate, isPending } = useCreatePost();
  const navigate = useNavigate();

  const onSubmit = (data: PostFormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('state', data.state);
    formData.append('postImage', data.postImage[0]);

    mutate(formData, {
      onSuccess: (data) => {
        navigate(`/posts/${data.id}`);
      },
      onError: () => {
        toast.error('Failed to update. Try again');
      },
    });
  };

  const handleSaveDraft = (data: PostFormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('state', 'DRAFT');
    formData.append('postImage', data.postImage[0]);

    mutate(formData, {
      onSuccess: (data) => {
        navigate(`/posts/${data.id}`);
      },
      onError: () => {
        toast.error('Failed to update. Try again');
      },
    });
  };

  return (
    <PostForm
      onSubmit={onSubmit}
      handleSaveDraft={handleSaveDraft}
      isPending={isPending}
    />
  );
}
