import { ApiError, ApiErrorCode } from "@/types/common/api.types";
import { AxiosError } from "axios";

export class APIError extends Error {
  public readonly code: ApiErrorCode;
  public readonly message: ApiErrorCode | string;
  public readonly details?: Record<string, unknown>;

  constructor(error: ApiError) {
    super(error.message);
    this.code = error.code;
    this.message = error.message;
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
  if (error instanceof AxiosError) {
    if (error.response?.data?.error) {
      throw new APIError(error.response.data.error);
    }
    // 네트워크 에러 처리
    throw new APIError({
      code: "SERVER_ERROR",
      message: "Network error occurred",
      details: { originalError: error.message },
    });
  }

  if (error instanceof Error) {
    throw new APIError({
      code: "SERVER_ERROR",
      message: error.message,
    });
  }

  throw new APIError({
    code: "SERVER_ERROR",
    message: "An unexpected error occurred",
  });
};

// 페이지네이션 파라미터 정규화
export const normalizePaginationParams = (page?: number, limit?: number) => ({
  page: Math.max(1, page || 1),
  limit: Math.min(100, Math.max(1, limit || 10)),
});

// URL 쿼리 파라미터 생성
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (value instanceof Date) {
        searchParams.append(key, value.toISOString());
      } else if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(`${key}[]`, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};
