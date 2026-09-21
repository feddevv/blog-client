import Label from '@/components/Label';
import Textarea from '@/components/Textarea';
import { LuAlignLeft } from 'react-icons/lu';
import type { FieldProps } from './types';

interface DescriptionFieldProps extends FieldProps {}

export default function DescriptionField({ register }: DescriptionFieldProps) {
  return (
    <div className={`flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <Label
          htmlFor="post-description"
          intent="primary"
          size="sm"
          className="uppercase tracking-wider font-semibold text-xs flex items-center gap-1.5"
        >
          <LuAlignLeft className="text-accent text-sm" />
          Description / Excerpt <span className="text-accent">*</span>
        </Label>
        <span className="text-xs font-paragraph text-muted-foreground">
          Recommended: 120-160 characters
        </span>
      </div>

      <Textarea
        id="post-description"
        rows={3}
        placeholder="Provide a compelling summary that will entice readers to read the full article..."
        className="font-paragraph"
        {...register}
      />

      <p className="text-xs text-muted-foreground">
        This excerpt appears in post cards, search result listings, and social
        media previews.
      </p>
    </div>
  );
}
