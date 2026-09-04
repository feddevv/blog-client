import Spinner from '@/components/Spinner';
import AdminHeader from './AdminHeader';
import AdminToolbar from './AdminToolbar';
import PostTable from './PostTable';
import Pagination from '@/components/Pagination';
import { usePosts } from '@/hooks/usePosts';
import { useState } from 'react';
import type { StatusFilter } from './types';
import useDebounce from '@/hooks/useDebounce';
import { useSearchParams } from 'react-router';

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [postsState, setPostsState] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 400);
  const page = searchParams.get('page') || 1;

  const { data: posts, isPending } = usePosts(
    debouncedSearch,
    Number(page),
    postsState === 'ALL' ? undefined : postsState
  );
  const totalPages = posts?.totalCount
    ? Math.ceil(posts.totalCount / posts.pageSize)
    : 0;

  const handleChangePage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setSearchParams((prev) => {
      prev.set('page', `${page}`);

      return prev;
    });
  };

  return isPending ? (
    <Spinner testId="admin-spinner" className="m-auto" />
  ) : (
    posts && (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AdminHeader
          totalCount={posts.data.length}
          publishedCount={
            posts.data.filter((p) => p.state === 'PUBLISHED').length
          }
          draftCount={posts.data.filter((p) => p.state === 'DRAFT').length}
          hiddenCount={posts.data.filter((p) => p.state === 'HIDDEN').length}
        />

        <AdminToolbar
          searchTerm={search}
          onSearchChange={setSearch}
          selectedFilter={postsState}
          onFilterChange={setPostsState}
        />

        <PostTable posts={posts.data || []} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
          <p className="text-xs font-paragraph text-muted-foreground">
            Showing{' '}
            <span className="font-semibold text-foreground">
              {posts.data.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-foreground">
              {posts.data.length}
            </span>{' '}
            posts
          </p>

          <Pagination
            totalPages={Math.ceil(posts.totalCount / posts.pageSize)}
            currentPage={Number(page)}
            handleChangePage={handleChangePage}
          />
        </div>
      </div>
    )
  );
}
