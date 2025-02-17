import { createQueryString } from "../utils/api.utils";
import { apiClient } from "./client.api";
import {
  CreateBulkScheduleDto,
  ScheduleFilters,
} from "@/types/features/schedule.types";
import { ApiResponse } from "@/types/common/api.types";
import { Timesheet } from "@/types/features/timesheet.types";

const BASE_PATH = "/schedules";

export const scheduleApi = {
  // 일정 목록 조회
  getSchedules: async (filters: ScheduleFilters) => {
    try {
      const queryString = createQueryString(filters);
      return await apiClient.get<ApiResponse<Timesheet[]>>(
        `${BASE_PATH}?${queryString}`
      );
    } catch (error) {
      // 에러가 ApiResponse 형태인 경우
      if (error && typeof error === "object" && "data" in error) {
        throw error;
      }
      // 기타 에러의 경우 기본 에러 응답 생성
      throw {
        success: false,
        data: null,
        error: {
          code: "SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        },
      };
    }
  },

  // 다수 스케줄 생성
  createBulkSchedules: async (data: CreateBulkScheduleDto) => {
    try {
      return await apiClient.post<ApiResponse<Timesheet[]>>(
        `${BASE_PATH}/bulk`,
        data
      );
    } catch (error) {
      if (error && typeof error === "object" && "data" in error) {
        throw error;
      }
      throw {
        success: false,
        data: null,
        error: {
          code: "SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to create schedules",
        },
      };
    }
  },

  // 근무 장소 목록 조회
  getLocations: async () => {
    try {
      return await apiClient.get<ApiResponse<string[]>>(
        `${BASE_PATH}/locations`
      );
    } catch (error) {
      return {
        success: true,
        data: ["No 3", "West Minster"],
        timestamp: new Date().toISOString(),
      };
    }
  },

  // 스케줄 삭제
  deleteSchedule: async (id: number) => {
    try {
      return await apiClient.delete<ApiResponse<void>>(`${BASE_PATH}/${id}`);
    } catch (error) {
      if (error && typeof error === "object" && "data" in error) {
        throw error;
      }
      throw {
        success: false,
        data: null,
        error: {
          code: "SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete schedule",
        },
      };
    }
  },
};
