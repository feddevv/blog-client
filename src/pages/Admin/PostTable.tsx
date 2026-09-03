import PostTableRow from './PostTableRow';
import type { AdminPostItem } from './types';
import { LuFileQuestion } from 'react-icons/lu';

interface PostTableProps {
  posts: AdminPostItem[];
  onUpdate?: (post: AdminPostItem) => void;
  onDelete?: (post: AdminPostItem) => void;
}

export default function PostTable({
  posts,
  onUpdate,
  onDelete,
}: PostTableProps) {
  return (
    <div className="border border-border bg-card overflow-hidden rounded-xs shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-label="Admin posts table">
          <thead>
            <tr className="border-b border-border bg-secondary/50 font-paragraph text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4 w-1/2 min-w-[280px]">
                Title
              </th>
              <th scope="col" className="py-3.5 px-4 w-1/6 min-w-[140px]">
                Status
              </th>
              <th scope="col" className="py-3.5 px-4 w-1/6 min-w-[140px]">
                Date
              </th>
              <th scope="col" className="py-3.5 px-4 w-1/6 min-w-[160px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostTableRow
                  key={post.id}
                  post={post}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-16 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <LuFileQuestion className="text-3xl text-muted-foreground/60" />
                    <p className="font-heading text-lg text-foreground">No posts found</p>
                    <p className="text-xs font-paragraph text-muted-foreground">
                      No posts match the current filter or search criteria.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
