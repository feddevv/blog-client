import { cn } from '@/utils/utils';
import type { MouseEvent } from 'react';
import { LuHeart } from 'react-icons/lu';

interface LikeProps {
  likes?: number;
  isLiked?: boolean;
  onLikeClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export default function Like({
  likes,
  isLiked = false,
  onLikeClick,
  className,
}: LikeProps) {
  return (
    <button
      aria-label="Like"
      className={cn(
        'flex items-center gap-1 cursor-pointer group/likes',
        className
      )}
      onClick={onLikeClick}
    >
      <LuHeart
        className={`group-hover/likes:text-destructive ${isLiked ? 'text-destructive' : 'text-muted-foreground'}`}
        fill={isLiked ? 'currentColor' : 'none'}
      />
      <p
        className={`group-hover/likes:text-destructive ${isLiked ? 'text-destructive' : 'text-muted-foreground'}`}
      >
        {likes || 0}
      </p>
    </button>
  );
}
