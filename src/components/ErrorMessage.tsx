import { cn } from '@/utils/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ParamHTMLAttributes } from 'react';

const errorMessageVariants = cva('text-destructive', {
  variants: {
    size: {
      sm: 'text-sm',
      base: 'text-base',
      md: 'text-md',
    },
  },
  defaultVariants: {
    size: 'base',
  },
});

type ErrorMessageProps = ParamHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof errorMessageVariants>;

export default function ErrorMessage({
  children,
  className,
  size,
}: ErrorMessageProps) {
  return (
    <p className={cn(errorMessageVariants({ size, className }))}>{children}</p>
  );
}
