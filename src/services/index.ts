import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../utils/keys";
import { API_CONFIG } from "./config";
import { ApiResponse } from "../types";
import { refreshToken } from "./api/authApi";

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor to handle token refresh
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshTokenValue = await AsyncStorage.getItem(
              STORAGE_KEYS.REFRESH_TOKEN,
            );
            if (refreshTokenValue) {
              const response = await refreshToken(refreshTokenValue);
              if (response.data && response.data.access_token) {
                const token = response.data.access_token;
                await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.instance(originalRequest);
              }
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            await this.clearTokens();
            // Token refresh failed, redirecting to login
            // Dispatch a logout action
            console.error("Error refreshing token:", refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.instance.get(
        url,
        config,
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.instance.post(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.instance.put(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.instance.patch(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> =
        await this.instance.delete(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse<any> {
    if (error.response) {
      // Server responded with error status
      return {
        status: error.response.status || 500,
        message: error.response.data?.message || "Server error occurred",
      };
    } else if (error.request) {
      // Network error
      return {
        status: 0,
        message:
          String(error) || "Network error. Please check your connection.",
      };
    } else {
      // Other error
      return {
        status: 0,
        message: String(error.message) || "An unexpected error occurred",
      };
    }
  }

  // Upload file method for images
  async uploadFile<T>(
    url: string,
    file: FormData,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.instance.post(
        url,
        file,
        {
          ...config,
          headers: {
            ...config?.headers,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
