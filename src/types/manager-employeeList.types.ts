import { ApiResponse, PaginationMeta } from "./api.types";

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  sinNumber: string;
  address: string;
  dateOfBirth: string | null;
  payRate: number | null;
  startDate: string | null;
  resignedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeListResponse {
  data: Employee[];
  meta: PaginationMeta;
}

export type GetEmployeesResponse = ApiResponse<Employee[]>;
