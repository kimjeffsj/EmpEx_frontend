import { persist } from "zustand/middleware";
import { create } from "zustand";

import { authApi } from "@/lib/api/auth.api";
import {
  LoginCredentials,
  UpdateUserDto,
  UserResponse,
} from "@/types/auth.types";

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  initializeAuth: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userId: number, data: UpdateUserDto) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initializeAuth: async () => {
        try {
          // Skip if already authenticated
          if (get().isAuthenticated && get().user) {
            return;
          }

          set({ isLoading: true });
          const response = await authApi.getCurrentUser();

          if (response?.success && response.data?.user) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
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

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);

          if (response.success && response.data?.user) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }

          throw new Error("Login failed");
        } catch (error: any) {
          set({
            error: error.error?.message || "Failed to login",
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          return false;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          const response = await authApi.logout();

          if (response.success) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      updateUser: async (userId: number, data: UpdateUserDto) => {
        const currentUser = get().user;
        if (!currentUser) return false;

        try {
          set({ isLoading: true, error: null });
          const response = await authApi.updateUser(userId, data);

          if (response.success && response.data?.user) {
            set({
              user: response.data.user,
              isLoading: false,
            });
            return true;
          }
          return false;
        } catch (error: any) {
          set({
            error: error.error?.message || "Failed to update user",
            isLoading: false,
          });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      // Only store user and isAuthenticated
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
