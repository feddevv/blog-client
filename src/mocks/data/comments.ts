import type { Comment } from '@/types';

export let mockComments: Comment[] = [];

export const populateComments = () => {
  mockComments = [
    {
      id: 1,
      content:
        'Great overview! MSW completely changed how I handle frontend testing.',
      createdAt: '2026-01-16T10:00:00.000Z',
      updatedAt: '2026-01-16T10:00:00.000Z',
      userId: 101,
      postId: 1,
      user: {
        username: 'alex_dev',
      },
      isLiked: true,
      likesCount: 10,
    },
    {
      id: 2,
      content:
        'How do you handle resetting MSW handlers between individual test cases?',
      createdAt: '2026-01-17T14:22:00.000Z',
      updatedAt: '2026-01-17T14:22:00.000Z',
      userId: 102,
      postId: 1,
      user: {
        username: 'kate_coder',
      },
      isLiked: false,
      likesCount: 23,
    },
    {
      id: 3,
      content:
        'Strict type definitions saved our team so many production bugs last month.',
      createdAt: '2026-02-02T09:15:00.000Z',
      updatedAt: '2026-02-02T09:15:00.000Z',
      userId: 103,
      postId: 2,
      user: {
        username: 'marco_ts',
      },
      isLiked: false,
      likesCount: 3,
    },
    {
      id: 4,
      content:
        'TanStack Query handles server state so well that we barely need local state anymore.',
      createdAt: '2026-04-06T11:45:00.000Z',
      updatedAt: '2026-04-06T11:45:00.000Z',
      userId: 101,
      postId: 4,
      user: {
        username: 'alex_dev',
      },
      isLiked: true,
      likesCount: 4,
    },
    {
      id: 5,
      content:
        'Testing custom hooks with renderHook from RTL works like a charm!',
      createdAt: '2026-06-19T08:30:00.000Z',
      updatedAt: '2026-06-19T08:30:00.000Z',
      userId: 104,
      postId: 6,
      user: {
        username: 'sarah_ui',
      },
      isLiked: true,
      likesCount: 50,
    },
  ];
};
