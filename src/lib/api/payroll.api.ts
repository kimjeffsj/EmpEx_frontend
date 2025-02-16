import {
  PayPeriodListResponse,
  PayrollFilters,
  PayrollResponse,
  TimesheetEntry,
  TimesheetListResponse,
  TimesheetUpdateDto,
} from "@/types/\bpayroll.types";
import { apiClient } from "./client.api";
import { createQueryString } from "../utils/api.utils";

const BASE_PATH = "/payrolls";

export const payrollApi = {
  // 급여 기간 목록 조회
  getPayPeriods: async (filters?: PayrollFilters) => {
    const queryString = filters ? createQueryString(filters) : "";
    return apiClient.get<PayPeriodListResponse>(
      `${BASE_PATH}/periods${queryString ? `?${queryString}` : ""}`
    );
  },

  // 급여 기간 상세 조회
  getPayPeriodDetail: async (periodId: number) => {
    return apiClient.get<PayrollResponse>(`${BASE_PATH}/periods/${periodId}`);
  },

  // 타임시트 수정
  updateTimesheet: async (timesheetId: number, data: TimesheetUpdateDto) => {
    return apiClient.put<TimesheetEntry>(`/timesheets/${timesheetId}`, data);
  },

  // 엑셀 내보내기
  exportToExcel: async (periodId: number) => {
    return apiClient.download(`${BASE_PATH}/periods/${periodId}/excel`);
  },

  // 급여 기간 완료 처리
  completePeriod: async (periodId: number) => {
    return apiClient.post<void>(`${BASE_PATH}/periods/${periodId}/complete`);
  },

  // 직원 타임시트 조회
  getEmployeeTimesheets: async (employeeId: number, periodId: number) => {
    return apiClient.get<TimesheetListResponse>(
      `/employees/${employeeId}/timesheets?periodId=${periodId}`
    );
  },

  // 급여 명세서 생성
  generatePaystubs: async (periodId: number) => {
    return apiClient.post<void>(
      `${BASE_PATH}/periods/${periodId}/paystubs/generate`
    );
  },

  // 급여 명세서 이메일 발송
  sendPaystubEmails: async (periodId: number) => {
    return apiClient.post<void>(
      `${BASE_PATH}/periods/${periodId}/paystubs/send`
    );
  },

  // 연말정산 보고서 생성
  generateT4Report: async (year: number) => {
    return apiClient.get(`${BASE_PATH}/reports/t4/${year}`, {
      responseType: "blob",
    });
  },

  // 급여 조정
  adjustPayroll: async (
    periodId: number,
    adjustments: Array<{
      employeeId: number;
      amount: number;
      reason: string;
    }>
  ) => {
    return apiClient.post(
      `${BASE_PATH}/periods/${periodId}/adjustments`,
      adjustments
    );
  },

  // 급여 통계 조회
  getPayrollStats: async (startDate: string, endDate: string) => {
    return apiClient.get(
      `${BASE_PATH}/stats?startDate=${startDate}&endDate=${endDate}`
    );
  },

  // 급여 이력 조회
  getPayrollHistory: async (employeeId: number, year: number) => {
    return apiClient.get(`${BASE_PATH}/history/${employeeId}?year=${year}`);
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
    return apiClient.post(`${BASE_PATH}/periods`, data);
  },

  // 급여 계산 테스트
  calculatePayrollPreview: async (periodId: number) => {
    return apiClient.get(`${BASE_PATH}/periods/${periodId}/preview`);
  },
};
