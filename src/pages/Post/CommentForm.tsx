import Button from '@/components/Button';
import Label from '@/components/Label';
import { useCreateComment } from '@/hooks/useComments';
import { LuSend } from 'react-icons/lu';
import { useParams } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema, type CommentType } from '@/types/zod';
import { useUser } from '@/hooks/useAuth';

export default function CommentForm() {
  const { id } = useParams();
  const user = useUser();
  const { mutate, isPending } = useCreateComment(user.data);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CommentType>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit: SubmitHandler<CommentType> = (data) => {
    if (!user.data) return;
    const postId = Number(id);
    if (!Number.isFinite(postId)) return;

    mutate(
      { content: data.content, postId },
      {
        onSuccess: () => reset(),
      }
    );
  };

  return (
    <form
      className="bg-background p-6 border border-border"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        <Label
          htmlFor="comment"
          intent={'primary'}
          size={'md'}
          className="mb-2"
        >
          Leave a comment
        </Label>
        <textarea
          className="bg-secondary border border-border resize-none p-3 placeholder:text-muted-foreground text-primary focus:outline-none focus-visible:border-accent"
          id="comment"
          rows={3}
          placeholder="Share your thoughts..."

          {...register('content')}
        ></textarea>
        {errors.content && (
          <p className="text-sm text-destructive mt-1">
            {errors.content.message}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center gap-2 mt-4">
        <p className="text-muted-foreground text-[clamp(12px,2vw,14px)]">
          Sign in to comment with your profile
        </p>
        <Button
          className="flex items-center gap-2"
          size={'sm'}
          disabled={isPending}
        >
          <LuSend />
          Post
        </Button>
      </div>
    </form>
  );
}
