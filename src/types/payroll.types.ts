import { PaginationMeta } from "./api.types";

export interface PayPeriod {
  id: number;
  startDate: Date;
  endDate: Date;
  status: "PROCESSING" | "COMPLETED";
  periodType: "FIRST_HALF" | "SECOND_HALF";
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  payRate: number;
}

export interface TimesheetEntry {
  id: number;
  employeeId: number;
  employee: Employee;
  startTime: Date;
  endTime: Date;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  totalPay: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface PayPeriodDetail extends PayPeriod {
  timesheets: TimesheetEntry[];
  stats: {
    totalRegularHours: number;
    totalOvertimeHours: number;
    totalEmployees: number;
    totalPay: number;
  };
}

export interface PayrollSummary {
  totalWorkHours: number;
  totalOvertimeHours: number;
  totalPayroll: number;
  overtimePay: number;
  workedEmployees: number;
  totalEmployees: number;
  dueDate: Date | null;
  status: "PROCESSING" | "COMPLETED";
}

export interface PayrollFilters {
  periodId?: number;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  employeeId?: number;
  page?: number;
  limit?: number;
}

export interface TimesheetUpdateDto {
  startTime?: Date;
  endTime?: Date;
  status?: "APPROVED" | "REJECTED";
  comment?: string;
}

export interface PayrollResponse {
  data: {
    period: PayPeriodDetail;
    summary: PayrollSummary;
  };
  meta: PaginationMeta;
}
