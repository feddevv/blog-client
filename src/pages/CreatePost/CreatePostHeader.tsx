import { NavLink } from 'react-router';
import { IoIosArrowBack } from 'react-icons/io';

interface CreatePostHeaderProps {
  className?: string;
}

export default function CreatePostHeader({ className }: CreatePostHeaderProps) {
  return (
    <header className={`border-b border-border pb-6 mb-8 ${className ?? ''}`}>
      <div className="mb-4">
        <NavLink
          to="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-paragraph text-muted-foreground hover:text-foreground transition-colors duration-150 group"
        >
          <IoIosArrowBack className="text-sm group-hover:-translate-x-0.5 transition-transform duration-150" />
          <span>Back to Dashboard</span>
        </NavLink>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-accent text-[clamp(12px,2vw,14px)] font-paragraph tracking-wider uppercase">
            ADMINISTRATION · CONTENT AUTHORING
          </p>
          <h1 className="font-heading font-bold text-[clamp(28px,4vw,38px)] text-foreground leading-tight">
            Create Post
          </h1>
          <p className="text-muted-foreground text-[clamp(14px,2vw,16px)] max-w-2xl">
            Craft, format, and publish stories with markdown styling, cover
            imagery, and visibility controls.
          </p>
        </div>
      </div>
    </header>
  );
}
