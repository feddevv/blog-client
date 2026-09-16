import Label from '@/components/Label';
import Button from '@/components/Button';
import { LuImage, LuUpload } from 'react-icons/lu';
import type { FieldProps } from './types';
import { useEffect, useRef, useState, type DragEventHandler } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import type { CreatePostFormValues } from '@/types/zod';

interface ImageUploadFieldProps extends FieldProps {
  setValue: UseFormSetValue<CreatePostFormValues>;
}

export default function ImageUploadField({
  register,
  setValue,
}: ImageUploadFieldProps) {
  const [isDragged, setIsDragged] = useState<boolean>(false);

  const dropZone = useRef<HTMLLabelElement>(null);

  const preventWindowDrop = (e: DragEvent) => {
    if (
      e.dataTransfer &&
      [...e.dataTransfer.items].some((item) => item.kind === 'file')
    ) {
      e.preventDefault();
    }
  };
  const preventWindowDragOver = (e: DragEvent) => {
    if (e.dataTransfer) {
      const fileItems = [...e.dataTransfer.items].filter(
        (item) => item.kind === 'file'
      );

      if (fileItems.length > 0) {
        e.preventDefault();
        if (dropZone && !dropZone.current?.contains(e.target as Node)) {
          e.dataTransfer.dropEffect = 'none';
        }
      }
    }
  };
  const handleOnDrop: DragEventHandler = (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setValue('postImage', files, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
    setIsDragged(false);
  };
  const handleDragOver: DragEventHandler = (e) => {
    const fileItems = [...e.dataTransfer.items].filter(
      (item) => item.kind === 'file'
    );

    if (fileItems.length > 0) {
      e.preventDefault();

      if (fileItems.some((item) => item.type.startsWith('image/'))) {
        e.dataTransfer.dropEffect = 'copy';
      } else e.dataTransfer.dropEffect = 'none';
    }
  };

  useEffect(() => {
    window.addEventListener('drop', preventWindowDrop);
    window.addEventListener('dragover', preventWindowDragOver);

    return () => {
      window.removeEventListener('drop', preventWindowDrop);
      window.removeEventListener('dragover', preventWindowDragOver);
    };
  });

  return (
    <Label
      ref={dropZone}
      htmlFor="post-image-file"
      className={`bg-card border border-border p-5 rounded-xs flex flex-col gap-4 cursor-pointer`}
      onDragOver={handleDragOver}
      onDrop={handleOnDrop}
      onDragEnter={() => {
        setIsDragged(true);
      }}
      onDragLeave={() => {
        setIsDragged(false);
      }}
    >
      <span className="pointer-events-none flex items-center gap-1.5 font-bold uppercase tracking-wider">
        <LuImage className="pointer-events-none text-accent text-sm" />
        Cover Image <span className="pointer-events-none text-accent">*</span>
      </span>
      <div
        className={`pointer-events-none border-2 border-dashed bg-secondary/70 ${isDragged ? 'border-accent/60' : 'border-border'} transition-all duration-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer rounded-xs`}
      >
        <div
          className={`pointer-events-none w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center ${isDragged ? 'text-accent scale-110' : 'text-muted-foreground'} transition-all duration-200 mb-3 shadow-xs`}
        >
          <LuUpload className="pointer-events-none text-xl" />
        </div>
        <p className="pointer-events-none font-paragraph text-sm text-foreground font-medium mb-1">
          Drag & drop your cover image here
        </p>
        <p className="pointer-events-none text-xs text-muted-foreground mb-4">
          or browse from your device
        </p>
        <Button
          type="button"
          intent="secondary"
          size="xs"
          className="pointer-events-none"
        >
          Browse File
        </Button>
        <input
          type="file"
          id="post-image-file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="pointer-events-none hidden"
          {...register('postImage')}
        />
      </div>
    </Label>
  );
}
