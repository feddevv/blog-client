import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { type InputHTMLAttributes } from 'react';

const inputVariants = cva(
  'flex w-full text-sm font-paragraph font-light outline-none focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      intent: {
        unstyled:
          'bg-transparent border-0 placeholder:text-muted-foreground placeholder:text-[12px]',
        primary:
          'bg-white text-foreground p-2 border border-border placeholder:text-muted-foreground placeholder:text-[14px]',
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  }
);

type InputProps = VariantProps<typeof inputVariants> &
  InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, intent, ...props }: InputProps) {
  return (
    <input {...props} className={cn(inputVariants({ intent, className }))} />
  );
}
