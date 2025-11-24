/**
 * Auth Service
 * Pure API functions for authentication
 */
import { apiClient } from "../../api/apiClient";
import { AUTH_ENDPOINTS } from "../../api/endpoints";
import { formatPhoneToIdentifier } from "./auth.validators";
import type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
} from "./auth.types";

export const authService = {
  /**
   * Send OTP to user's phone
   * @param phone - Phone number (e.g., "0501234567")
   */
  async sendOtp(phone: string): Promise<SendOtpResponse> {
    console.log("🔵 [authService.sendOtp] Starting - phone:", phone);
    const identifier = formatPhoneToIdentifier(phone);
    console.log("🔵 [authService.sendOtp] Formatted identifier:", identifier);
    console.log("🔵 [authService.sendOtp] Endpoint:", AUTH_ENDPOINTS.SEND_OTP);

    try {
      const response = await apiClient.post<SendOtpResponse>(
        AUTH_ENDPOINTS.SEND_OTP,
        { identifier },
        { skipAuth: true }
      );
      console.log(
        "✅ [authService.sendOtp] Success - response:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("❌ [authService.sendOtp] Error:", error);
      throw error;
    }
  },

  /**
   * Verify OTP code
   * @param phone - Phone number (e.g., "0501234567")
   * @param otp - OTP code (e.g., "123456")
   */
  async verifyOtp(phone: string, otp: string): Promise<VerifyOtpResponse> {
    console.log(
      "🔵 [authService.verifyOtp] Starting - phone:",
      phone,
      "otp length:",
      otp.length
    );
    const identifier = formatPhoneToIdentifier(phone);
    console.log("🔵 [authService.verifyOtp] Formatted identifier:", identifier);
    console.log(
      "🔵 [authService.verifyOtp] Endpoint:",
      AUTH_ENDPOINTS.VERIFY_OTP
    );

    try {
      const response = await apiClient.post<VerifyOtpResponse>(
        AUTH_ENDPOINTS.VERIFY_OTP,
        { identifier, otp },
        { skipAuth: true }
      );
      console.log(
        "✅ [authService.verifyOtp] Success - accessToken received:",
        response.data.accessToken ? "Yes" : "No"
      );
      return response.data;
    } catch (error) {
      console.error("❌ [authService.verifyOtp] Error:", error);
      throw error;
    }
  },

  /**
   * Resend OTP
   * @param phone - Phone number (e.g., "0501234567")
   */
  async resendOtp(phone: string): Promise<ResendOtpResponse> {
    console.log("🔵 [authService.resendOtp] Starting - phone:", phone);
    const identifier = formatPhoneToIdentifier(phone);
    console.log("🔵 [authService.resendOtp] Formatted identifier:", identifier);
    console.log(
      "🔵 [authService.resendOtp] Endpoint:",
      AUTH_ENDPOINTS.RESEND_OTP
    );

    try {
      const response = await apiClient.post<ResendOtpResponse>(
        AUTH_ENDPOINTS.RESEND_OTP,
        { identifier },
        { skipAuth: true }
      );
      console.log(
        "✅ [authService.resendOtp] Success - response:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("❌ [authService.resendOtp] Error:", error);
      throw error;
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(
    params: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    console.log("🔵 [authService.refreshToken] Starting");
    console.log(
      "🔵 [authService.refreshToken] Endpoint:",
      AUTH_ENDPOINTS.REFRESH_TOKEN
    );

    try {
      const response = await apiClient.post<RefreshTokenResponse>(
        AUTH_ENDPOINTS.REFRESH_TOKEN,
        params,
        { skipAuth: true }
      );
      console.log(
        "✅ [authService.refreshToken] Success - new accessToken received"
      );
      return response.data;
    } catch (error) {
      console.error("❌ [authService.refreshToken] Error:", error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout(params: LogoutRequest): Promise<void> {
    console.log("🔵 [authService.logout] Starting");
    console.log("🔵 [authService.logout] Endpoint:", AUTH_ENDPOINTS.LOGOUT);

    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT, params);
      console.log("✅ [authService.logout] Success");
    } catch (error) {
      console.error("❌ [authService.logout] Error:", error);
      throw error;
    }
  },
};
