import { BaseFilter, ID } from "../common/base.types";
import { User } from "./auth.types";
import { Employee } from "./employee.types";
import { ScheduleStatus } from "./schedule.types";

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
  status: ScheduleStatus;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  location?: string | null;
  isHoliday: boolean;
  holidayName?: string | null;
  reviewReason?: string | null;
  reviewComment?: string | null;
  createdById?: number | null;
  lastReviewedById?: number | null;
  employee: Employee;
  createdBy?: User | null;
  lastReviewedBy?: User | null;
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
  status?: ScheduleStatus;
  comment?: string;
}

export interface TimesheetFilter extends BaseFilter {
  employeeId?: ID;
  payPeriodId?: ID;
  startDate?: string;
  endDate?: string;
  status?: ScheduleStatus;
}
