export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "EMPLOYEE" | "MANAGER";
  isActive: boolean;
  employeeId?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
