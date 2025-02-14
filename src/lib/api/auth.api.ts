import { ApiResponse } from "@/types/api.types";
import {
  CreateEmployeeAccountDto,
  LoginCredentials,
  UpdateUserDto,
  UserResponse,
} from "@/types/auth.types";
import { api } from "./client.api";

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<{ user: UserResponse }>>(
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
      const response = await api.get<ApiResponse<{ user: UserResponse }>>(
        "/auth/me"
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  },

  updateUser: async (userId: number, data: UpdateUserDto) => {
    const response = await api.put<ApiResponse<{ user: UserResponse }>>(
      `/auth/users/${userId}`,
      data
    );
    return response.data;
  },

  createEmployeeAccount: async (data: CreateEmployeeAccountDto) => {
    const response = await api.post<ApiResponse<{ user: UserResponse }>>(
      "/auth/employee-accounts",
      data
    );
    return response.data;
  },
};
