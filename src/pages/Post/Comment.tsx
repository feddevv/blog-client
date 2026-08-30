import Like from '@/components/Like';
import type { Comment } from '@/types';
import { cn, formatDate } from '@/utils/utils';

interface CommentProps {
  username: string;
  createdAt: string | number | Date;
  content: string;
  likes: number;
  isLiked: boolean;
  onLikeClick: () => void;
  className?: string;
}

export default function Comment({
  username,
  createdAt,
  content,
  likes,
  isLiked,
  className,
  onLikeClick,
}: CommentProps) {
  return (
    <article className={cn(className)}>
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-[17px] text-foreground">
          {username ?? 'Unknown'}
        </h3>
        <p className="font-paragraph text-muted-foreground text-[15px]">
          {formatDate(createdAt)}
        </p>
      </div>

      <p className="text-muted-foreground text-[15px] mt-2">{content}</p>
      <Like
        className="mt-2 text-sm"
        likes={likes}
        isLiked={isLiked}
        onLikeClick={onLikeClick}
      />
    </article>
  );
}
