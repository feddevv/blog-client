import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { type InputHTMLAttributes } from 'react';

const inputVariants = cva(
  'flex w-full bg-transparent text-sm font-paragraph font-light border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder:text-[12px] disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      intent: {
        unstyled: '',
        primary:
          'bg-white text-foreground p-2 border border-border placeholder:text-[14px]',
      },
    },
    defaultVariants: {
      intent: 'unstyled',
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
