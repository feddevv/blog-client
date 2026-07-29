import { LuMessageCircle } from 'react-icons/lu';

export default function CommentsSection() {
  return (
    <section className="bg-muted py-16 border-t border-border">
      <div className="max-w-270 px-4 mx-auto">
        <h2 className="flex items-center gap-2 font-bold font-heading text-[clamp(1.2rem,2vw,1.5rem)]">
          <LuMessageCircle className="text-accent" />4 Comments
        </h2>

        <div>{/* TODO: COMMENTS SECTION */}</div>
      </div>
    </section>
  );
}
