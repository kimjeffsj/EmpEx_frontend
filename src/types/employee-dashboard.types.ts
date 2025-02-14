export interface EmployeeTimesheet {
  currentPeriod: {
    id: number;
    startDate: Date;
    endDate: Date;
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
    startDate: Date;
    endDate: Date;
    regularHours: number;
    overtimeHours: number;
    grossPay: number;
    status: "DRAFT" | "CONFIRMED" | "SENT" | "COMPLETED";
  };
}

export interface EmployeeDashboardStats {
  timesheet: EmployeeTimesheet;
  payroll: EmployeePayroll;
}
