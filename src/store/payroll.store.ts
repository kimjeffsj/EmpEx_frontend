import { create } from "zustand";
import { payrollApi } from "@/lib/api/payroll.api";
import {
  PayPeriod,
  PayPeriodDetail,
  PayrollSummary,
  TimesheetUpdateDto,
} from "@/types/payroll.types";

interface PayrollState {
  // State
  periods: PayPeriod[];
  currentPeriod: PayPeriodDetail | null;
  summary: PayrollSummary | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPayPeriods: () => Promise<void>;
  fetchPeriodDetail: (periodId: number) => Promise<void>;
  updateTimesheet: (
    timesheetId: number,
    data: TimesheetUpdateDto
  ) => Promise<void>;
  exportToExcel: (periodId: number) => Promise<void>;
  completePeriod: (periodId: number) => Promise<void>;
  clearError: () => void;
}

export const usePayrollStore = create<PayrollState>((set, get) => ({
  // Initial state
  periods: [],
  currentPeriod: null,
  summary: null,
  isLoading: false,
  error: null,

  // Actions
  fetchPayPeriods: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await payrollApi.getPayPeriods();
      // if (response.success) {
      //   set({ periods: response.data || [] });
      // }

      set({
        periods: response.success ? response.data || [] : [],
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch pay periods" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPeriodDetail: async (periodId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await payrollApi.getPayPeriodDetail(periodId);
      if (response.success && response.data) {
        set({
          currentPeriod: response.data.data.period,
          summary: response.data.data.summary,
        });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch period detail" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTimesheet: async (timesheetId: number, data: TimesheetUpdateDto) => {
    const currentPeriod = get().currentPeriod;

    try {
      set({ isLoading: true, error: null });
      const response = await payrollApi.updateTimesheet(timesheetId, data);

      if (response.success && currentPeriod?.id) {
        // Refresh current period data
        await get().fetchPeriodDetail(currentPeriod.id);
      } else if (response.success) {
        // If we don't have a current period, refresh the periods list
        await get().fetchPayPeriods();
      }
    } catch (error: any) {
      set({
        error: error.message || "Failed to update timesheet",
        isLoading: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  exportToExcel: async (periodId: number) => {
    try {
      set({ isLoading: true, error: null });
      const blob = await payrollApi.exportToExcel(periodId);
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payroll-period-${periodId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      set({ error: error.message || "Failed to export to Excel" });
    } finally {
      set({ isLoading: false });
    }
  },

  completePeriod: async (periodId: number) => {
    try {
      set({ isLoading: true, error: null });
      await payrollApi.completePeriod(periodId);
      await get().fetchPayPeriods();
      if (get().currentPeriod?.id === periodId) {
        await get().fetchPeriodDetail(periodId);
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to complete period" });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
