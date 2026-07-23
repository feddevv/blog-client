import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { type LabelHTMLAttributes } from 'react';

const labelVariants = cva('font-paragraph font-medium', {
  variants: {
    intent: {
      primary: 'text-foreground',
      secondary: 'text-muted-foreground',
    },
    size: {
      sm: 'text-[12px]',
      md: 'text-[16px]',
      xl: 'text-xl',
    },
  },

  defaultVariants: {
    intent: 'primary',
    size: 'sm',
  },
});

type LabelProps = VariantProps<typeof labelVariants> &
  LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({
  children,
  className,
  intent,
  size,
  ...props
}: LabelProps) {
  return (
    <label
      {...props}
      className={cn(labelVariants({ intent, size, className }))}
    >
      {children}
    </label>
  );
}
