import type { PostState } from '@/types';

export interface AdminPostItem {
  id: number;
  title: string;
  description?: string;
  state: PostState;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  authorName?: string;
  readTime?: string;
}

export type StatusFilter = 'ALL' | PostState;
