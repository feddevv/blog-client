import { cn } from '@/utils/utils';
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
      md: 'text-base',
      xl: 'text-xl',
    },
  },

  defaultVariants: {
    intent: 'primary',
    size: 'sm',
  },
});

type BaseProps = LabelHTMLAttributes<HTMLLabelElement>;

type LabelProps = VariantProps<typeof labelVariants> & BaseProps;

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

export function LabelWrapper({ children, className, ...props }: BaseProps) {
  return (
    <label
      {...props}
      className={cn(
        `${className} flex items-center gap-2 focus-within:ring focus-within:ring-accent rounded-xs`
      )}
    >
      {children}
    </label>
  );
}
