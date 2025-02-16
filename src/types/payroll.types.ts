import { ApiListResponse, ApiResponse } from "./api.types";
import { BaseEntity, BaseFilter, ID } from "./common.types";

import { ISODateString, Period, TimeRange, WorkHours } from "./date.types";

export enum PayrollStatus {
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
}

export enum TimesheetStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// 급여 기간
export interface PayPeriod extends BaseEntity, Period {
  status: PayrollStatus;
}

// 직원 기본 정보
export interface PayrollEmployee {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  payRate: number;
}

// 근무 시간 기록
export interface TimesheetEntry extends BaseEntity, TimeRange, WorkHours {
  employeeId: ID;
  employee: PayrollEmployee;
  status: TimesheetStatus;
  totalPay: number;
}

// 급여 기간 상세
export interface PayPeriodDetail extends PayPeriod {
  timesheets: TimesheetEntry[];
  stats: {
    totalRegularHours: number;
    totalOvertimeHours: number;
    totalEmployees: number;
    totalPay: number;
  };
}

// 급여 요약
export interface PayrollSummary {
  totalWorkHours: number;
  totalOvertimeHours: number;
  totalPayroll: number;
  overtimePay: number;
  workedEmployees: number;
  totalEmployees: number;
  dueDate: ISODateString | null;
  status: PayrollStatus;
}

// 필터
export interface PayrollFilters extends BaseFilter {
  periodId?: ID;
  startDate?: ISODateString;
  endDate?: ISODateString;
  status?: PayrollStatus;
  employeeId?: ID;
}

// 타임시트 업데이트 DTO
export interface TimesheetUpdateDto {
  startTime?: ISODateString;
  endTime?: ISODateString;
  status?: TimesheetStatus;
  comment?: string;
}

// API 응답 데이터 구조
export interface PayrollData {
  period: PayPeriodDetail;
  summary: PayrollSummary;
}

// API 응답 타입
export type PayrollResponse = ApiResponse<PayrollData>;
export type PayPeriodListResponse = ApiListResponse<PayPeriod>;
export type TimesheetListResponse = ApiListResponse<TimesheetEntry>;
