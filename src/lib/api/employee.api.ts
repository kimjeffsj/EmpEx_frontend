import { ApiResponse } from "@/types/api.types";
import {
  Employee,
  EmployeeListResponse,
} from "@/types/manager-employeeList.types";
import { api } from "./client.api";

export interface EmployeeFilters {
  search?: string;
  isResigned?: boolean;
  page?: number;
  limit?: number;
  sortBy?: keyof Employee;
  sortOrder?: "ASC" | "DESC";
}

export const employeeApi = {
  // Get employee list
  getEmployees: async (filters: EmployeeFilters) => {
    const response = await api.get<ApiResponse<EmployeeListResponse>>(
      "/employees",
      {
        params: filters,
      }
    );
    return response.data;
  },

  // Get single employee
  getEmployee: async (id: number) => {
    const response = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
    return response.data;
  },

  // Create employee
  createEmployee: async (
    data: Omit<Employee, "id" | "createdAt" | "updatedAt">
  ) => {
    const response = await api.post<ApiResponse<Employee>>("/employees", data);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id: number, data: Partial<Employee>) => {
    const response = await api.put<ApiResponse<Employee>>(
      `/employees/${id}`,
      data
    );
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/employees/${id}`);
    return response.data;
  },
};
