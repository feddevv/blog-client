import Spinner from '@/components/Spinner';
import { useCommentsByPostId } from '@/hooks/useComments';
import { LuMessageCircle } from 'react-icons/lu';
import Comment from './Comment';
import CommentForm from './CommentForm';
import FailedToLoad from '@/components/FailedToLoad';

interface CommentsSectionProps {
  id: number;
}

export default function CommentsSection({ id }: CommentsSectionProps) {
  const {
    data: comments,
    isPending,
    isError,
    refetch,
  } = useCommentsByPostId(id);

  if (isError) {
    return (
      <section className="bg-muted py-16 border-t border-border flex items-center justify-center">
        <FailedToLoad
          isPending={isPending}
          refetch={refetch}
          title="Failed to load comments"
        />
      </section>
    );
  }

  return (
    <section className="bg-muted py-16 border-t border-border">
      {isPending ? (
        <Spinner testId="comments-spinner" className="m-auto" />
      ) : (
        <div className="max-w-200 px-4 mx-auto">
          <h2 className="flex items-center gap-2 font-bold font-heading text-[clamp(1.2rem,2vw,1.5rem)] text-foreground">
            <LuMessageCircle className="text-accent" />
            {comments && comments.length
              ? `${comments.length} Comment${comments.length > 1 ? 's' : ''}`
              : 'No comments yet'}
          </h2>

          <div className="mt-4 flex flex-col gap-6">
            {comments &&
              comments.map((comment) => (
                <Comment
                  username={comment.user.username}
                  createdAt={comment.createdAt}
                  content={comment.content}
                  key={comment.id}
                />
              ))}

            <CommentForm />
          </div>
        </div>
      )}
    </section>
  );
}
