// src/store/employee-dashboard.store.ts

import { create } from "zustand";
import { dashboardApi } from "@/lib/api/dashboard.api";
import { EmployeeDashboardStats } from "@/types/employee-dashboard.types";

interface EmployeeDashboardState {
  stats: EmployeeDashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useEmployeeDashboardStore = create<EmployeeDashboardState>(
  (set) => ({
    stats: null,
    isLoading: false,
    error: null,

    fetchStats: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await dashboardApi.getEmployeeStats();
        set({
          stats: response.data,
          isLoading: false,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        set({
          error:
            error.response?.data?.error?.message ||
            "Failed to fetch dashboard stats",
          isLoading: false,
        });
      }
    },
  })
);
