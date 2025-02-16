import { ApiListResponse, ApiResponse } from "./api.types";
import { BaseEntity, BaseFilter, ID } from "./common.types";
import { ISODateString } from "./date.types";

// 직원 기본 정보
export interface Employee extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  sinNumber: string;
  address: string;
  dateOfBirth: ISODateString | null;
  payRate: number | null;
  startDate: ISODateString | null;
  resignedDate: ISODateString | null;
}

// 직원 생성 DTO
export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  sinNumber: string;
  address: string;
  dateOfBirth?: ISODateString;
  payRate: number;
  startDate: ISODateString;
}

// 직원 수정 DTO
export interface UpdateEmployeeDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  payRate?: number;
  resignedDate?: ISODateString;
}

// 직원 필터
export interface EmployeeFilters extends BaseFilter {
  isResigned?: boolean;
  department?: string;
  hireStartDate?: ISODateString;
  hireEndDate?: ISODateString;
}

// 직원 목록을 위한 간단한 정보
export interface EmployeeListItem {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  startDate: ISODateString | null;
  // position?: string;
  // department?: string;
}

// API 응답 타입
export type EmployeeListResponse = ApiListResponse<Employee>;
export type EmployeeResponse = ApiResponse<Employee>;
export type EmployeeBasicListResponse = ApiListResponse<EmployeeListItem>;
