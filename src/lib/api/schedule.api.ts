import { BaseFilter } from "@/types/common/base.types";
import { createQueryString } from "../utils/api.utils";
import { apiClient } from "./client.api";
import { Schedule } from "@/types/features/schedule.types";
import { ApiResponse } from "@/types/common/api.types";

const BASE_PATH = "/schedules";

export const scheduleApi = {
  // 일정 목록 조회
  getSchedules: async (filters: BaseFilter) => {
    const queryString = createQueryString(filters);
    const response = await apiClient.get<ApiResponse<Schedule[]>>(
      `${BASE_PATH}?${queryString}`
    );
    return response.data.data;
  },

  // 단일 일정 조회
  getSchedule: async (id: number) => {
    return apiClient.get<SingleScheduleResponse>(`${BASE_PATH}/${id}`);
  },

  // 일정 생성
  createSchedule: async (data: CreateScheduleDto) => {
    return apiClient.post<Schedule>(BASE_PATH, data);
  },

  // 여러 일정 생성
  createBulkSchedules: async (data: CreateBulkScheduleDto) => {
    return apiClient.post<Schedule[]>(`${BASE_PATH}/bulk`, data);
  },

  // 일정 수정
  updateSchedule: async (id: number, data: Partial<CreateScheduleDto>) => {
    return apiClient.put<Schedule>(`${BASE_PATH}/${id}`, data);
  },

  // 일정 삭제
  deleteSchedule: async (id: number) => {
    return apiClient.delete<void>(`${BASE_PATH}/${id}`);
  },

  // 근무 장소 목록 조회
  getLocations: async () => {
    return apiClient.get<string[]>(`${BASE_PATH}/locations`);
  },

  // 리뷰 요청
  requestReview: async (id: number, data: ReviewRequestDto) => {
    return apiClient.post<Schedule>(`${BASE_PATH}/${id}/review`, data);
  },

  // 리뷰 처리
  processReview: async (id: number, data: ReviewResponseDto) => {
    return apiClient.put<Schedule>(`${BASE_PATH}/${id}/review/process`, data);
  },

  // 주간 일정 조회
  getWeeklySchedule: async (params: WeeklyScheduleParams) => {
    const response = await apiClient.get<ScheduleListResponse>(
      `${BASE_PATH}/weekly?year=${params.year}&week=${params.week}`
    );
    return response.data.data;
  },

  // 월간 일정 조회
  getMonthlySchedule: async (params: MonthlyScheduleParams) => {
    const response = await apiClient.get<ScheduleListResponse>(
      `${BASE_PATH}/monthly?year=${params.year}&month=${params.month}`
    );
    return response.data.data;
  },

  // 직원별 일정 조회
  getEmployeeSchedules: async (
    employeeId: number,
    startDate: string,
    endDate: string
  ) => {
    return apiClient.get<ScheduleListResponse>(
      `${BASE_PATH}/employee/${employeeId}?startDate=${startDate}&endDate=${endDate}`
    );
  },

  // 휴일 일정 관리
  setHoliday: async (
    id: number,
    holidayData: { isHoliday: boolean; holidayName?: string }
  ) => {
    return apiClient.put<Schedule>(`${BASE_PATH}/${id}/holiday`, holidayData);
  },
};
