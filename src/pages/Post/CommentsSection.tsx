import Spinner from '@/components/Spinner';
import { useCommentsByPostId } from '@/hooks/useComments';
import { LuMessageCircle } from 'react-icons/lu';
import Comment from './Comment';
import CommentForm from './CommentForm';
import FailedToLoad from '@/components/FailedToLoad';
import { useMutationState } from '@tanstack/react-query';
import { useUser } from '@/hooks/useAuth';
import Pagination from '@/components/Pagination';
import { useState } from 'react';

interface CommentsSectionProps {
  id: number;
}

export default function CommentsSection({ id }: CommentsSectionProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const {
    data: comments,
    isPending,
    isError,
    refetch,
  } = useCommentsByPostId(id, currentPage);
  const { data: user } = useUser();
  const totalPages = comments?.totalCount
    ? Math.ceil(comments.totalCount / comments.pageSize)
    : 0;

  const handleChangePage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  const mutationData = useMutationState<{
    variables: { postId: number; content: string };
    error: Error | null;
  }>({
    filters: {
      mutationKey: ['createComment'],
      status: 'pending',
    },
    select: (mutation) => ({
      variables: mutation.state.variables as {
        postId: number;
        content: string;
      },
      error: mutation.state.error,
    }),
  });

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
          <h2 className="flex items-center gap-2 font-bold font-heading text-[clamp(1.2rem,2vw,1.5rem)] text-foreground mb-2">
            <LuMessageCircle className="text-accent" />
            {comments.data.length
              ? `${comments.totalCount} Comment${comments.totalCount > 1 ? 's' : ''}`
              : 'No comments yet'}
          </h2>
          <CommentForm />

          <div className="mt-4 flex flex-col gap-6">
            {!mutationData[0]?.error && user && mutationData.length > 0 && (
              <Comment
                username={user.username}
                createdAt={Date.now()}
                content={mutationData[0].variables.content}
                className="opacity-65"
              />
            )}

            {comments &&
              comments.data.map((comment) => (
                <Comment
                  username={comment.user.username}
                  createdAt={comment.createdAt}
                  content={comment.content}
                  key={comment.id}
                />
              ))}

            <div className="m-auto">
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  handleChangePage={handleChangePage}
                  totalPages={totalPages}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
