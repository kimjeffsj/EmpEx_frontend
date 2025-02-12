export interface PayPeriodStatus {
  startDate: Date;
  endDate: Date;
  periodType: "FIRST_HALF" | "SECOND_HALF";
  status: "PROCESSING" | "COMPLETED";
  submittedTimesheets: number;
  totalEmployees: number;
  totalHours: number;
  overtimeHours: number;
}

export interface ManagerDashboardStats {
  // 직원 현황
  totalEmployees: number;
  newHires: number; // Last 30 days
  resignations: number; // Last 30 days

  // 급여 현황
  pendingPayroll: number; // Current pay period total
  currentPeriod: PayPeriodStatus;

  // 타임시트 현황
  timesheetStats: {
    submitted: number;
    pending: number;
    overdue: number;
  };
}

// 엔드포인트별 요청/응답 타입
export interface PayPeriodFilters {
  startDate?: Date;
  endDate?: Date;
  status?: "PROCESSING" | "COMPLETED";
  periodType?: "FIRST_HALF" | "SECOND_HALF";
  page?: number;
  limit?: number;
}
