import { apiClient } from "./client.api";
import { createQueryString } from "../utils/api.utils";
import { PayPeriodResponse } from "@/types/features/payroll.types";
import { TimesheetFilter } from "@/types/features/timesheet.types";
import { ApiResponse } from "@/types/common/api.types";

const BASE_PATH = "/payrolls";

export const payrollApi = {
  // 급여 기간 목록 조회
  getPayPeriods: async (filters?: TimesheetFilter) => {
    const queryString = filters ? createQueryString(filters) : "";
    return apiClient.get<PayPeriodResponse[]>(
      `${BASE_PATH}/periods${queryString ? `?${queryString}` : ""}`
    );
  },

  // 급여 기간 상세 조회
  getPayPeriodDetail: async (periodId: number) => {
    return apiClient.get<PayPeriodResponse>(`${BASE_PATH}/periods/${periodId}`);
  },

  // 급여 기간 완료 처리
  completePeriod: async (periodId: number) => {
    return apiClient.post<ApiResponse<void>>(
      `${BASE_PATH}/periods/${periodId}/complete`
    );
  },

  // 엑셀 내보내기
  exportToExcel: async (periodId: number) => {
    return apiClient.download(`${BASE_PATH}/periods/${periodId}/excel`);
  },

  // 급여 명세서 생성
  generatePaystubs: async (periodId: number) => {
    return apiClient.post<ApiResponse<void>>(
      `${BASE_PATH}/periods/${periodId}/paystubs/generate`
    );
  },

  // 급여 명세서 이메일 발송
  sendPaystubEmails: async (periodId: number) => {
    return apiClient.post<ApiResponse<void>>(
      `${BASE_PATH}/periods/${periodId}/paystubs/send`
    );
  },

  // 연말정산 보고서 생성
  generateT4Report: async (year: number) => {
    return apiClient.get(`${BASE_PATH}/reports/t4/${year}`, {
      responseType: "blob",
    });
  },

  // 신규/퇴사자 보고서
  getEmployeeChangeReport: async (startDate: string, endDate: string) => {
    return apiClient.get(
      `${BASE_PATH}/reports/employee-changes?startDate=${startDate}&endDate=${endDate}`,
      { responseType: "blob" }
    );
  },

  // 급여 기간 생성
  createPayPeriod: async (data: {
    startDate: string;
    endDate: string;
    periodType: "FIRST_HALF" | "SECOND_HALF";
  }) => {
    return apiClient.post<ApiResponse<PayPeriodResponse>>(
      `${BASE_PATH}/periods`,
      data
    );
  },
};
