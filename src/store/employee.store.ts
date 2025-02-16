import { create } from "zustand";
import { employeeApi } from "@/lib/api/employee.api";
import {
  Employee,
  EmployeeFilters,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeListResponse,
} from "@/types/manager-employeeList.types";
import { APIError } from "@/lib/utils/api.utils";

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  filters: EmployeeFilters;

  // Actions
  fetchEmployees: () => Promise<void>;
  fetchEmployee: (id: number) => Promise<void>;
  createEmployee: (data: CreateEmployeeDto) => Promise<void>;
  updateEmployee: (id: number, data: UpdateEmployeeDto) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
  setFilters: (filters: Partial<EmployeeFilters>) => void;
  resetFilters: () => void;
  clearError: () => void;
}

const DEFAULT_FILTERS: EmployeeListResponse = {
  page: 1,
  limit: 10,
  isResigned: false,
};

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  filters: DEFAULT_FILTERS,

  fetchEmployees: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await employeeApi.getEmployees(get().filters);

      if (response.success && response.data) {
        set({
          employees: response.data.data,
          total: response.data.meta.total,
          page: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof APIError
            ? error.message
            : "Failed to fetch employees",
      });
    } finally {
      set({ isLoading: false });
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
