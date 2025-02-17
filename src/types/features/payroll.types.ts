import { ID } from "../common/base.types";

export type PayPeriodStatus = "PROCESSING" | "COMPLETED";
export type PayrollStatus = "DRAFT" | "CONFIRMED" | "COMPLETED";
export type TimesheetStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PayPeriod {
  id: ID;
  startDate: string;
  endDate: string;
  type: "FIRST_HALF" | "SECOND_HALF";
  status: PayPeriodStatus;
  submittedTimesheets: number;
  totalEmployees: number;
  totalHours: number;
  overtimeHours: number;
  createdAt: string;
  updatedAt: string;
}
