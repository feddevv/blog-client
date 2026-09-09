import Label from '@/components/Label';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { LuImage, LuUpload, LuLink, LuInfo } from 'react-icons/lu';
import type { FieldProps } from './types';

interface ImageUploadFieldProps extends FieldProps {}

export default function ImageUploadField({ register }: ImageUploadFieldProps) {
  return (
    <div
      className={`bg-card border border-border p-5 rounded-xs flex flex-col gap-4`}
    >
      <div className="flex items-center justify-between">
        <Label
          htmlFor="post-image-file"
          intent="primary"
          size="sm"
          className="uppercase tracking-wider font-semibold text-xs flex items-center gap-1.5"
        >
          <LuImage className="text-accent text-sm" />
          Cover Image <span className="text-accent">*</span>
        </Label>
        <span className="text-xs font-paragraph text-muted-foreground">
          16:9 ratio
        </span>
      </div>

      <div className="border-2 border-dashed border-border hover:border-accent/60 bg-secondary/40 hover:bg-secondary/70 transition-all duration-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer rounded-xs group">
        <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:text-accent group-hover:scale-110 transition-all duration-200 mb-3 shadow-xs">
          <LuUpload className="text-xl" />
        </div>
        <p className="font-paragraph text-sm text-foreground font-medium mb-1">
          Drag & drop your cover image here
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          or browse from your device
        </p>
        <Button
          type="button"
          intent="secondary"
          size="xs"
          className="pointer-events-none group-hover:border-foreground"
        >
          Browse File
        </Button>
        <input
          type="file"
          id="post-image-file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          {...register('postImage')}
        />
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-border w-full" />
        <span className="bg-card px-2 text-[11px] font-paragraph text-muted-foreground uppercase tracking-widest absolute">
          or image url
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="bg-secondary/60 py-2 px-3 flex items-center gap-2 border border-border rounded-xs focus-within:border-accent">
          <LuLink className="text-muted-foreground text-sm shrink-0" />
          <Input
            type="url"
            id="post-image-url"
            name="coverImageUrl"
            intent="unstyled"
            placeholder="https://images.unsplash.com/photo-..."
            className="placeholder:text-xs text-xs font-paragraph"
          />
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/30 p-2.5 rounded-xs border border-border/50">
        <LuInfo className="text-sm text-accent shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Supports PNG, JPG, WebP up to 5MB. Recommended dimensions: 1200×675px.
        </p>
      </div>
    </div>
  );
}
