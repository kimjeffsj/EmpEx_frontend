import { ID } from "../common/base.types";

export type ScheduleStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "REVIEW_REQUESTED";

export interface Schedule {
  id: ID;
  employeeId: ID;
  employee: {
    firstName: string;
    lastName: string;
    email: string;
  };
  startTime: string;
  endTime: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  status: ScheduleStatus;
  location?: string;
  isHoliday: boolean;
  holidayName?: string;
  reviewComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleDto {
  employeeId: ID;
  startTime: string;
  endTime: string;
  location?: string;
  isHoliday?: boolean;
  holidayName?: string;
  payPeriodId?: ID;
}
