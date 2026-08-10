import { LuCircleAlert } from 'react-icons/lu';
import Button from './Button';
import type { UseQueryResult } from '@tanstack/react-query';
import { cn } from '@/utils/utils';

export default function FailedToLoad({
  isPending,
  refetch,
  className,
  title,
}: {
  isPending: boolean;
  refetch: UseQueryResult['refetch'];
  className?: string;
  title: string;
}) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <LuCircleAlert className="text-4xl text-destructive" />
      <h2 className="font-medium text-[clamp(16px,2vw,20px)] text-primary mt-2">
        {title}
      </h2>
      <Button
        intent={'secondary'}
        size={'md'}
        onClick={() => refetch()}
        className="mt-2"
        disabled={isPending}
      >
        Try again
      </Button>
    </div>
  );
}
