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

        // 백엔드 응답을 프론트엔드로 변환
        const formattedResponse: ManagerDashboardStats = {
          employee: {
            totalEmployees: 
          }
        }

        console.log("Received stats:", stats); // 디버깅용

        set({
          stats,
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
