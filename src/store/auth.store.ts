import { api } from "@/lib/api/client.api";
import { ApiResponse } from "@/types/api.types";
import {
  AuthResponse,
  LoginCredentials,
  RefreshTokenResponse,
  User,
} from "@/types/auth.types";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        credentials
      );
      const { accessToken, refreshToken, user } = response.data.data!;

      document.cookie = `accessToken=${accessToken}; path=/; max-age=900`; // 15분
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800`; // 7일

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Redirect based on user role
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || "Failed to login",
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        await api.post<ApiResponse<null>>("/auth/logout", null, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      window.location.href = "/login";
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const response = await api.post<ApiResponse<RefreshTokenResponse>>(
        "/auth/refresh",
        {
          refreshToken,
        }
      );

      const { accessToken, refreshToken: newRefreshToken } =
        response.data.data!;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      return accessToken;
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      window.location.href = "/login";
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
