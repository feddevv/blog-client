import PostForm from '@/components/PostForm';
import { usePostById } from '@/hooks/usePosts';
import { useParams } from 'react-router';

export default function UpdatePost() {
  const { id } = useParams();
  const { data: post, isPending } = usePostById(Number(id));

  return (
    <PostForm
      handleSaveDraft={() => {}}
      isPending={isPending}
      onSubmit={() => {}}
    />
  );
}
