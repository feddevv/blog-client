export type PostState = 'PUBLISHED' | 'HIDDEN' | 'DRAFT';

export interface Post {
  id: string;
  title: string;
  description?: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  state: PostState;
}
