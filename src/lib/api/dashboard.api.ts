import { apiClient } from "./client.api";
import {
  ManagerDashboardResponse,
  PayPeriodFilters,
} from "@/types/manager-dashboard.types";
import {
  EmployeeDashboardResponse,
  EmployeeNotificationsResponse,
} from "@/types/employee-dashboard.types";
import { createQueryString } from "../utils/api.utils";

const BASE_PATH = "/dashboard";

export const dashboardApi = {
  // 매니저 대시보드 통계
  getManagerStats: async (filters?: PayPeriodFilters) => {
    const queryString = filters ? createQueryString(filters) : "";
    return apiClient.get<ManagerDashboardResponse>(
      `${BASE_PATH}/manager/stats${queryString ? `?${queryString}` : ""}`
    );
  },

  // 직원 대시보드 통계
  getEmployeeStats: async () => {
    return apiClient.get<EmployeeDashboardResponse>(
      `${BASE_PATH}/employee/stats`
    );
  },

  // 직원 알림 조회
  getEmployeeNotifications: async () => {
    return apiClient.get<EmployeeNotificationsResponse>(
      `${BASE_PATH}/employee/notifications`
    );
  },

  // 알림 읽음 처리
  markNotificationAsRead: async (notificationId: number) => {
    return apiClient.put(`${BASE_PATH}/notifications/${notificationId}/read`);
  },

  // 대시보드 데이터 새로고침
  refreshDashboardData: async () => {
    return apiClient.post(`${BASE_PATH}/refresh`);
  },

  // 대시보드 위젯 설정 저장
  saveWidgetSettings: async (settings: {
    layout: Array<{
      id: string;
      position: number;
      visible: boolean;
    }>;
  }) => {
    return apiClient.put(`${BASE_PATH}/widgets/settings`, settings);
  },

  // 대시보드 위젯 설정 조회
  getWidgetSettings: async () => {
    return apiClient.get(`${BASE_PATH}/widgets/settings`);
  },

  // 실시간 알림 설정
  updateNotificationSettings: async (settings: {
    email: boolean;
    push: boolean;
    types: string[];
  }) => {
    return apiClient.put(`${BASE_PATH}/notification-settings`, settings);
  },

  // 실시간 알림 설정 조회
  getNotificationSettings: async () => {
    return apiClient.get(`${BASE_PATH}/notification-settings`);
  },
};
