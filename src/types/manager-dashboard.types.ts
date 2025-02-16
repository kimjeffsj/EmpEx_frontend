import { ApiResponse } from "./api.types";
import { ID } from "./common.types";
import { ISODateString, Period, PeriodType } from "./date.types";

// 급여 기간 상태
export interface PayPeriodStatus extends Period {
  id: ID;
  status: "PROCESSING" | "COMPLETED";
  submittedTimesheets: number;
  totalEmployees: number;
  totalHours: number;
  overtimeHours: number;
}

// 직원 현황 통계
export interface EmployeeStats {
  totalEmployees: number;
  newHires: number;
  resignations: number;
  // departmentDistribution: Record<string, number>;
}

// 급여 현황 통계
export interface PayrollStats {
  pendingPayroll: number;
  currentPeriod: PayPeriodStatus | null;
  lastPeriodComparison: {
    totalHours: number;
    totalPayroll: number;
    percentageChange: number;
  };
}

// 타임시트 현황 통계
export interface TimesheetStats {
  submitted: number;
  pending: number;
  overdue: number;
  approvalRequired: number;
}

// 알림 및 작업
export interface DashboardTask {
  id: ID;
  type: "TIMESHEET_APPROVAL" | "PAYROLL_REVIEW" | "EMPLOYEE_ONBOARDING";
  title: string;
  description: string;
  dueDate: ISODateString;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

// 대시보드 통계 전체
export interface ManagerDashboardStats {
  employees: EmployeeStats;
  payroll: PayrollStats;
  timesheets: TimesheetStats;
  tasks: DashboardTask[];
  lastUpdated: ISODateString;
}

// 필터
export interface PayPeriodFilters {
  startDate?: ISODateString;
  endDate?: ISODateString;
  status?: "PROCESSING" | "COMPLETED";
  periodType?: PeriodType;
}

// API 응답 타입
export type ManagerDashboardResponse = ApiResponse<ManagerDashboardStats>;
