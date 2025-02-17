import { PayPeriodStatus, PayrollStatus } from "../features/payroll.types";

export interface EmployeeDashboardStats {
  employee: {
    payRate: number;
  };
  timesheet: {
    currentPeriod: {
      id: number;
      startDate: string;
      endDate: string;
      status: PayPeriodStatus;
      regularHours: number;
      overtimeHours: number;
      totalHours: number;
      totalPay: number;
    };
    monthlyHours: {
      regularHours: number;
      overtimeHours: number;
      totalHours: number;
    };
  };
  payroll: {
    lastPaystub: {
      periodId: number;
      startDate: string;
      endDate: string;
      regularHours: number;
      overtimeHours: number;
      grossPay: number;
      status: PayrollStatus;
    } | null;
  };
}
