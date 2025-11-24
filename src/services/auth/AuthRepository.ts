import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApiService } from "./authApi";
import { apiClient } from "../api";
import type { SendOtpResponse, ResendOtpResponse } from "./authApi";
import { Session } from "../../auth/types";

const SESSION_KEY = "@insurup_session";
const TEST_MODE = false; // Set to false to enable real API calls

class AuthRepository {
  // Converts "0501234567" to "9720501234567"
  private formatPhoneToIdentifier(phone: string): string {
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.startsWith("972")) {
      return digitsOnly;
    }
    if (digitsOnly.startsWith("0")) {
      return `972${digitsOnly.slice(1)}`;
    }
    return `972${digitsOnly}`;
  }

  // send Otp
  async sendOtp(phone: string): Promise<SendOtpResponse> {
    try {
      console.log("AuthRepository.sendOtp: phone:", phone);
      const identifier = this.formatPhoneToIdentifier(phone);
      console.log("AuthRepository.sendOtp: formatted identifier:", identifier);
      if (TEST_MODE) {
        console.log("TEST MODE: Bypassing sendOtp API call");
        return {
          otp: "123456",
        };
      }
      console.log("AuthRepository.sendOtp: Calling API...");
      const response = await authApiService.sendOtp({ identifier });
      console.log("AuthRepository.sendOtp: API response received:", response);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  //verify opt
  async verifyOtp(phone: string, otp: string): Promise<Session> {
    try {
      console.log("AuthRepository.verifyOtp: phone:", phone, "otp:", otp);
      const identifier = this.formatPhoneToIdentifier(phone);
      console.log(
        "AuthRepository.verifyOtp: formatted identifier:",
        identifier
      );
      //for bypassing the API CALL
      if (TEST_MODE) {
        const mockAccessToken = `mock_access_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const mockRefreshToken = `mock_refresh_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await apiClient.setAccessToken(mockAccessToken);
        await apiClient.setRefreshToken(mockRefreshToken);
        const session: Session = {
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken,
          userPhone: identifier,
        };
        await this.saveSession(session);
        console.log("TEST MODE: Mock session created and saved");
        return session;
      }
      console.log("AuthRepository.verifyOtp: Calling API...");
      const response = await authApiService.verifyOtp({ identifier, otp });
      console.log("AuthRepository.verifyOtp: API response received");

      // Store tokens in API client
      await apiClient.setAccessToken(response.accessToken);
      if (response.refreshToken) {
        await apiClient.setRefreshToken(response.refreshToken);
      }
      const session: Session = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        userPhone: identifier,
      };
      // Persist session
      await this.saveSession(session);
      return session;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  //Get current session from stograge
  async getCurrentSession(): Promise<Session | null> {
    try {
      const sessionData = await AsyncStorage.getItem(SESSION_KEY);
      if (!sessionData) {
        return null;
      }

      const session: Session = JSON.parse(sessionData);

      // Restore tokens to API client
      if (session.accessToken) {
        await apiClient.setAccessToken(session.accessToken);
      }
      if (session.refreshToken) {
        await apiClient.setRefreshToken(session.refreshToken);
      }

      return session;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  }

  //saving session storage
  private async saveSession(session: Session): Promise<void> {
    try {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error("Error saving session:", error);
      throw new Error("Failed to save session");
    }
  }

  //clear session & tokens
  async clearSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
      await apiClient.clearTokens();
    } catch (error) {
      console.error("Error clearing session:", error);
      throw new Error("Failed to clear session");
    }
  }

  //Logout user
  async logout(refreshToken: string): Promise<void> {
    try {
      await authApiService.logout({ refreshToken });
      await this.clearSession();
    } catch (error) {
      // Even if API call fails, clear local session
      await this.clearSession();
      throw this.handleError(error);
    }
  }

  //resend otp
  async resendOtp(phone: string): Promise<ResendOtpResponse> {
    try {
      const identifier = this.formatPhoneToIdentifier(phone);
      if (TEST_MODE) {
        console.log("TEST MODE: Bypassing resendOtp API call");
        return {
          otp: "123456",
        };
      }
      const response = await authApiService.resendOtp({ identifier });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }

    // Handle API error format
    if (error?.message) {
      return new Error(error.message);
    }

    return new Error("An unexpected error occurred");
  }
}

export const authRepository = new AuthRepository();
