import { Employee } from "./employee.types";
import { ID } from "../common/base.types";

export type PayPeriodType = "FIRST_HALF" | "SECOND_HALF";
export type PayPeriodStatus = "PROCESSING" | "COMPLETED";
export type PayrollStatus = "DRAFT" | "CONFIRMED" | "COMPLETED";

export interface PayPeriodResponse {
  id: ID;
  startDate: string;
  endDate: string;
  periodType: PayPeriodType;
  status: PayPeriodStatus;
  createdAt: string;
  updatedAt: string;
  payrolls: PayrollResponse[];
}

export interface PayrollResponse {
  id: ID;
  employeeId: ID;
  payPeriodId: ID;
  totalRegularHours: string;
  totalOvertimeHours: string;
  totalHours: string;
  grossPay: number;
  status: PayrollStatus;
  employee: Employee;
  createdAt: string;
  updatedAt: string;
}

// 엑셀 내보내기 타입
export interface PayrollExport {
  employeeName: string;
  employeeId: number;
  payPeriod: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  payRate: number;
  grossPay: number;
  status: PayrollStatus;
}
