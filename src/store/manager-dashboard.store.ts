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
  (set, get) => ({
    stats: null,
    isLoading: false,
    error: null,

    fetchStats: async () => {
      if (get().isLoading) return;

      set({ isLoading: true, error: null });
      try {
        console.log("Fetching stats..."); // 디버깅용

        const response = await dashboardApi.getManagerStats();

        console.log("Received stats:", response); // 디버깅용

        set({
          stats: response.data.data,
          isLoading: false,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error fetching stats:", error); // 디버깅용

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
