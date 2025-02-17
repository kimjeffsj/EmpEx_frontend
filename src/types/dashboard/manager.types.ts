import { PayPeriodStatus } from "../features/payroll.types";

export interface ManagerDashboardStats {
  stats: {
    totalEmployees: number;
    newHires: number;
    resignations: number;
    pendingPayroll: number;
    currentPeriod: {
      id: number;
      startDate: string;
      endDate: string;
      periodType: "FIRST_HALF" | "SECOND_HALF";
      status: PayPeriodStatus;
      submittedTimesheets: number;
      totalEmployees: number;
      totalHours: number;
      overtimeHours: number;
    };
    timesheetStats: {
      submitted: number;
      pending: number;
      overdue: number;
    };
  };
}
