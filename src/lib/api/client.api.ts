import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { parseCookies } from "../utils/cookie";
import { ApiResponse } from "@/types/api.types";
import {
  APIError,
  createErrorMessage,
  handleApiError,
} from "../utils/api.utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const getAuthToken = () => {
  const cookies = parseCookies();
  return cookies["accessToken"];
};

// API 클라이언트 설정
const createAPIClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // 요청 인터셉터
  client.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // 401 에러 처리 (인증 실패)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // 토큰 리프레시 시도
          await client.post<ApiResponse<void>>("/auth/refresh");
          return client(originalRequest);
        } catch (refreshError) {
          // 리프레시 실패시 로그인 페이지로 리다이렉트
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }

      // API 에러 응답 처리
      if (error.response?.data) {
        return Promise.reject(new APIError(error.response.data.error));
      }

      // 네트워크 에러 등 기타 에러 처리
      return Promise.reject(new Error(createErrorMessage(error)));
    }
  );

  return client;
};

export const api = createAPIClient();

// API 요청 래퍼 함수들
export const apiClient = {
  async get<T>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await api.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await api.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await api.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await api.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 파일 다운로드용 메서드
  async download(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await api.get(url, {
        ...config,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
