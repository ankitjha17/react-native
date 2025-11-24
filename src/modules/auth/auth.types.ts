/**
 * Auth Types
 * Type definitions for authentication requests and responses
 */

// Send OTP Request
export interface SendOtpRequest {
  identifier: string; // Phone number with country code (e.g., "9720501234567")
}

// Send OTP Response
export interface SendOtpResponse {
  otp: string; // OTP code (for development/testing, remove in production)
}

// Verify OTP Request
export interface VerifyOtpRequest {
  identifier: string;
  otp: string;
}

// Verify OTP Response
export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
}

// Refresh Token Request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Refresh Token Response
export interface RefreshTokenResponse {
  accessToken: string;
}

// Resend OTP Request (same as Send OTP)
export interface ResendOtpRequest {
  identifier: string;
}

// Resend OTP Response (same as Send OTP)
export interface ResendOtpResponse {
  otp: string; // OTP code (for development/testing, remove in production)
}

// Logout Request
export interface LogoutRequest {
  refreshToken: string;
}
