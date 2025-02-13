import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/lib/api/auth.api";
import { LoginCredentials, User } from "@/types/auth.types";
import { getAuthToken } from "@/lib/api/client.api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initializeAuth: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<string>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initializeAuth: async () => {
        try {
          set({ isLoading: true });

          // 1. 현재 토큰 체크
          const token = getAuthToken();
          if (!token) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return;
          }

          // 2. 사용자 정보 가져오기
          const response = await authApi.getCurrentUser();
          if (response?.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          const { user } = response.data!;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

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
        try {
          set({ isLoading: true });

          document.cookie = "logging_out=true; path=/; max-age=5";

          // Call logout API
          await authApi.logout();

          // Clear local storage
          localStorage.removeItem("auth-storage");

          // Reset state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Logout error:", error);
          // Even if API call fails, clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshToken: async () => {
        try {
          const cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = value;
            return acc;
          }, {} as Record<string, string>);

          const refreshToken = cookies["refreshToken"];
          if (!refreshToken) throw new Error("No refresh token");

          const response = await authApi.refreshToken(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } = response.data!;

          document.cookie = `accessToken=${accessToken}; path=/; max-age=900`;
          document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=604800`;

          return accessToken;
        } catch (error) {
          // Clear cookies and state on refresh token failure
          document.cookie =
            "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie =
            "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

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
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
