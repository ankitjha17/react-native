import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config/env";
import type { ApiResponse, RequestConfig } from "./types";

const SESSION_KEY = "@insurup_session";
const TOKEN_KEY = "@insurup_access_token";
const REFRESH_TOKEN_KEY = "@insurup_refresh_token";

/**
 * Custom API Error class
 * Note: Using Object.setPrototypeOf to ensure proper Error inheritance in React Native
 */
export class ApiException extends Error {
  statusCode?: number;
  code?: string;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiException";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;

    // Fix for React Native - ensure proper prototype chain
    Object.setPrototypeOf(this, ApiException.prototype);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiException);
    }
  }
}

/**
 * API Client Class
 * Handles all HTTP requests with automatic token management and error handling
 */
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: {
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }[] = [];

  constructor() {
    console.log("ApiClient: Initializing with API_URL:", API_URL);
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000, // 30 seconds
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("ApiClient: Setting up interceptors...");
    this.setupInterceptors();
    console.log("ApiClient: Initialization complete");
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request Interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Skip auth if explicitly requested
        if ((config as any).skipAuth) {
          return config;
        }

        // Add auth token if available
        const token = await this.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log API Request
        console.log("📤 API Request:", {
          method: config.method?.toUpperCase(),
          url: `${config.baseURL}${config.url}`,
          data: config.data,
          params: config.params,
        });

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor - Handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => {
        // Log API Response
        console.log("📥 API Response:", {
          status: response.status,
          url: `${response.config.baseURL}${response.config.url}`,
          data: response.data,
        });
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => {
                if (originalRequest.headers) {
                  const token = this.getAccessToken();
                  if (token) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                  }
                }
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            // Process queued requests with new token
            this.processQueue(null);
            this.isRefreshing = false;

            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            this.isRefreshing = false;
            await this.clearSession();
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle API errors and convert to ApiException
   */
  private handleError(error: AxiosError): ApiException {
    if (error.response) {
      // Server responded with error
      const statusCode = error.response.status;
      const data = error.response.data as any;

      // Log API Error Response
      console.error("❌ API Error Response:", {
        status: statusCode,
        url: `${error.config?.baseURL}${error.config?.url}`,
        method: error.config?.method?.toUpperCase(),
        message: data?.message || error.message,
        errors: data?.errors,
        data: data,
      });

      // Check if error follows the API error schema
      if (data && typeof data === "object" && data.success === false) {
        // API error schema: { success: false, message: string, errors: [{ field, message }] }
        return new ApiException(
          data.message || "An error occurred",
          statusCode,
          undefined,
          this.transformErrors(data.errors)
        );
      }

      return new ApiException(
        data?.message || error.message || "An error occurred",
        statusCode,
        data?.code,
        data?.errors
      );
    } else if (error.request) {
      // Request made but no response
      console.error("❌ API Network Error:", {
        url: `${error.config?.baseURL}${error.config?.url}`,
        method: error.config?.method?.toUpperCase(),
        message: "No response from server - Network error",
      });
      return new ApiException(
        "Network error. Please check your connection.",
        0
      );
    } else {
      // Error setting up request
      console.error("❌ API Request Setup Error:", {
        message: error.message,
        url: error.config?.url,
      });
      return new ApiException(
        error.message || "An unexpected error occurred",
        0
      );
    }
  }

  /**
   * Transform API error fields to Record format for backward compatibility
   */
  private transformErrors(
    errors?: { field: string; message: string }[]
  ): Record<string, string[]> | undefined {
    if (!errors || !Array.isArray(errors)) {
      return undefined;
    }

    const transformed: Record<string, string[]> = {};
    errors.forEach((error) => {
      if (error.field && error.message) {
        if (!transformed[error.field]) {
          transformed[error.field] = [];
        }
        transformed[error.field].push(error.message);
      }
    });

    return Object.keys(transformed).length > 0 ? transformed : undefined;
  }

  /**
   * Process queued requests after token refresh
   */
  private processQueue(error: any): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    this.failedQueue = [];
  }

  /**
   * Get access token from storage
   */
  private async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Call refresh token endpoint
      const response = await axios.post(
        `${API_URL}/api/v1/auth/refresh-token`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const apiResponse = response.data;
      if (apiResponse.success && apiResponse.data?.accessToken) {
        const newToken = apiResponse.data.accessToken;
        await AsyncStorage.setItem(TOKEN_KEY, newToken);
        return newToken;
      }

      throw new Error("Failed to refresh token");
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  }

  /**
   * Clear session data
   */
  private async clearSession(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        SESSION_KEY,
        TOKEN_KEY,
        REFRESH_TOKEN_KEY,
      ]);
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  }

  /**
   * Set access token (called after login)
   */
  async setAccessToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error setting access token:", error);
    }
  }

  /**
   * Set refresh token (called after login)
   */
  async setRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error setting refresh token:", error);
    }
  }

  /**
   * Clear tokens (called on logout)
   */
  async clearTokens(): Promise<void> {
    await this.clearSession();
  }

  /**
   * GET request
   */
  async get<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, {
      params: config?.params,
      headers: config?.headers,
      timeout: config?.timeout,
      skipAuth: config?.skipAuth,
    } as any);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    console.log("ApiClient.post: url:", url, "data:", data, "config:", config);
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, {
        headers: config?.headers,
        timeout: config?.timeout,
        skipAuth: config?.skipAuth,
      } as any);
      console.log("ApiClient.post: response received, data:", response.data);
      return response.data;
    } catch (error) {
      console.error("ApiClient.post: error caught:", error);
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, {
      headers: config?.headers,
      timeout: config?.timeout,
      skipAuth: config?.skipAuth,
    } as any);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, {
      headers: config?.headers,
      timeout: config?.timeout,
      skipAuth: config?.skipAuth,
    } as any);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, {
      headers: config?.headers,
      timeout: config?.timeout,
      skipAuth: config?.skipAuth,
    } as any);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
