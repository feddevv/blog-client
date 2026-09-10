import TitleField from './TitleField';
import DescriptionField from './DescriptionField';
import ContentEditorField from './ContentEditorField';
import ImageUploadField from './ImageUploadField';
import StateField from './StateField';
import PublishCard from './PublishCard';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { createPostSchema, type CreatePostFormValues } from '@/types/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePost } from '@/hooks/usePosts';
import { toast } from 'sonner';

export default function PostForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
  });

  const { mutate, isPending } = useCreatePost();

  const onSubmit: SubmitHandler<CreatePostFormValues> = (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('state', data.state);
    formData.append('postImage', data.postImage[0]);

    mutate(formData, {
      onSuccess: () => {
        toast.success('Post successfully created');
        reset();
      },
    });
  };

  const handleSaveDraft = () => {
    const data = getValues();

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('state', 'DRAFT');
    formData.append('postImage', data.postImage[0]);

    mutate(formData, {
      onSuccess: () => {
        toast.success('Post was saved as a draft');
        reset();
      },
    });
  };

  return (
    <form className={`w-full`} onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <TitleField register={register} />
          <DescriptionField register={register} />
          <ContentEditorField register={register} />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6 sticky top-20">
          <PublishCard
            handleSaveDraft={handleSaveDraft}
            errors={errors}
            isPending={isPending}
          />
          <StateField register={register} />
          <ImageUploadField register={register} />
        </div>
      </div>
    </form>
  );
}
