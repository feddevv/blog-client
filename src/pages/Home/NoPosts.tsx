import { LuFileQuestion } from 'react-icons/lu';

export default function NoPosts() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-border bg-muted/30 m-auto">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3 text-muted-foreground">
        <LuFileQuestion className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-lg text-muted-foreground">
        No posts yet
      </h3>
    </div>
  );
}
