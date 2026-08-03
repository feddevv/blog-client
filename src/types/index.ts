export type PostState = 'PUBLISHED' | 'HIDDEN' | 'DRAFT';

export interface Post {
  id: number;
  title: string;
  description?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  state: PostState;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  postId: number;
  user: {
    username: string;
  };
}
