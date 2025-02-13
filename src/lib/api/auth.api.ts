import { ApiResponse } from "@/types/api.types";
import {
  AuthResponse,
  LoginCredentials,
  RefreshTokenResponse,
  User,
} from "@/types/auth.types";
import { api } from "./client.api";

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  // Refresh Token
  refreshToken: async (refreshToken: string) => {
    const response = await api.post<ApiResponse<RefreshTokenResponse>>(
      "/auth/refresh",
      {
        refreshToken,
      }
    );
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post<ApiResponse<void>>("/auth/logout");
    return response.data;
  },

  // Get Current User Information
  getCurrentUser: async () => {
    try {
      const response = await api.get<ApiResponse<User>>("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },
};
