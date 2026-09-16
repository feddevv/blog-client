import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import type { PostFormValues } from '@/types/zod';
import type { FieldError, FieldErrors } from 'react-hook-form';
import {
  LuSend,
  LuSave,
  LuClock,
  LuCircleCheck,
  LuFilePenLine,
  LuCircleX,
} from 'react-icons/lu';

interface PublishCardProps {
  isPending: boolean;
  errors: FieldErrors<PostFormValues>;
  handleSaveDraft?: () => void;
}

export default function PublishCard({
  isPending,
  errors,
  handleSaveDraft,
}: PublishCardProps) {
  return (
    <div
      className={`bg-card border border-border p-5 rounded-xs flex flex-col gap-4`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="font-heading font-semibold text-base text-foreground">
          Publish Actions
        </h3>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-paragraph uppercase tracking-wider rounded-xs border bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300">
          <LuFilePenLine className="text-[11px]" />
          Draft
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5">
        <Button
          type="submit"
          intent="primary"
          size="md"
          className="w-full flex items-center justify-center gap-2 font-medium shadow-xs"
          disabled={isPending}
        >
          {isPending ? (
            <Spinner className="border-primary-foreground border-l-transparent w-6 h-6" />
          ) : (
            <>
              <LuSend className="text-base" />
              <span>Publish</span>
            </>
          )}
        </Button>

        <Button
          type="button"
          intent="secondary"
          size="md"
          className="w-full flex items-center justify-center gap-2 font-medium"
          onClick={handleSaveDraft}
          disabled={isPending}
        >
          {isPending ? (
            <Spinner className="w-6 h-6" />
          ) : (
            <>
              <LuSave className="text-base" />
              <span>Save draft</span>
            </>
          )}
        </Button>
      </div>

      <div className="pt-2 border-t border-border flex flex-col gap-2">
        <span className="text-[11px] font-paragraph uppercase tracking-wider text-muted-foreground font-medium">
          Checklist
        </span>
        <ul className="space-y-1.5 text-xs font-paragraph text-muted-foreground">
          <ListCheckItem error={errors.title} validText="Title provided" />
          <ListCheckItem
            error={errors.postImage}
            validText="Cover image selected"
          />
          <ListCheckItem
            error={errors.description}
            validText="Short excerpt written"
          />
          <ListCheckItem
            error={errors.content}
            validText="Article content filled"
          />
        </ul>
      </div>

      {/* Auto-save Status */}
      <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-paragraph text-muted-foreground">
        <span className="flex items-center gap-1">
          <LuClock className="text-xs" />
          Status
        </span>
        <span>Ready to save</span>
      </div>
    </div>
  );
}

function ListCheckItem({
  error,
  validText,
}: {
  error?: FieldError;
  validText: string;
}) {
  const item = error ? (
    <>
      <LuCircleX className="text-xs text-destructive shrink-0" />
      <span>{error.message}</span>
    </>
  ) : (
    <>
      <LuCircleCheck className="text-xs text-emerald-600 dark:text-emerald-400 shrink-0" />
      <span>{validText}</span>
    </>
  );

  return <li className="flex items-center gap-1.5">{item}</li>;
}
