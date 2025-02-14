export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  meta?: PaginationMeta;
  error?: ApiError;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
