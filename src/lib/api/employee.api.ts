import { createQueryString } from "../utils/api.utils";
import { apiClient } from "./client.api";
import {
  Employee,
  EmployeeListResponse,
  EmployeeResponse,
  EmployeeFilters,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "@/types/manager-employeeList.types";

const BASE_PATH = "/employees";

export const employeeApi = {
  // 직원 목록 조회
  getEmployees: async (filters: EmployeeFilters) => {
    const queryString = createQueryString(filters);
    return apiClient.get<EmployeeListResponse>(`${BASE_PATH}?${queryString}`);
  },

  // 단일 직원 조회
  getEmployee: async (id: number) => {
    return apiClient.get<EmployeeResponse>(`${BASE_PATH}/${id}`);
  },

  // 직원 생성
  createEmployee: async (data: CreateEmployeeDto) => {
    return apiClient.post<Employee>(BASE_PATH, data);
  },

  // 직원 정보 수정
  updateEmployee: async (id: number, data: UpdateEmployeeDto) => {
    return apiClient.put<Employee>(`${BASE_PATH}/${id}`, data);
  },

  // 직원 삭제 (비활성화)
  deleteEmployee: async (id: number) => {
    return apiClient.delete<void>(`${BASE_PATH}/${id}`);
  },

  // 퇴사 처리
  processResignation: async (id: number, resignationDate: string) => {
    return apiClient.put<Employee>(`${BASE_PATH}/${id}/resign`, {
      resignedDate: resignationDate,
    });
  },

  // 직원 급여 이력 조회
  getPayrollHistory: async (id: number) => {
    return apiClient.get<Employee>(`${BASE_PATH}/${id}/payroll-history`);
  },

  // 직원 문서 업로드
  uploadDocument: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post<{ documentId: number }>(
      `${BASE_PATH}/${id}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  // 직원 검색
  searchEmployees: async (query: string) => {
    return apiClient.get<EmployeeListResponse>(
      `${BASE_PATH}/search?q=${query}`
    );
  },

  // 부서별 직원 통계
  // getDepartmentStats: async () => {
  //   return apiClient.get<Record<string, number>>(
  //     `${BASE_PATH}/department-stats`
  //   );
  // },
};
