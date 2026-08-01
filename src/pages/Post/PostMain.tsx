import type { Post } from '@/types';
import { formatDate } from '@/utils/formatDate';

interface PostMainProps {
  post?: Post;
}

export default function PostMain({ post }: PostMainProps) {
  if (!post) return <p>Not found</p>;

  return (
    <section className="max-w-270 mx-auto px-4 py-16">
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
        src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
        alt=""
        className="object-cover w-full h-100 mb-8"
      />

      <p className="text-muted-foreground max-w-200 mx-auto">{post.content}</p>
    </section>
  );
}
