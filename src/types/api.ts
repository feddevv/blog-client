import type { Post, Comment } from './domain';

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
