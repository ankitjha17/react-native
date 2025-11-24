//  API Response Types

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Error Field Schema

export interface ApiErrorField {
  field: string;
  message: string;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: ApiErrorField[];
  statusCode?: number;
}

// Request Configuration

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  skipAuth?: boolean;
}
