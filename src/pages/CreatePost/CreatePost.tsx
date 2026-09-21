import PostForm from '@/components/PostForm';
import { useCreatePost } from '@/hooks/usePosts';
import { type UpdatePostForm } from '@/types/zod';
import { IoIosArrowBack } from 'react-icons/io';
import { NavLink, useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function CreatePost() {
  const { mutate, isPending } = useCreatePost();
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
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex flex-col items-start">
      <NavLink
        to={'/admin'}
        className={
          'text-muted-foreground hover:text-foreground transition-colors duration-200 text-[clamp(14px,2vw,16px)] flex items-center gap-2 mb-8'
        }
      >
        <IoIosArrowBack />
        Dashboard
      </NavLink>
      <PostForm onSubmit={onSubmit} isPending={isPending} />
    </div>
  );
}
