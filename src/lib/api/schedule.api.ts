import { ApiResponse } from "@/types/api.types";
import {
  CreateBulkScheduleDto,
  CreateScheduleDto,
  ReviewRequestDto,
  ReviewResponseDto,
  Schedule,
  ScheduleFilters,
  ScheduleResponse,
  SingleScheduleResponse,
} from "@/types/schedule.types";
import { api } from "./client.api";

export const scheduleApi = {
  getSchedules: async (filters: ScheduleFilters) => {
    const response = await api.get<ApiResponse<ScheduleResponse>>(
      "/schedules",
      {
        params: {
          page: filters.page,
          limit: filters.limit,
          location: filters.location,
          employeeId: filters.employeeId,
          startDate: filters.startDate?.toISOString(),
          endDate: filters.endDate?.toISOString(),
          status: filters.status,
        },
      }
    );
    return response.data;
  },

  getSchedule: async (id: number) => {
    const response = await api.get<ApiResponse<SingleScheduleResponse>>(
      `/schedules/${id}`
    );
    return response.data;
  },

  createSchedule: async (data: CreateScheduleDto) => {
    const response = await api.post<ApiResponse<Schedule>>("/schedules", data);
    return response.data;
  },

  createBulkSchedules: async (data: CreateBulkScheduleDto) => {
    const response = await api.post<ApiResponse<Schedule[]>>(
      "/schedules/bulk",
      data
    );
    return response.data;
  },

  updateSchedule: async (id: number, data: Partial<CreateScheduleDto>) => {
    const response = await api.put<ApiResponse<Schedule>>(
      `/schedules/${id}`,
      data
    );
    return response.data;
  },

  deleteSchedule: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/schedules/${id}`);
    return response.data;
  },

  getLocations: async () => {
    const response = await api.get<ApiResponse<string[]>>(
      "/schedules/locations"
    );
    return response.data;
  },

  requestReview: async (id: number, data: ReviewRequestDto) => {
    const response = await api.post<ApiResponse<Schedule>>(
      `/schedules/${id}/review`,
      data
    );
    return response.data;
  },

  processReview: async (id: number, data: ReviewResponseDto) => {
    const response = await api.put<ApiResponse<Schedule>>(
      `/schedules/${id}/review/process`,
      data
    );
    return response.data;
  },
};
