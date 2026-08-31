export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
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

// AUTH
export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

// LIKES
export interface ToggleLikeRequest {
  id: number;
}
