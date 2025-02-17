import { apiClient } from "./client.api";

import { createQueryString } from "../utils/api.utils";
import { BaseFilter } from "@/types/common/base.types";
import { ManagerDashboardStats } from "@/types/dashboard/manager.types";
import { EmployeeDashboardStats } from "@/types/dashboard/employee.types";

const BASE_PATH = "/dashboard";

export const dashboardApi = {
  // 매니저 대시보드 통계
  getManagerStats: async (filters?: BaseFilter) => {
    const queryString = filters ? createQueryString(filters) : "";
    return apiClient.get<ManagerDashboardStats>(
      `${BASE_PATH}/manager/stats${queryString ? `?${queryString}` : ""}`
    );
  },

  // 직원 대시보드 통계
  getEmployeeStats: async () => {
    return apiClient.get<EmployeeDashboardStats>(`${BASE_PATH}/employee/stats`);
  },
};
