import { BaseFilter, ID } from "../common/base.types";

export type ScheduleStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "REVIEW_REQUESTED";

export interface Schedule {
  id: ID;
  employeeId: ID;
  employee: {
    firstName: string;
    lastName: string;
    email: string;
  };
  startTime: string;
  endTime: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  status: ScheduleStatus;
  location?: string;
  isHoliday: boolean;
  holidayName?: string;
  reviewComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleDto {
  employeeId: ID;
  startTime: string;
  endTime: string;
  location?: string;
  isHoliday?: boolean;
  holidayName?: string;
  payPeriodId?: ID;
}

export interface CreateBulkScheduleDto {
  employeeIds: number[];
  startTime: Date;
  endTime: Date;
  location?: string;
  isHoliday?: boolean;
  holidayName?: string;
  payPeriodId: number;
}

export interface UpdateScheduleDto {
  startTime?: Date;
  endTime?: Date;
  location?: string;
  isHoliday?: boolean;
  holidayName?: string;
  status?: ScheduleStatus;
  reviewComment?: string;
}

export interface ReviewRequestDto {
  reviewReason: string;
  startTime: Date;
  endTime: Date;
}

export interface ReviewResponseDto {
  reviewComment: string;
  status: ScheduleStatus;
}

export interface ScheduleFilters extends BaseFilter {
  employeeId?: number;
  startDate?: Date;
  endDate?: Date;
  status?: ScheduleStatus;
  location?: string;
}
