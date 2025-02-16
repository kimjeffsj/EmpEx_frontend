import { ApiResponse } from "./api.types";
import { ID } from "./common.types";
import { ISODateString, WorkHours } from "./date.types";

// 타임시트 현황
export interface EmployeeTimesheet {
  currentPeriod: {
    id: ID;
    startDate: ISODateString;
    endDate: ISODateString;
    status: "PROCESSING" | "COMPLETED";
    regularHours: number;
    overtimeHours: number;
    totalHours: number;
    totalPay: number;
  };
  monthlyHours: WorkHours;
}

// 급여 명세서
export interface PaystubSummary {
  periodId: ID;
  startDate: ISODateString;
  endDate: ISODateString;
  regularHours: number;
  overtimeHours: number;
  grossPay: number;
  netPay: number;
  status: "DRAFT" | "CONFIRMED" | "SENT" | "COMPLETED";
}

// 근무 일정
export interface UpcomingSchedule {
  id: ID;
  startTime: ISODateString;
  endTime: ISODateString;
  location?: string;
  notes?: string;
}

// 직원 정보
export interface EmployeeInfo {
  payRate: number;
  department?: string;
  position?: string;
  manager?: {
    id: ID;
    name: string;
    email: string;
  };
}

// 직원 대시보드 통계
export interface EmployeeDashboardStats {
  employee: EmployeeInfo;
  timesheet: EmployeeTimesheet;
  payroll: {
    lastPaystub: PaystubSummary;
    ytdEarnings: number;
    nextPayDate: ISODateString;
  };
  schedule: {
    upcoming: UpcomingSchedule[];
    totalHoursThisWeek: number;
  };
}

// 알림
export interface EmployeeNotification {
  id: ID;
  type: "SCHEDULE_CHANGE" | "TIMESHEET_REMINDER" | "PAYSTUB_AVAILABLE";
  title: string;
  message: string;
  timestamp: ISODateString;
  read: boolean;
}

// API 응답 타입
export type EmployeeDashboardResponse = ApiResponse<EmployeeDashboardStats>;
export type EmployeeNotificationsResponse = ApiResponse<EmployeeNotification[]>;
