import TitleField from './TitleField';
import DescriptionField from './DescriptionField';
import ContentEditorField from './ContentEditorField';
import ImageUploadField from './ImageUploadField';
import StateField from './StateField';
import PublishCard from './PublishCard';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { createPostSchema, type CreatePostFormValues } from '@/types/zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function PostForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
  });

  const onSubmit: SubmitHandler<CreatePostFormValues> = (data) => {
    console.log(data);
  };

  return (
    <form className={`w-full`} onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <TitleField register={register} error={errors.title} />
          <DescriptionField register={register} error={errors.description} />
          <ContentEditorField register={register} error={errors.content} />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6 sticky top-20">
          <PublishCard />
          <StateField register={register} error={errors.state} />
          <ImageUploadField register={register} error={errors.postImage} />
        </div>
      </div>
    </form>
  );
}
