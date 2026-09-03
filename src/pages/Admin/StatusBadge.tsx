import type { PostState } from '@/types';
import { LuCircleCheck, LuEyeOff, LuFilePenLine } from 'react-icons/lu';
import { cn } from '@/utils/utils';

interface StatusBadgeProps {
  status: PostState | 'Published' | 'Hidden' | 'Draft';
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase() as PostState;

  switch (normalizedStatus) {
    case 'PUBLISHED':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-paragraph font-medium uppercase tracking-wider rounded-xs border',
            'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <LuCircleCheck className="text-[13px]" />
          Published
        </span>
      );
    case 'HIDDEN':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-paragraph font-medium uppercase tracking-wider rounded-xs border',
            'bg-muted text-muted-foreground border-border dark:bg-muted/80 dark:text-muted-foreground dark:border-border',
            className
          )}
        >
          <LuEyeOff className="text-[13px]" />
          Hidden
        </span>
      );
    case 'DRAFT':
    default:
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-paragraph font-medium uppercase tracking-wider rounded-xs border',
            'bg-amber-500/10 text-amber-800 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
            className
          )}
        >
          <LuFilePenLine className="text-[13px]" />
          Draft
        </span>
      );
  }
}
