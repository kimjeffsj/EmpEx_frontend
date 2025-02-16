import {
  ApiError,
  ApiErrorCode,
  API_ERROR_STATUS_MAP,
} from "@/types/api.types";

export class APIError extends Error {
  public readonly code: ApiErrorCode;
  public readonly status: number;
  public readonly details?: Record<string, unknown>;

  constructor(error: ApiError) {
    super(error.message);
    this.code = error.code;
    this.status = API_ERROR_STATUS_MAP[error.code];
    this.details = error.details;
    this.name = "APIError";
  }
}

export const createErrorMessage = (error: unknown): string => {
  if (error instanceof APIError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
};

// API 응답에서 에러 처리
export const handleApiError = (error: unknown): never => {
  if (isApiError(error)) {
    throw new APIError(error);
  }
  throw new Error(createErrorMessage(error));
};

// 페이지네이션 파라미터 정규화
export const normalizePaginationParams = (page?: number, limit?: number) => ({
  page: Math.max(1, page || 1),
  limit: Math.min(100, Math.max(1, limit || 10)),
});

// URL 쿼리 파라미터 생성
export const createQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof Date) {
        searchParams.append(key, value.toISOString());
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};
