import { cn } from '@/utils/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';

const selectVariants = cva(
  'flex w-full text-sm text-foreground font-normal outline-none focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-xs transition-colors duration-150 cursor-pointer',
  {
    variants: {
      intent: {
        unstyled: 'bg-transparent border-0 text-foreground',
        primary:
          'bg-input-background text-foreground p-2.5 border border-border focus-visible:border-accent',
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  }
);

type SelectProps = VariantProps<typeof selectVariants> &
  React.ComponentPropsWithoutRef<'select'>;

export default function Select({
  className,
  intent,
  children,
  ...props
}: SelectProps) {
  return (
    <select {...props} className={cn(selectVariants({ intent, className }))}>
      {children}
    </select>
  );
}
