import Label from '@/components/Label';
import Input from '@/components/Input';
import { LuType } from 'react-icons/lu';
import type { FieldProps } from './types';
import type { FieldError } from 'react-hook-form';
import ErrorMessage from '@/components/ErrorMessage';

interface TitleFieldProps extends FieldProps {
  error?: FieldError;
}

export default function TitleField({ register, error }: TitleFieldProps) {
  return (
    <div className={`flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <Label
          htmlFor="post-title"
          intent="primary"
          size="sm"
          className="uppercase tracking-wider font-semibold flex items-center gap-1.5"
        >
          <LuType className="text-accent text-sm" />
          Title <span className="text-accent">*</span>
        </Label>
        <span className="text-xs font-paragraph text-muted-foreground">
          Recommended: 40-70 characters
        </span>
      </div>

      <Input
        id="post-title"
        type="text"
        placeholder="e.g., The Architecture of High-Scale Web Applications"
        className="text-base sm:text-lg font-heading font-medium p-3 placeholder:font-paragraph placeholder:text-sm"
        {...register('title')}
      />
      {error && <ErrorMessage size={'sm'}>{error.message}</ErrorMessage>}

      <p className="text-xs text-muted-foreground">
        A clear, engaging headline that captures the essence of your story.
      </p>
    </div>
  );
}
