import { ManagerDashboardStats } from "@/types/manager-dashboard.types";
import { api } from "./client.api";
import { ApiResponse } from "@/types/api.types";
import { EmployeeDashboardStats } from "@/types/employee-dashboard.types";

export const dashboardApi = {
  // Manager Dashboard Stats
  getManagerStats: async () => {
    const response = await api.get<ApiResponse<ManagerDashboardStats>>(
      "/dashboard/manager/stats"
    );
    return response.data;
  },

  // Employee Dashboard Stats
  getEmployeeStats: async () => {
    const response = await api.get<ApiResponse<EmployeeDashboardStats>>(
      "/dashboard/employee/stats"
    );
    return response.data;
  },
};
