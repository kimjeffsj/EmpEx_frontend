import { ApiResponse } from "@/types/api.types";
import { api } from "./client.api";
import {
  PayPeriod,
  PayrollFilters,
  PayrollResponse,
  TimesheetEntry,
  TimesheetUpdateDto,
} from "@/types/\bpayroll.types";

export const payrollApi = {
  // Get pay periods list
  getPayPeriods: async (filters?: PayrollFilters) => {
    const response = await api.get<ApiResponse<PayPeriod[]>>(
      "/payrolls/periods",
      {
        params: filters,
      }
    );
    return response.data;
  },

  // Get pay period detail with timesheets
  getPayPeriodDetail: async (periodId: number) => {
    const response = await api.get<ApiResponse<PayrollResponse>>(
      `/payrolls/periods/${periodId}`
    );
    return response.data;
  },

  // Update timesheet entry
  updateTimesheet: async (timesheetId: number, data: TimesheetUpdateDto) => {
    const response = await api.put<ApiResponse<TimesheetEntry>>(
      `/timesheets/${timesheetId}`,
      data
    );
    return response.data;
  },

  // Export to Excel
  exportToExcel: async (periodId: number) => {
    const response = await api.get(`/payrolls/periods/${periodId}/excel`, {
      responseType: "blob",
    });
    return response.data;
  },

  // Complete pay period
  completePeriod: async (periodId: number) => {
    const response = await api.post<ApiResponse<void>>(
      `/payrolls/periods/${periodId}/complete`
    );
    return response.data;
  },

  // Get employee timesheets
  getEmployeeTimesheets: async (employeeId: number, periodId: number) => {
    const response = await api.get<ApiResponse<TimesheetEntry[]>>(
      `/employees/${employeeId}/timesheets`,
      {
        params: { periodId },
      }
    );
    return response.data;
  },
};
