import { ID } from "../common/base.types";

export type UserRole = "MANAGER" | "EMPLOYEE";

export interface User {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  employeeId?: number;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
