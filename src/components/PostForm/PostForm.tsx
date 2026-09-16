import { useForm, type SubmitHandler } from 'react-hook-form';
import { postSchema, type PostFormValues } from '@/types/zod';
import TitleField from './TitleField';
import DescriptionField from './DescriptionField';
import ContentEditorField from './ContentEditorField';
import PublishCard from './PublishCard';
import StateField from './StateField';
import ImageUploadField from './ImageUploadField';
import { zodResolver } from '@hookform/resolvers/zod';

interface PostFormProps {
  onSubmit: (data: PostFormValues) => void;
  handleSaveDraft: (data: PostFormValues) => void;
  isPending: boolean;
  initialValues?: {
    title?: string;
    description?: string;
    content?: string;
    state?: 'PUBLISHED' | 'HIDDEN';
    postImage?: FileList | null;
  };
}

export default function PostForm({
  onSubmit,
  handleSaveDraft,
  isPending,
  initialValues = {
    title: '',
    description: '',
    content: '',
    state: 'PUBLISHED',
    postImage: null,
  },
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
  });
  const handleFormSubmit: SubmitHandler<PostFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1">
      <form className={`w-full`} onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <TitleField
              register={register}
              initialValue={initialValues.title}
            />
            <DescriptionField
              register={register}
              initialValue={initialValues.description}
            />
            <ContentEditorField
              register={register}
              initialValue={initialValues.content}
            />
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6 sticky top-20">
            <PublishCard
              handleSaveDraft={() => handleSaveDraft(getValues())}
              errors={errors}
              isPending={isPending}
            />
            <StateField
              register={register}
              initialValue={initialValues.state}
            />
            <ImageUploadField setValue={setValue} register={register} />
          </div>
        </div>
      </form>
    </div>
  );
}
