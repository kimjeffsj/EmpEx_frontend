import { ApiListResponse, ApiResponse } from "./api.types";
import { BaseEntity, BaseFilter, ID } from "./common.types";
import { ISODateString, TimeRange, WorkHours } from "./date.types";

export enum ScheduleStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  REVIEW_REQUESTED = "REVIEW_REQUESTED",
}
// 기본 일정 인터페이스
export interface Schedule extends BaseEntity, TimeRange, WorkHours {
  employeeId: ID;
  employee: {
    firstName: string;
    lastName: string;
    email: string;
    payRate: number;
  };
  status: ScheduleStatus;
  location?: string;
  isHoliday: boolean;
  holidayName?: string;
  reviewComment?: string;
  createdBy?: {
    id: ID;
    firstName: string;
    lastName: string;
  };
  lastReviewedBy?: {
    id: ID;
    firstName: string;
    lastName: string;
  };
}

// 일정 생성 DTO
export interface CreateScheduleDto {
  employeeId: ID;
  startTime: ISODateString;
  endTime: ISODateString;
  location?: string;
  isHoliday?: boolean;
  holidayName?: string;
  payPeriodId?: ID;
}

// 여러 일정 생성 DTO
export interface CreateBulkScheduleDto {
  employeeIds: ID[];
  startTime: ISODateString;
  endTime: ISODateString;
  location?: string;
  isHoliday?: boolean;
  holidayName?: string;
  payPeriodId?: ID;
}

// 일정 필터
export interface ScheduleFilters extends BaseFilter {
  employeeId?: ID;
  startDate?: ISODateString;
  endDate?: ISODateString;
  location?: string;
  status?: ScheduleStatus;
}

// API 응답 타입
export type ScheduleListResponse = ApiListResponse<Schedule>;
export type SingleScheduleResponse = ApiResponse<Schedule>;

// 리뷰 관련 DTO
export interface ReviewRequestDto extends TimeRange {
  reviewReason: string;
}

export interface ReviewResponseDto {
  reviewComment: string;
  status: ScheduleStatus;
}

// 캘린더 뷰를 위한 이벤트 타입
export interface ScheduleEvent {
  id: ID;
  title: string;
  start: ISODateString;
  end: ISODateString;
  status: ScheduleStatus;
  location?: string;
  employee: {
    id: ID;
    firstName: string;
    lastName: string;
  };
  isHoliday: boolean;
  holidayName?: string;
}
