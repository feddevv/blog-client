import Spinner from '@/components/Spinner';
import AdminHeader from './AdminHeader';
import AdminToolbar from './AdminToolbar';
import PostTable from './PostTable';
import Pagination from '@/components/Pagination';
import { useDeletePostById, usePosts } from '@/hooks/usePosts';
import { useEffect, useState } from 'react';
import type { AdminPostItem, StatusFilter } from './types';
import useDebounce from '@/hooks/useDebounce';
import { useSearchParams } from 'react-router';

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('search') || '';
  const page = searchParams.get('page') || 1;
  const state = (searchParams.get('state') as StatusFilter) || 'ALL';

  const [search, setSearch] = useState<string>(query);
  const debouncedSearch = useDebounce(search, 400);

  const { data: posts, isPending } = usePosts(
    debouncedSearch,
    Number(page),
    state === 'ALL' ? undefined : state
  );

  const totalPages = posts?.totalCount
    ? Math.ceil(posts.totalCount / posts.pageSize)
    : 0;

  const { mutate: deletePost } = useDeletePostById();

  const handleChangePage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setSearchParams((prev) => {
      prev.set('page', `${page}`);

      return prev;
    });
  };
  const handleChangeState = (filter: StatusFilter) => {
    setSearchParams((prev) => {
      prev.set('state', filter);
      return prev;
    });
  };
  const handleDeletePost = (post: AdminPostItem) => {
    if (window.confirm('Are you sure?')) {
      deletePost(post.id);
    }
  };

  useEffect(() => setSearch(query), [query]);
  useEffect(() => {
    setSearchParams(
      (prev) => {
        if (debouncedSearch.trim()) prev.set('search', debouncedSearch);
        else prev.delete('search');

        return prev;
      },
      { replace: true }
    );
  }, [debouncedSearch]);

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
          selectedFilter={state}
          onFilterChange={handleChangeState}
        />

        <PostTable posts={posts.data || []} onDelete={handleDeletePost} />

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

          {totalPages > 1 && (
            <Pagination
              totalPages={Math.ceil(posts.totalCount / posts.pageSize)}
              currentPage={Number(page)}
              handleChangePage={handleChangePage}
            />
          )}
        </div>
      </div>
    )
  );
}
