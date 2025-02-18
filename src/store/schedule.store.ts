import { create } from "zustand";
import { scheduleApi } from "@/lib/api/schedule.api";
import { APIError } from "@/lib/utils/api.utils";
import {
  CreateBulkScheduleDto,
  ScheduleFilters,
} from "@/types/features/schedule.types";
import { Timesheet } from "@/types/features/timesheet.types";

interface ScheduleState {
  // State
  schedules: Timesheet[];
  locations: string[];
  isLoading: boolean;
  error: string | null;
  filters: ScheduleFilters;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  // Actions
  setFilters: (filters: Partial<ScheduleFilters>) => void;
  resetFilters: () => void;
  fetchSchedules: (filters: ScheduleFilters) => Promise<void>;
  createBulkSchedules: (data: CreateBulkScheduleDto) => Promise<void>;
  deleteSchedule: (id: number) => Promise<void>;
  fetchLocations: () => Promise<void>;
  clearError: () => void;
}

const DEFAULT_FILTERS: ScheduleFilters = {
  page: 1,
  limit: 10,
};

export const useScheduleStore = create<ScheduleState>((set) => ({
  // Initial State
  schedules: [],
  locations: [],
  isLoading: false,
  error: null,
  filters: DEFAULT_FILTERS,
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },

  // API Actions
  fetchSchedules: async (filters: ScheduleFilters) => {
    try {
      set({ isLoading: true, error: null });
      const response = await scheduleApi.getSchedules(filters);

      set({
        schedules: response,
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

  createBulkSchedules: async (data: CreateBulkScheduleDto) => {
    try {
      set({ isLoading: true, error: null });
      const response = await scheduleApi.createBulkSchedules(data);

      if (response.success) {
        // Fetch updated schedules after creation
        const filters = DEFAULT_FILTERS;
        await scheduleApi.getSchedules(filters);
      }
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to create schedules",
        isLoading: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSchedule: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await scheduleApi.deleteSchedule(id);

      if (response.success) {
        // Fetch updated schedules after deletion
        const filters = DEFAULT_FILTERS;
        await scheduleApi.getSchedules(filters);
      }
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

      if (response.success) {
        set({
          locations: response.data,
          isLoading: false,
        });
      }
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

  setFilters: (newFilters) => {
    set((state) => ({
      ...state, // 기존 상태 유지
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set((state) => ({
      ...state, // 기존 상태 유지
      filters: DEFAULT_FILTERS,
    }));
  },

  clearError: () => set({ error: null }),
}));
