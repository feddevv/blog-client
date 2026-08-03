import Spinner from '@/components/Spinner';
import { useCommentsByPostId } from '@/hooks/useComments';
import { LuMessageCircle } from 'react-icons/lu';
import Comment from './Comment';

interface CommentsSectionProps {
  id: number;
}

export default function CommentsSection({ id }: CommentsSectionProps) {
  const { data: comments, isPending } = useCommentsByPostId(id);

  return (
    <section className="bg-muted py-16 border-t border-border">
      {isPending ? (
        <Spinner className="m-auto" />
      ) : (
        <div className="max-w-200 px-4 mx-auto">
          <h2 className="flex items-center gap-2 font-bold font-heading text-[clamp(1.2rem,2vw,1.5rem)]">
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
          </div>
        </div>
      )}
    </section>
  );
}
