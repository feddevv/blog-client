import Button from '@/components/Button';
import Label from '@/components/Label';
import { useCreateComment } from '@/hooks/useComments';
import { useState, type ChangeEventHandler } from 'react';
import { LuSend } from 'react-icons/lu';
import { useParams } from 'react-router';

export default function CommentForm() {
  const { id } = useParams();
  const { mutate, isPending } = useCreateComment();
  const [comment, setComment] = useState<string>('');

  const handleSubmit: ChangeEventHandler = (e) => {
    e.preventDefault();

    mutate(
      { content: comment, postId: Number(id) },
      {
        onSuccess: () => setComment(''),
      }
    );
  };

  return (
    <form
      className="bg-background p-6 border border-border"
      onSubmit={handleSubmit}
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
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
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
