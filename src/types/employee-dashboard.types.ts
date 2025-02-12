export interface EmployeeTimesheet {
  currentPeriod: {
    id: number;
    startDate: string;
    endDate: string;
    status: "PROCESSING" | "COMPLETED";
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
}

export interface EmployeePayroll {
  lastPaystub: {
    periodId: number;
    startDate: string;
    endDate: string;
    regularHours: number;
    overtimeHours: number;
    grossPay: number;
    status: "DRAFT" | "CONFIRMED" | "SENT";
  };
}

export interface EmployeeDashboardStats {
  timesheet: EmployeeTimesheet;
  payroll: EmployeePayroll;
}
