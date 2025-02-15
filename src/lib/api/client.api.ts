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

    // If 401 error (authentication failure) and request hasn't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt token refresh (cookies are sent automatically)
        await api.post<ApiResponse<void>>("/auth/refresh");

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login page if refresh fails
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Standardize error response format
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    // Convert to default error format for network errors etc.
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
