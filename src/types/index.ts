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
  imageUrl: string;
  imageKey: string;
  likesCount: number;
  isLiked: boolean;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  postId: number;
  likesCount: number;
  isLiked: boolean;
  user: {
    username: string;
  };
}

export interface AuthResponse {
  token: string;
}

export interface ApiErrorDetails {
  message: string;
  path: string;
}

export interface ApiError {
  message: string;
  errors?: ApiErrorDetails[];
}

type UserRole = 'ADMIN' | 'USER' | 'EDITOR';
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface GetPostsResponse {
  data: Post[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export interface GetCommentsResponse {
  data: Comment[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}
