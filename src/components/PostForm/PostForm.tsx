import { useForm, type SubmitHandler } from 'react-hook-form';
import {
  createPostSchema,
  updatePostSchema,
  type UpdatePostForm,
} from '@/types/zod';
import TitleField from './TitleField';
import DescriptionField from './DescriptionField';
import ContentEditorField from './ContentEditorField';
import PublishCard from './PublishCard';
import StateField from './StateField';
import ImageUploadField from './ImageUploadField';
import { zodResolver } from '@hookform/resolvers/zod';

interface InitialValues {
  title?: string;
  description?: string;
  content?: string;
  state?: 'PUBLISHED' | 'HIDDEN';
  postImage?: string;
}

interface PostFormProps {
  onSubmit: (data: UpdatePostForm, isDraft?: boolean) => void;
  isPending: boolean;
  initialValues?: InitialValues;
  isEdit?: boolean;
}

export default function PostForm({
  onSubmit,
  isPending,
  initialValues,
  isEdit = false,
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    getValues,
    setValue,
  } = useForm<UpdatePostForm>({
    resolver: zodResolver(isEdit ? updatePostSchema : createPostSchema),
    defaultValues: {
      title: initialValues?.title,
      content: initialValues?.content,
      description: initialValues?.description,
      state: initialValues?.state,
    },
  });
  const handleFormSubmit: SubmitHandler<UpdatePostForm> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-7xl">
      <form className={`w-full`} onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <TitleField register={{ ...register('title') }} />
            <DescriptionField register={{ ...register('description') }} />
            <ContentEditorField register={{ ...register('content') }} />
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6 sticky top-20">
            <PublishCard
              handleSaveDraft={() => onSubmit(getValues(), true)}
              errors={errors}
              isPending={isPending}
              isSubmitted={isSubmitted}
            />
            <StateField
              register={{ ...register('state') }}
              initialValue={initialValues?.state}
            />
            <ImageUploadField
              setValue={setValue}
              register={{ ...register('postImage') }}
              initialValue={initialValues?.postImage}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
