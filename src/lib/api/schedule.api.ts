import { createQueryString } from "../utils/api.utils";
import { apiClient } from "./client.api";
import {
  CreateBulkScheduleDto,
  Schedule,
  ScheduleFilters,
} from "@/types/features/schedule.types";
import { ApiResponse } from "@/types/common/api.types";

const BASE_PATH = "/schedules";

const locationList = ["No 3", "West Minster"];

export const scheduleApi = {
  // 일정 목록 조회
  getSchedules: async (filters: ScheduleFilters) => {
    const queryString = createQueryString(filters);
    return apiClient.get<ApiResponse<Schedule[]>>(
      `${BASE_PATH}?${queryString}`
    );
  },

  getEmployeeSchedules: async (
    employeeId: number,
    startDate: string,
    endDate: string
  ) => {
    return apiClient.get<ApiResponse<Schedule[]>>(
      `${BASE_PATH}/employee/${employeeId}?startDate=${startDate}&endDate=${endDate}`
    );
  },

  // 다수 스케줄 생성
  createBulkSchedules: async (data: CreateBulkScheduleDto) => {
    return apiClient.post<ApiResponse<Schedule[]>>(`${BASE_PATH}/bulk`, data);
  },

  // 근무 장소 목록 조회 (하드코딩된 기본값 제공)
  getLocations: async () => {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(
        `${BASE_PATH}/locations`
      );
      return response;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // API 호출 실패시 기본 장소 목록 반환
      return {
        success: true,
        data: locationList,
        timestamp: new Date().toISOString(),
      };
    }
  },
};
