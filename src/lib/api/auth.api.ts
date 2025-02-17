import { LoginCredentials, User } from "@/types/features/auth.types";
import { api } from "./client.api";
import { ApiResponse } from "@/types/common/api.types";
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "@/types/features/employee.types";

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<{ user: User }>>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<void>>("/auth/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get<ApiResponse<{ user: User }>>("/auth/me");
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  },

  updateUser: async (userId: number, data: UpdateEmployeeDto) => {
    const response = await api.put<ApiResponse<{ user: User }>>(
      `/auth/users/${userId}`,
      data
    );
    return response.data;
  },

  createEmployeeAccount: async (data: CreateEmployeeDto) => {
    const response = await api.post<ApiResponse<{ user: User }>>(
      "/auth/employee-accounts",
      data
    );
    return response.data;
  },
};
