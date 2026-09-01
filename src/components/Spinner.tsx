import { cn } from '@/utils/utils';

interface SpinnerProps {
  className?: string;
  testId: string;
}

export default function Spinner({ className, testId }: SpinnerProps) {
  return (
    <div
      className={cn(
        'w-8 h-8 border-4 border-primary border-r-transparent rounded-full animate-spin',
        className
      )}
      data-testid={testId}
    ></div>
  );
}
