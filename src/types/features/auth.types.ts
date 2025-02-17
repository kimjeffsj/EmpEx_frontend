import { ID } from "../common/base.types";

export enum UserRole {
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

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

export interface ProtectedRoute {
  path: string;
  roles: UserRole[];
}

export interface TokenPayload {
  id: number;
  email: string;
  role: UserRole;
  employeeId?: number;
  exp?: number;
  iat?: number;
}
