/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { scheduleApi } from "@/lib/api/schedule.api";
import {
  Schedule,
  ScheduleFilters,
  CreateScheduleDto,
  CreateBulkScheduleDto,
  ReviewRequestDto,
  ReviewResponseDto,
} from "@/types/schedule.types";

interface ScheduleState {
  // State
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  locations: string[];
  filters: ScheduleFilters;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  // Actions
  setFilters: (filters: Partial<ScheduleFilters>) => void;
  resetFilters: () => void;

  // API Actions
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

  // Error Handling
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
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,

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
      if (!response.data) {
        throw new Error("Schedule not found");
      }
      set({
        schedules: response.data.data,
        total: response.data.meta.total,
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        totalPages: response.data.meta.totalPages,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.error?.message || "Failed to fetch schedules",
        isLoading: false,
      });
    }
  },

  fetchSchedule: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await scheduleApi.getSchedule(id);
      if (!response.data) {
        throw new Error("Schedule not found");
      }
      set({
        selectedSchedule: response.data.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.error?.message || "Failed to fetch schedule",
        isLoading: false,
      });
    }
  },

  createSchedule: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await scheduleApi.createSchedule(data);
      get().fetchSchedules();
    } catch (error: any) {
      set({
        error: error.error?.message || "Failed to create schedule",
        isLoading: false,
      });
    }
  },

  createBulkSchedules: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await scheduleApi.createBulkSchedules(data);
      get().fetchSchedules();
    } catch (error: any) {
      set({
        error: error.error?.message || "Failed to create bulk schedules",
        isLoading: false,
      });
    }
  },

  updateSchedule: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      await scheduleApi.updateSchedule(id, data);
      get().fetchSchedules();
    } catch (error: any) {
      set({
        error: error.error?.message || "Failed to update schedule",
        isLoading: false,
      });
    }
  },

  deleteSchedule: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await scheduleApi.deleteSchedule(id);
      get().fetchSchedules();
    } catch (error: any) {
      set({
        error: error.error?.message || "Failed to delete schedule",
        isLoading: false,
      });
    }
  },

  fetchLocations: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await scheduleApi.getLocations();

      if (!response.data) {
        throw new Error("Locations not found");
      }

      set({
        locations: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.error?.message || "Failed to fetch locations",
        isLoading: false,
      });
    }
  },

  requestReview: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      await scheduleApi.requestReview(id, data);
      get().fetchSchedules();
    } catch (error: any) {
      set({
        error: error.error?.message || "Failed to request review",
        isLoading: false,
      });
    }
  },

  processReview: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      await scheduleApi.processReview(id, data);
      get().fetchSchedules();
    } catch (error: any) {
      set({
        error: error.error?.message || "Failed to process review",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
