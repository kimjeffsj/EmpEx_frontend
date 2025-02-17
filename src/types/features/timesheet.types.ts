import { BaseFilter, ID } from "../common/base.types";
import { TimesheetStatus } from "./payroll.types";

export interface Timesheet {
  id: ID;
  employeeId: ID;
  payPeriodId: ID;
  startTime: string;
  endTime: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  totalPay: number;
  status: TimesheetStatus;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimesheetDto {
  employeeId: ID;
  payPeriodId: ID;
  startTime: string;
  endTime: string;
  regularHours: number;
  overtimeHours?: number;
  comment?: string;
}

export interface UpdateTimesheetDto {
  startTime?: string;
  endTime?: string;
  regularHours?: number;
  overtimeHours?: number;
  status?: TimesheetStatus;
  comment?: string;
}

export interface TimesheetFilter extends BaseFilter {
  employeeId?: ID;
  payPeriodId?: ID;
  startDate?: string;
  endDate?: string;
  status?: TimesheetStatus;
}
