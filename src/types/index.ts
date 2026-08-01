export type PostState = 'PUBLISHED' | 'HIDDEN' | 'DRAFT';

export interface Post {
  id: string;
  title: string;
  description?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  state: PostState;
}
