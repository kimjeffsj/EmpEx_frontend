import { BaseFilter, ID } from "../common/base.types";

export interface Employee {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  sinNumber: string;
  address: string;
  dateOfBirth: string | null;
  payRate: number;
  startDate: string;
  resignedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  sinNumber: string;
  address: string;
  dateOfBirth: string;
  payRate: number;
  startDate: string;
}

export interface EmployeeFilter extends BaseFilter {
  isResigned?: boolean;
}
