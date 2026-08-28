import type { Post } from '@/types';

export let mockPosts: Post[] = [];

export const populatePosts = () => {
  mockPosts = [
    {
      id: 1,
      title: 'Getting Started with MSW and React Query',
      description:
        'A comprehensive guide on mocking API endpoints effectively during local development.',
      content:
        'Mock Service Worker (MSW) allows you to intercept network requests at the network level...',
      createdAt: '2026-01-15T08:30:00.000Z',
      updatedAt: '2026-01-15T08:30:00.000Z',
      userId: 42,
      state: 'PUBLISHED',
      imageKey: 'post-image-1',
      imageUrl: 'https://placehold.co/400x300',
      isLiked: true,
      likesCount: 133,
    },
    {
      id: 2,
      title: 'Mastering TypeScript Type Definitions',
      description:
        'Learn how to leverage strict types for cleaner and safer frontend codebases.',
      content:
        'TypeScript brings type safety to JavaScript, reducing runtime errors and improving DX...',
      createdAt: '2026-02-01T10:15:00.000Z',
      updatedAt: '2026-02-03T14:20:00.000Z',
      userId: 42,
      state: 'PUBLISHED',
      imageKey: 'post-image-2',
      imageUrl: 'https://placehold.co/400x300',
      isLiked: false,
      likesCount: 20,
    },
    {
      id: 3,
      title: 'Draft: Optimizing React Rendering Performance',
      description:
        'Internal notes on memoization, useMemo, and React.memo best practices.',
      content:
        'Unnecessary re-renders can slow down your app. Here are the main strategies to avoid them...',
      createdAt: '2026-03-10T11:00:00.000Z',
      updatedAt: '2026-03-12T09:45:00.000Z',
      userId: 42,
      state: 'DRAFT',
      imageKey: 'post-image-3',
      imageUrl: 'https://placehold.co/400x300',
      isLiked: true,
      likesCount: 55,
    },
    {
      id: 4,
      title: 'Understanding Modern State Management',
      description:
        'Comparing Redux Toolkit, Zustand, and TanStack Query for frontend architecture.',
      content:
        'Choosing the right state management solution depends heavily on your application needs...',
      createdAt: '2026-04-05T16:00:00.000Z',
      updatedAt: '2026-04-05T16:00:00.000Z',
      userId: 42,
      state: 'PUBLISHED',
      imageKey: 'post-image-4',
      imageUrl: 'https://placehold.co/400x300',
      isLiked: true,
      likesCount: 31,
    },
    {
      id: 5,
      title: 'Archived Feature Specs',
      description: 'Deprecation details for the legacy authentication flow.',
      content:
        'This document contains hidden specifications for the old auth architecture...',
      createdAt: '2026-05-20T13:10:00.000Z',
      updatedAt: '2026-05-21T07:30:00.000Z',
      userId: 42,
      state: 'HIDDEN',
      imageKey: 'post-image-5',
      imageUrl: 'https://placehold.co/400x300',
      isLiked: false,
      likesCount: 100,
    },
    {
      id: 6,
      title: 'Effective Unit Testing for Custom Hooks',
      description:
        'When and how to write tests for React custom hooks using React Testing Library.',
      content:
        'Custom hooks that encapsulate business logic should be thoroughly tested...',
      createdAt: '2026-06-18T09:00:00.000Z',
      updatedAt: '2026-06-18T10:00:00.000Z',
      userId: 42,
      state: 'PUBLISHED',
      imageKey: 'post-image-6',
      imageUrl: 'https://placehold.co/400x300',
      isLiked: false,
      likesCount: 544,
    },
    {
      id: 7,
      title: 'Draft: Building Scalable Design Systems',
      description:
        'Outline for building reusable component libraries with Tailwind CSS.',
      content:
        'Work in progress outline for component token design and accessibility standards...',
      createdAt: '2026-07-29T14:45:00.000Z',
      updatedAt: '2026-08-01T11:20:00.000Z',
      userId: 42,
      state: 'DRAFT',
      imageKey: 'post-image-7',
      imageUrl: 'https://placehold.co/400x300',
      isLiked: false,
      likesCount: 0,
    },
  ];
};
