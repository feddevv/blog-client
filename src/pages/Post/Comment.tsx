import type { Comment } from '@/types';
import { formatDate } from '@/utils/formatDate';

interface CommentProps {
  username: string;
  createdAt: string;
  content: string;
}

export default function Comment({
  username,
  createdAt,
  content,
}: CommentProps) {
  return (
    <article>
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-[17px] text-foreground">
          {username ?? 'Unknown'}
        </h3>
        <p className="font-paragraph text-muted-foreground text-[15px]">
          {formatDate(createdAt)}
        </p>
      </div>

      <p className="text-muted-foreground text-[15px] mt-2">{content}</p>
    </article>
  );
}
