import { create } from "zustand";
import { dashboardApi } from "@/lib/api/dashboard.api";
import { ManagerDashboardStats } from "@/types/manager-dashboard.types";

interface ManagerDashboardState {
  stats: ManagerDashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useManagerDashboardStore = create<ManagerDashboardState>(
  (set) => ({
    stats: null,
    isLoading: false,
    error: null,

    fetchStats: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await dashboardApi.getManagerStats();
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
