import { IoIosArrowBack } from 'react-icons/io';
import { LuCopy, LuHeart } from 'react-icons/lu';
import { NavLink, useParams } from 'react-router';
import Button from '@/components/Button';
import PostMain from './PostMain';
import CommentsSection from './CommentsSection';
import { usePostById } from '@/hooks/usePosts';
import { useTogglePostLikes } from '@/hooks/useLikes';

export default function Post() {
  const { id } = useParams();
  const { data: post, isPending } = usePostById(Number(id));
  const { mutate } = useTogglePostLikes();

  return (
    <>
      <div className="sticky top-16 left-0 right-0 bg-background border-b border-border px-4 py-2">
        <div className="flex justify-between max-w-270 mx-auto">
          <div className="text-muted-foreground flex items-center gap-2 group/back">
            {/* TODO: CHANGE IT SO FOCUSED THE WHOLE CONTAINER, NOT JUST LINK */}
            <IoIosArrowBack className="text-sm group-hover/back:text-foreground transition-colors duration-200" />
            <NavLink
              to={'/'}
              className="group-hover/back:text-foreground transition-colors duration-200 text-[clamp(14px,2vw,16px)]"
            >
              All articles
            </NavLink>
          </div>

          <div className="flex gap-2">
            <Button
              intent={'secondary'}
              className="flex items-center gap-1"
              onClick={() => mutate({ id: Number(id) })}
            >
              <LuHeart
                className={`text-sm ${post?.isLiked ? 'text-destructive' : 'text-muted-foreground'}`}
              />
              <span
                className={`${post?.isLiked ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                {post?.likesCount || 0}
              </span>
            </Button>

            <Button intent={'secondary'} className="flex items-center gap-1">
              <LuCopy className="text-sm" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <PostMain post={post} isPending={isPending} />

      <CommentsSection id={Number(id)} />
    </>
  );
}
