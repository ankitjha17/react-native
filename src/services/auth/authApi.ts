import { apiClient } from "../api";
import { AUTH_ENDPOINTS } from "../api/endpoints";

// Send OTP Request
export interface SendOtpRequest {
  identifier: string; // Phone number with country code (e.g., "9720501234567")
}

// Send OTP Response
export interface SendOtpResponse {
  otp: string; // OTP code (for development/testing, remove in production)
}

//  Verify OTP Request
//  API expects: { "identifier": "9720501234567", "otp": "184009" }

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

//  Resend OTP Request (same as Send OTP)
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

class AuthApiService {
  /**
   * Send OTP to user's phone
   * API expects: { "identifier": "9720501234567" }
   */
  async sendOtp(params: SendOtpRequest): Promise<SendOtpResponse> {
    console.log(
      "AuthApiService.sendOtp: endpoint:",
      AUTH_ENDPOINTS.SEND_OTP,
      "params:",
      params
    );
    try {
      const response = await apiClient.post<SendOtpResponse>(
        AUTH_ENDPOINTS.SEND_OTP,
        params,
        { skipAuth: true } // Send OTP doesn't require auth
      );
      console.log("AuthApiService.sendOtp: response:", response);
      return response.data;
    } catch (error) {
      console.error("AuthApiService.sendOtp: error:", error);
      throw error;
    }
  }

  // Verify OTP code
  async verifyOtp(params: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const response = await apiClient.post<VerifyOtpResponse>(
      AUTH_ENDPOINTS.VERIFY_OTP,
      params,
      { skipAuth: true } // OTP verification doesn't require auth
    );
    return response.data;
  }

  // Refresh access token
  async refreshToken(
    params: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      params,
      { skipAuth: true } // Refresh doesn't require auth
    );
    return response.data;
  }

  // Logout User
  async logout(params: LogoutRequest): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT, params);
  }

  // Resend OTP
  async resendOtp(params: ResendOtpRequest): Promise<ResendOtpResponse> {
    const response = await apiClient.post<ResendOtpResponse>(
      AUTH_ENDPOINTS.RESEND_OTP,
      params,
      { skipAuth: true }
    );
    return response.data;
  }
}

// Export singleton instance
export const authApiService = new AuthApiService();
