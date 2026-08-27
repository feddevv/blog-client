import Input from '@/components/Input';
import { LabelWrapper } from '@/components/Label';
import { LuSearch } from 'react-icons/lu';
import Card from '@/components/Card';
import Footer from '@/pages/Home/Footer';
import Spinner from '@/components/Spinner';
import NoPosts from './NoPosts';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { Link, useSearchParams } from 'react-router';
import { usePosts } from '@/hooks/usePosts';
import FailedToLoad from '@/components/FailedToLoad';
import Pagination from '@/components/Pagination';
import { useTogglePostLikes } from '@/hooks/useLikes';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const page = searchParams.get('page') || '1';

  const [search, setSearch] = useState<string>(query);
  const debouncedSearch = useDebounce(search, 600);

  const {
    data: posts,
    isPending,
    isError,
    refetch,
  } = usePosts(debouncedSearch, Number(page));
  const totalPages = posts?.totalCount
    ? Math.ceil(posts.totalCount / posts.pageSize)
    : 0;

  const { mutate } = useTogglePostLikes();

  const handleChangePage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setSearchParams((prev) => {
      prev.set('page', `${page}`);
      return prev;
    });
  };

  useEffect(() => {
    setSearchParams(
      (prev) => {
        if (debouncedSearch.trim()) {
          prev.set('search', debouncedSearch);
        } else prev.delete('search');

        prev.set('page', '1');

        return prev;
      },

      { replace: true }
    );
  }, [debouncedSearch]);

  return (
    <>
      <section className="py-16 px-4 border-b border-border">
        <p className="text-accent text-[clamp(12px,2vw,14px)] font-paragraph mb-4">
          INDEPENDENT · THOUGHTFUL · TECHNICAL
        </p>
        <h2 className="font-heading font-bold text-[clamp(32px,5vw,46px)] text-foreground mb-3">
          Writing worth your attention.
        </h2>
        <p className="text-muted-foreground max-w-150 text-[clamp(15px,2vw,18px)]">
          Deep-dive articles on engineering, design, and the intersection of
          technology and life — written by practitioners.
        </p>

        <form onSubmit={(e) => e.preventDefault()} role="search">
          <LabelWrapper className="bg-input-background p-2 border border-border mt-4">
            <LuSearch className="text-base text-muted-foreground" />
            <Input
              intent={'unstyled'}
              type="search"
              name="search"
              placeholder="Search 5000+ posts..."
              className="font-3xl"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </LabelWrapper>
        </form>
      </section>

      <section className="px-4 py-10 flex flex-col items-center gap-10 min-h-100">
        {isPending ? (
          <Spinner className="m-auto" testId="spinner" />
        ) : isError ? (
          <FailedToLoad
            className="bg-card p-8 border border-border m-auto"
            isPending={isPending}
            refetch={refetch}
            title="Failed to load posts"
          />
        ) : posts.data && posts.data.length ? (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {posts.data.map((post) => (
                <Link to={`/post/${post.id}`} className="flex" key={post.id}>
                  <Card
                    img={post.imageUrl}
                    title={post.title}
                    description={post.description ?? 'No description'}
                    likes={post.likesCount}
                    isLiked={post.isLiked}
                    onLikeClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      mutate({ id: post.id });
                    }}
                  />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <NoPosts />
        )}
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={Number(page)}
            handleChangePage={handleChangePage}
          />
        )}
      </section>

      <Footer />
    </>
  );
}
