import { cn } from '@/lib/utils';

export default function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-8 h-8 border-4 border-primary border-r-transparent rounded-full animate-spin',
        className
      )}
    ></div>
  );
}
