import { create } from "zustand";
import { employeeApi } from "@/lib/api/employee.api";
import { APIError } from "@/lib/utils/api.utils";
import {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
} from "@/types/features/employee.types";
import { BaseFilter } from "@/types/common/base.types";

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
  filters: BaseFilter;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  fetchEmployees: () => Promise<void>;
  fetchEmployee: (id: number) => Promise<void>;
  createEmployee: (data: CreateEmployeeDto) => Promise<void>;
  updateEmployee: (id: number, data: UpdateEmployeeDto) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
  setFilters: (filters: Partial<BaseFilter>) => void;
  resetFilters: () => void;
  clearError: () => void;
}

const DEFAULT_FILTERS: BaseFilter = {
  page: 1,
  limit: 10,
};

const DEFAULT_META = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
  filters: DEFAULT_FILTERS,
  meta: DEFAULT_META,

  fetchEmployees: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await employeeApi.getEmployees(get().filters);

      if (response.success && response.data) {
        set({
          employees: response.data,
          meta: response.meta || DEFAULT_META,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to fetch employees",
        isLoading: false,
      });
    }
  },

  fetchEmployee: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await employeeApi.getEmployee(id);

      if (response.success && response.data) {
        set({ selectedEmployee: response.data });
      }
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to fetch employee",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createEmployee: async (data: CreateEmployeeDto) => {
    try {
      set({ isLoading: true, error: null });
      await employeeApi.createEmployee(data);
      await get().fetchEmployees();
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to create employee",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateEmployee: async (id: number, data: UpdateEmployeeDto) => {
    try {
      set({ isLoading: true, error: null });
      await employeeApi.updateEmployee(id, data);
      await get().fetchEmployees();
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to update employee",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteEmployee: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await employeeApi.deleteEmployee(id);
      await get().fetchEmployees();
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to delete employee",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchEmployees();
  },

  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS });
    get().fetchEmployees();
  },

  clearError: () => set({ error: null }),
}));
