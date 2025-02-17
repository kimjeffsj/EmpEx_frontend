import { create } from "zustand";
import { payrollApi } from "@/lib/api/payroll.api";
import { APIError } from "@/lib/utils/api.utils";
import {
  PayPeriodResponse,
  PayrollExport,
} from "@/types/features/payroll.types";

interface PayrollState {
  // State
  periods: PayPeriodResponse[];
  selectedPeriod: PayPeriodResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPayPeriods: () => Promise<void>;
  selectPeriod: (periodId: number) => void;
  exportToExcel: (periodId: number) => Promise<void>;
  clearError: () => void;
}

export const usePayrollStore = create<PayrollState>((set, get) => ({
  // Initial State
  periods: [],
  selectedPeriod: null,
  isLoading: false,
  error: null,

  // Actions
  fetchPayPeriods: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await payrollApi.getPayPeriods();

      if (response.success && response.data) {
        set({
          periods: response.data,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to fetch pay periods",
        isLoading: false,
      });
    }
  },

  selectPeriod: (periodId: number) => {
    const period = get().periods.find((p) => p.id === periodId);
    set({ selectedPeriod: period || null });
  },

  exportToExcel: async (periodId: number) => {
    try {
      set({ isLoading: true, error: null });
      const period = get().periods.find((p) => p.id === periodId);

      if (!period) {
        throw new Error("Period not found");
      }

      // 엑셀 데이터 준비
      const exportData: PayrollExport[] = period.payrolls.map((payroll) => ({
        employeeName: `${payroll.employee.firstName} ${payroll.employee.lastName}`,
        employeeId: payroll.employeeId,
        payPeriod: `${period.startDate} - ${period.endDate}`,
        regularHours: Number(payroll.totalRegularHours),
        overtimeHours: Number(payroll.totalOvertimeHours),
        totalHours: Number(payroll.totalHours),
        payRate: Number(payroll.employee.payRate),
        grossPay: payroll.grossPay,
        status: payroll.status,
      }));

      await payrollApi.exportToExcel(periodId);
      set({ isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to export to Excel",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
