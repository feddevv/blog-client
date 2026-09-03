import AdminHeader from './AdminHeader';
import AdminToolbar from './AdminToolbar';
import PostTable from './PostTable';
import Pagination from '@/components/Pagination';
import type { AdminPostItem } from './types';

const DEFAULT_POSTS: AdminPostItem[] = [
  {
    id: 1,
    title: 'Getting Started with MSW and React Query in Production',
    description:
      'A comprehensive guide on mocking API endpoints effectively during local development and testing.',
    state: 'PUBLISHED',
    createdAt: '2026-01-15T08:30:00.000Z',
    updatedAt: '2026-01-15T08:30:00.000Z',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    title: 'Mastering TypeScript Strict Type Definitions and Generics',
    description:
      'Learn how to leverage strict types and conditional types for cleaner and safer frontend architectures.',
    state: 'PUBLISHED',
    createdAt: '2026-02-01T10:15:00.000Z',
    updatedAt: '2026-02-03T14:20:00.000Z',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516116211227-bbc13c631a00?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    title: 'Draft: Optimizing React Rendering Performance with Compiler',
    description:
      'Internal notes and benchmarks on memoization, useMemo, and the new React Compiler pipeline.',
    state: 'DRAFT',
    createdAt: '2026-03-10T11:00:00.000Z',
    updatedAt: '2026-03-12T09:45:00.000Z',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 4,
    title: 'Understanding Modern State Management in Complex Apps',
    description:
      'Comparing Redux Toolkit, Zustand, and TanStack Query for modern multi-tenant web applications.',
    state: 'PUBLISHED',
    createdAt: '2026-04-05T16:00:00.000Z',
    updatedAt: '2026-04-05T16:00:00.000Z',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 5,
    title: 'Archived Feature Specifications and Legacy Auth Specs',
    description:
      'Deprecation details and migration requirements for the legacy token authentication flow.',
    state: 'HIDDEN',
    createdAt: '2026-05-20T13:10:00.000Z',
    updatedAt: '2026-05-21T07:30:00.000Z',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 6,
    title: 'Draft: Building Scalable Design Systems with Tailwind CSS',
    description:
      'Work in progress outline for token hierarchy, accessible components, and dark mode theming.',
    state: 'DRAFT',
    createdAt: '2026-07-29T14:45:00.000Z',
    updatedAt: '2026-08-01T11:20:00.000Z',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=150&auto=format&fit=crop&q=60',
  },
];

export default function Admin() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <AdminHeader
        totalCount={DEFAULT_POSTS.length}
        publishedCount={
          DEFAULT_POSTS.filter((p) => p.state === 'PUBLISHED').length
        }
        draftCount={DEFAULT_POSTS.filter((p) => p.state === 'DRAFT').length}
        hiddenCount={DEFAULT_POSTS.filter((p) => p.state === 'HIDDEN').length}
      />

      <AdminToolbar
        searchTerm={''}
        onSearchChange={() => {}}
        selectedFilter={'ALL'}
        onFilterChange={() => {}}
      />

      <PostTable posts={DEFAULT_POSTS} />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
        <p className="text-xs font-paragraph text-muted-foreground">
          Showing{' '}
          <span className="font-semibold text-foreground">
            {DEFAULT_POSTS.length}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-foreground">
            {DEFAULT_POSTS.length}
          </span>{' '}
          posts
        </p>

        <Pagination
          totalPages={3}
          currentPage={1}
          handleChangePage={() => {}}
        />
      </div>
    </div>
  );
}
