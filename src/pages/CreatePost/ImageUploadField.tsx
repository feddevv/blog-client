import Label from '@/components/Label';
import Button from '@/components/Button';
import { LuImage, LuUpload } from 'react-icons/lu';
import type { FieldProps } from './types';
import { useEffect, useRef } from 'react';

interface ImageUploadFieldProps extends FieldProps {}

export default function ImageUploadField({ register }: ImageUploadFieldProps) {
  const dropZone = useRef<HTMLLabelElement>(null);
  const preventDrop = (e: DragEvent) => {
    if (
      e.dataTransfer &&
      [...e.dataTransfer.items].some((item) => item.kind === 'file')
    ) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener('drop', preventDrop);

    return () => window.removeEventListener('drop', preventDrop);
  });

  return (
    <Label
      ref={dropZone}
      htmlFor="post-image-file"
      className={`bg-card border border-border p-5 rounded-xs flex flex-col gap-4`}
    >
      <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
        <LuImage className="text-accent text-sm" />
        Cover Image <span className="text-accent">*</span>
      </span>
      <Label className="border-2 border-dashed border-border hover:border-accent/60 bg-secondary/40 hover:bg-secondary/70 transition-all duration-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer rounded-xs group">
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
          className="hidden"
          {...register('postImage')}
        />
      </Label>
    </Label>
  );
}
