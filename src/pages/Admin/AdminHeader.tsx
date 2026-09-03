import {
  LuFileText,
  LuCircleCheck,
  LuFilePenLine,
  LuEyeOff,
} from 'react-icons/lu';

interface AdminHeaderProps {
  totalCount?: number;
  publishedCount?: number;
  draftCount?: number;
  hiddenCount?: number;
}

export default function AdminHeader({
  totalCount = 24,
  publishedCount = 16,
  draftCount = 5,
  hiddenCount = 3,
}: AdminHeaderProps) {
  return (
    <header className="border-b border-border pb-8 mb-8">
      <div className="flex flex-col gap-2">
        <p className="text-accent text-[clamp(12px,2vw,14px)] font-paragraph tracking-wider uppercase">
          ADMINISTRATION · CONTENT CONTROL
        </p>
        <h1 className="font-heading font-bold text-[clamp(28px,4vw,40px)] text-foreground leading-tight">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-[clamp(14px,2vw,16px)] max-w-2xl">
          Create, edit, manage publication status, and organize articles across
          the platform.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-card border border-border p-4 rounded-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-paragraph uppercase">
              Total Posts
            </span>
            <LuFileText className="text-sm" />
          </div>
          <p className="font-heading text-2xl font-bold text-foreground">
            {totalCount}
          </p>
        </div>

        <div className="bg-card border border-border p-4 rounded-xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="text-xs font-paragraph uppercase">Published</span>
            <LuCircleCheck className="text-sm" />
          </div>
          <p className="font-heading text-2xl font-bold text-foreground">
            {publishedCount}
          </p>
        </div>

        <div className="bg-card border border-border p-4 rounded-xs">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1">
            <span className="text-xs font-paragraph uppercase">Drafts</span>
            <LuFilePenLine className="text-sm" />
          </div>
          <p className="font-heading text-2xl font-bold text-foreground">
            {draftCount}
          </p>
        </div>

        <div className="bg-card border border-border p-4 rounded-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-paragraph uppercase">Hidden</span>
            <LuEyeOff className="text-sm" />
          </div>
          <p className="font-heading text-2xl font-bold text-foreground">
            {hiddenCount}
          </p>
        </div>
      </div>
    </header>
  );
}
