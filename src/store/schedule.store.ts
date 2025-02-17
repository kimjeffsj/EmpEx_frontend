import { create } from "zustand";
import { scheduleApi } from "@/lib/api/schedule.api";
import {
  Schedule,
  ScheduleFilters,
  CreateScheduleDto,
  CreateBulkScheduleDto,
  ReviewRequestDto,
  ReviewResponseDto,
  WeeklyScheduleParams,
  MonthlyScheduleParams,
} from "@/types/schedule.types";
import { APIError } from "@/lib/utils/api.utils";

interface ScheduleState {
  // State
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  locations: string[];
  filters: ScheduleFilters;
  isLoading: boolean;
  error: string | null;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  // Actions
  setFilters: (filters: Partial<ScheduleFilters>) => void;
  resetFilters: () => void;
  fetchSchedules: () => Promise<void>;
  fetchSchedule: (id: number) => Promise<void>;
  createSchedule: (data: CreateScheduleDto) => Promise<void>;
  createBulkSchedules: (data: CreateBulkScheduleDto) => Promise<void>;
  updateSchedule: (
    id: number,
    data: Partial<CreateScheduleDto>
  ) => Promise<void>;
  deleteSchedule: (id: number) => Promise<void>;
  fetchLocations: () => Promise<void>;
  requestReview: (id: number, data: ReviewRequestDto) => Promise<void>;
  processReview: (id: number, data: ReviewResponseDto) => Promise<void>;
  getWeeklySchedule: (params: WeeklyScheduleParams) => Promise<void>;
  getMonthlySchedule: (params: MonthlyScheduleParams) => Promise<void>;
  clearError: () => void;
}

const DEFAULT_FILTERS: ScheduleFilters = {
  page: 1,
  limit: 10,
};

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  // Initial State
  schedules: [],
  selectedSchedule: null,
  locations: [],
  filters: DEFAULT_FILTERS,
  isLoading: false,
  error: null,
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },

  // Filter Actions
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchSchedules();
  },

  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS });
    get().fetchSchedules();
  },

  // API Actions
  fetchSchedules: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await scheduleApi.getSchedules(get().filters);

      set({
        schedules: response.data.data,
        meta: response.data.meta,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to fetch schedules",
        isLoading: false,
      });
    }
  },

  fetchSchedule: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await scheduleApi.getSchedule(id);

      set({
        selectedSchedule: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to fetch schedule",
        isLoading: false,
      });
    }
  },

  createSchedule: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await scheduleApi.createSchedule(data);
      await get().fetchSchedules();
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to create schedule",
        isLoading: false,
      });
    }
  },

  createBulkSchedules: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await scheduleApi.createBulkSchedules(data);
      await get().fetchSchedules();
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to create bulk schedules",
        isLoading: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSchedule: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      await scheduleApi.updateSchedule(id, data);
      await get().fetchSchedules();
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to update schedule",
        isLoading: false,
      });
    }
  },

  deleteSchedule: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await scheduleApi.deleteSchedule(id);
      await get().fetchSchedules();
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to delete schedule",
        isLoading: false,
      });
    }
  },

  fetchLocations: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await scheduleApi.getLocations();

      set({
        locations: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to fetch locations",
        isLoading: false,
      });
    }
  },

  requestReview: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      await scheduleApi.requestReview(id, data);
      await get().fetchSchedules();
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to request review",
        isLoading: false,
      });
    }
  },

  processReview: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      await scheduleApi.processReview(id, data);
      await get().fetchSchedules();
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to process review",
        isLoading: false,
      });
    }
  },

  getWeeklySchedule: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await scheduleApi.getWeeklySchedule(params);
      set({
        schedules: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to fetch weekly schedule",
        isLoading: false,
      });
    }
  },

  getMonthlySchedule: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await scheduleApi.getMonthlySchedule(params);
      set({
        schedules: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to fetch monthly schedule",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
