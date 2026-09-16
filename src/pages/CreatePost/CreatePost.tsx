import PostForm from '@/components/PostForm';
import { useCreatePost } from '@/hooks/usePosts';
import { type CreatePostFormValues } from '@/types/zod';
import { toast } from 'sonner';

export default function CreatePost() {
  const { mutate, isPending } = useCreatePost();

  const onSubmit = (data: CreatePostFormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('state', data.state);
    formData.append('postImage', data.postImage[0]);

    mutate(formData, {
      onSuccess: () => {
        toast.success('Post successfully created');
      },
    });
  };

  const handleSaveDraft = (data: CreatePostFormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('state', 'DRAFT');
    formData.append('postImage', data.postImage[0]);

    mutate(formData, {
      onSuccess: () => {
        toast.success('Post was saved as a draft');
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
