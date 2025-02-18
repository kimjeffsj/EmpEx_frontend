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
      const queryString = createQueryString({
        ...filters,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
      });

      // 응답 확인을 위한 로그 추가
      console.log("Calling getSchedules API...");
      const response = await apiClient.get<Timesheet[]>(
        `${BASE_PATH}?${queryString}`
      );

      // 올바른 데이터만 반환
      return response.data;
    } catch (error) {
      throw error; // Let the error handler in the store handle this
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
      return {
        success: true,
        data: ["No 3", "West Minster"],
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
