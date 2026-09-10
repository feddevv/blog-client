import Button from '@/components/Button';
import StatusBadge from './StatusBadge';
import { LuCalendar, LuPencil, LuTrash2, LuFileText } from 'react-icons/lu';
import type { AdminPostItem } from './types';
import type { Post } from '@/types';

interface PostTableRowProps {
  post: Post;
  onUpdate?: (post: AdminPostItem) => void;
  onDelete?: (post: AdminPostItem) => void;
}

export default function PostTableRow({
  post,
  onUpdate,
  onDelete,
}: PostTableRowProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors duration-150 group">
      {/* Column 1: Title */}
      <td className="py-4 px-4 align-middle">
        <div className="flex items-start gap-3.5">
          {post.thumbnailUrl ? (
            <img
              src={post.thumbnailUrl}
              alt=""
              className="w-16 h-16 object-cover rounded-xs border border-border shrink-0 bg-muted hidden sm:block"
            />
          ) : (
            <div className="w-12 h-12 rounded-xs border border-border bg-secondary hidden sm:items-center sm:justify-center sm:shrink-0 sm:flex text-muted-foreground">
              <LuFileText className="text-xl" />
            </div>
          )}
          <div className="flex flex-col min-w-0 max-w-md">
            <span className="font-heading font-semibold text-base text-foreground group-hover:text-accent transition-colors duration-150 line-clamp-1">
              {post.title}
            </span>
            {post.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {post.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1 sm:hidden">
              <span className="text-[11px] font-paragraph text-muted-foreground">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Column 2: Status */}
      <td className="py-4 px-4 align-middle whitespace-nowrap">
        <StatusBadge status={post.state} />
      </td>

      {/* Column 3: Date */}
      <td className="py-4 px-4 align-middle whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-paragraph">
          <LuCalendar className="text-xs shrink-0" />
          <span>{formattedDate}</span>
        </div>
      </td>

      {/* Column 4: Two buttons: Update, Delete */}
      <td className="py-4 px-4 align-middle whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            intent="secondary"
            size="xs"
            onClick={() => onUpdate?.(post)}
            className="flex items-center gap-1.5 hover:border-foreground"
            aria-label={`Update post: ${post.title}`}
          >
            <LuPencil className="text-xs" />
            <span>Update</span>
          </Button>

          <Button
            intent="secondary"
            size="xs"
            onClick={() => onDelete?.(post)}
            className="flex items-center gap-1.5 text-destructive border-border hover:border-destructive hover:bg-destructive/10"
            aria-label={`Delete post: ${post.title}`}
          >
            <LuTrash2 className="text-xs" />
            <span>Delete</span>
          </Button>
        </div>
      </td>
    </tr>
  );
}
