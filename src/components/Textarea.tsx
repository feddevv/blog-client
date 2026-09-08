import { cn } from '@/utils/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';

const textareaVariants = cva(
  'flex w-full text-sm text-foreground font-normal outline-none focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground rounded-xs transition-colors duration-150',
  {
    variants: {
      intent: {
        unstyled:
          'bg-transparent border-0 placeholder:text-muted-foreground resize-none',
        primary:
          'bg-input-background text-foreground p-3 border border-border placeholder:text-muted-foreground focus-visible:border-accent resize-y min-h-25',
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  }
);

type TextareaProps = VariantProps<typeof textareaVariants> &
  React.ComponentPropsWithoutRef<'textarea'>;

export default function Textarea({
  className,
  intent,
  ...props
}: TextareaProps) {
  return (
    <textarea
      {...props}
      className={cn(textareaVariants({ intent, className }))}
    />
  );
}
