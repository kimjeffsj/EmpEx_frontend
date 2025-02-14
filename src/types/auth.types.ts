export enum UserRole {
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

export interface ProtectedRoute {
  path: string;
  roles: UserRole[];
}

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  employeeId?: number;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  password?: string;
  isActive?: boolean;
}

export interface CreateEmployeeAccountDto {
  employeeId: number;
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface TokenPayload {
  id: number;
  email: string;
  role: UserRole;
  employeeId?: number;
  exp?: number;
  iat?: number;
}
