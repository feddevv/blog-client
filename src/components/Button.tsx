import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'transition-all duration-200',
    'cursor-pointer select-none',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    'active:scale-[0.98]',
    'rounded-xs',
  ],
  {
    variants: {
      intent: {
        primary: 'bg-primary text-primary-foreground hover:bg-button-hover',
        secondary:
          'bg-secondary text-secondary-foreground border border-border hover:border-secondary-foreground',
      },
      size: {
        xs: 'text-[14px] py-1 px-4',
        sm: 'py-1 px-6',
        md: 'py-2 px-8 text-base',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'sm',
    },
  }
);
type ButtonProps = VariantProps<typeof buttonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  intent,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(buttonVariants({ intent, size, className }))}
    >
      {children}
    </button>
  );
}
