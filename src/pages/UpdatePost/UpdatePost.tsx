import PostForm from '@/components/PostForm';
import Spinner from '@/components/Spinner';
import { usePostById } from '@/hooks/usePosts';
import { useParams } from 'react-router';

export default function UpdatePost() {
  const { id } = useParams();
  const { data: post, isPending } = usePostById(Number(id));

  return isPending ? (
    <Spinner className="m-auto" />
  ) : (
    <PostForm
      handleSaveDraft={() => {}}
      isPending={isPending}
      onSubmit={() => {}}
      initialValues={{
        title: post?.title,
        content: post?.content,
        description: post?.description,
        state: post?.state === 'DRAFT' ? 'PUBLISHED' : post?.state,
      }}
    />
  );
}
