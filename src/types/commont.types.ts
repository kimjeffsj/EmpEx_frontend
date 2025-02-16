// 기본 ID 타입
export type ID = number;

// Nullable 타입 유틸리티
export type Nullable<T> = T | null;

// 기본 타임스탬프 필드
export interface TimeStamps {
  createdAt: string;
  updatedAt: string;
}

// 상태값을 가지는 모든 엔티티의 기본 상태
export interface EntityStatus {
  isActive: boolean;
}

// 기본 엔티티 인터페이스
export interface BaseEntity extends TimeStamps, EntityStatus {
  id: ID;
}

// API 필터 기본 인터페이스
export interface BaseFilter {
  search?: string;
  isActive?: boolean;
}

// Select 컴포넌트 옵션 타입
export interface SelectOption {
  label: string;
  value: string | number;
}

// 범용 핸들러 타입
export type Handler<T = void> = () => Promise<T>;
export type ErrorHandler = (error: Error) => void;

// 공통 상태 관리 인터페이스
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// 공통 성공/실패 응답
export interface OperationResult {
  success: boolean;
  message?: string;
}
