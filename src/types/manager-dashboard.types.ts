export interface PayPeriodStatus {
  id: number;
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
  // Employee Status
  totalEmployees: number;
  newHires: number; // Last 30 days
  resignations: number; // Last 30 days

  // Payroll Status
  pendingPayroll: number; // Current pay period total
  currentPeriod: PayPeriodStatus | null;

  // Timesheet Status
  timesheetStats: {
    submitted: number;
    pending: number;
    overdue: number;
  };
}

// Request/Response types by endpoint
export interface PayPeriodFilters {
  startDate?: Date;
  endDate?: Date;
  status?: "PROCESSING" | "COMPLETED";
  periodType?: "FIRST_HALF" | "SECOND_HALF";
  page?: number;
  limit?: number;
}
