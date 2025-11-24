/**
 * Auth Service Implementation
 * Implements AuthService interface using ViewModel
 */

import { authViewModel } from "../../viewmodels/AuthViewModel";
import type {
  AuthService as IAuthService,
  Session,
  LoginParams,
  LoginResponse,
  OtpParams,
} from "../../auth/types";

// Store phone number temporarily for OTP verification
// This should ideally be stored in AuthContext state
let pendingPhoneNumber: string | null = null;

/**
 * Auth Service
 * Wraps ViewModel to implement AuthService interface
 */
export class AuthService implements IAuthService {
  async getCurrentSession(): Promise<Session | null> {
    return await authViewModel.getCurrentSession();
  }

  async requestLogin(params: LoginParams): Promise<LoginResponse> {
    // Store phone for OTP verification
    if (params.phone) {
      pendingPhoneNumber = params.phone;
    }
    return await authViewModel.requestLogin(params);
  }

  async verifyOtp(params: OtpParams & { phone?: string }): Promise<Session> {
    // Use provided phone or fallback to pending phone
    const phone = params.phone || pendingPhoneNumber;
    if (!phone) {
      throw new Error("Phone number is required for OTP verification");
    }

    const session = await authViewModel.verifyOtp(phone, params.code);

    // Clear pending phone after successful verification
    pendingPhoneNumber = null;

    return session;
  }

  async resendOtp(params: LoginParams): Promise<LoginResponse> {
    // Store phone for future reference
    if (params.phone) {
      pendingPhoneNumber = params.phone;
    }
    return await authViewModel.resendOtpWithParams(params);
  }

  async logout(): Promise<void> {
    // Get refresh token from current session
    const session = await authViewModel.getCurrentSession();
    const refreshToken = session?.refreshToken;

    await authViewModel.logout(refreshToken);
    pendingPhoneNumber = null;
  }
}

// Export singleton instance
export const authService = new AuthService();
