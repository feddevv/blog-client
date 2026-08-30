import Spinner from '@/components/Spinner';
import type { Post } from '@/types';
import { formatDate } from '@/utils/utils';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PostMainProps {
  post?: Post;
  isPending: boolean;
}

export default function PostMain({ isPending, post }: PostMainProps) {
  return isPending ? (
    <div className="flex-1 flex items-center justify-center">
      <Spinner testId="post-spinner" />
    </div>
  ) : (
    post && (
      <section className="max-w-270 w-full mx-auto px-4 py-16 flex-1">
        <p className="font-paragraph text-muted-foreground text-sm mb-8">
          {`${formatDate(post.createdAt, 'N/A')}`} · 4 823 views
        </p>

        <h2 className="font-heading text-primary text-[clamp(1.7rem,3vw,3rem)] font-bold mb-4">
          {post.title}
        </h2>
        <p className="text-muted-foreground text-[clamp(1rem,2vw,1.25rem)]">
          {post.description}
        </p>

        <div className="border-b border-border h-px my-8"></div>

        <img
          src={post.imageUrl}
          alt=""
          className="object-cover w-full h-100 mb-8"
        />

        <div className="max-w-200 mx-auto prose dark:prose-invert">
          <Markdown remarkPlugins={[remarkGfm]}>{post.content ?? ''}</Markdown>
        </div>
      </section>
    )
  );
}
