import { useForm, type SubmitHandler } from 'react-hook-form';
import { createPostSchema, type CreatePostFormValues } from '@/types/zod';
import TitleField from './TitleField';
import DescriptionField from './DescriptionField';
import ContentEditorField from './ContentEditorField';
import PublishCard from './PublishCard';
import StateField from './StateField';
import ImageUploadField from './ImageUploadField';
import { zodResolver } from '@hookform/resolvers/zod';

interface PostFormProps {
  onSubmit: SubmitHandler<any>;
  handleSaveDraft: (data: CreatePostFormValues) => void;
  isPending: boolean;
}

export default function PostForm({
  onSubmit,
  handleSaveDraft,
  isPending,
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
  });
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1">
      <form className={`w-full`} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <TitleField register={register} />
            <DescriptionField register={register} />
            <ContentEditorField register={register} />
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6 sticky top-20">
            <PublishCard
              handleSaveDraft={() => handleSaveDraft(getValues())}
              errors={errors}
              isPending={isPending}
            />
            <StateField register={register} />
            <ImageUploadField setValue={setValue} register={register} />
          </div>
        </div>
      </form>
    </div>
  );
}
