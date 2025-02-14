import axios from "axios";
import { parseCookies } from "../utils/cookie";
import { ApiResponse } from "@/types/api.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const getAuthToken = () => {
  const cookies = parseCookies();
  return cookies["accessToken"];
};

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러(인증 실패)이고 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 시도 (쿠키는 자동으로 전송됨)
        await api.post<ApiResponse<void>>("/auth/refresh");

        // 원래 요청 재시도
        return api(originalRequest);
      } catch (refreshError) {
        // 갱신 실패 시 로그인 페이지로 리다이렉트
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // 에러 응답 형식 통일
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    // 네트워크 에러 등의 경우 기본 에러 형식으로 변환
    return Promise.reject({
      success: false,
      data: null,
      error: {
        code: "NETWORK_ERROR",
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
);
