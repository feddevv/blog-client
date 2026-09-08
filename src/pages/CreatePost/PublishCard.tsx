import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import {
  LuSend,
  LuSave,
  LuClock,
  LuCircleCheck,
  LuFilePenLine,
} from 'react-icons/lu';

interface PublishCardProps {
  isPending: boolean;
}

export default function PublishCard({ isPending }: PublishCardProps) {
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
        >
          <LuSave className="text-base" />
          <span>Save draft</span>
        </Button>
      </div>

      <div className="pt-2 border-t border-border flex flex-col gap-2">
        <span className="text-[11px] font-paragraph uppercase tracking-wider text-muted-foreground font-medium">
          Checklist
        </span>
        <ul className="space-y-1.5 text-xs font-paragraph text-muted-foreground">
          <li className="flex items-center gap-2">
            <LuCircleCheck className="text-xs text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Title provided</span>
          </li>
          <li className="flex items-center gap-2">
            <LuCircleCheck className="text-xs text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Cover image selected</span>
          </li>
          <li className="flex items-center gap-2">
            <LuCircleCheck className="text-xs text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Short excerpt written</span>
          </li>
          <li className="flex items-center gap-2">
            <LuCircleCheck className="text-xs text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Article content filled</span>
          </li>
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
