import { getDashboardStats } from "@/lib/api/dashboard.api";
import { create } from "zustand";

interface DashboardState {
  stats: {
    totalEmployees: number;
    newHires: number;
    resignations: number;
    pendingPayroll: number;
    currentPeriod: {
      startDate: string;
      endDate: string;
      status: string;
      submittedTimesheets: number;
      totalEmployees: number;
      totalHours: number;
      overtimeHours: number;
    };
  } | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,
  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const stats = await getDashboardStats();
      set({ stats, isLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch dashboard stats",
        isLoading: false,
      });
    }
  },
}));
