import { authRepository } from "../services/auth/AuthRepository";
import type {
  LoginParams,
  LoginResponse,
  OtpParams,
  Session,
} from "../auth/types";

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
}

class AuthViewModel {
  validatePhoneNumber(phone: string): PhoneValidationResult {
    if (!phone || phone.trim().length === 0) {
      return {
        isValid: false,
        error: "Phone number is required",
      };
    }

    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, "");

    // Israeli phone validation
    // User enters phone with leading 0 (e.g., 0501234567) since +972 is already shown in UI

    // Mobile: 05X + 7 digits = 10 digits total (e.g., 0501234567)
    const mobileRegex = /^05\d{8}$/;

    // Landline: 02/03/04/08/09 + 7-8 digits = 9-10 digits total (e.g., 021234567)
    const landlineRegex = /^0[23489]\d{7,8}$/;

    // Check if matches mobile or landline pattern
    if (mobileRegex.test(digitsOnly) || landlineRegex.test(digitsOnly)) {
      return { isValid: true };
    }

    return {
      isValid: false,
      error: "Please enter a valid Israeli phone number",
    };
  }

  /**
   * Validate OTP code
   */
  validateOtpCode(code: string): { isValid: boolean; error?: string } {
    if (!code || code.trim().length === 0) {
      return {
        isValid: false,
        error: "OTP code is required",
      };
    }

    // OTP should be 6 digits
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(code)) {
      return {
        isValid: false,
        error: "OTP must be 6 digits",
      };
    }

    return { isValid: true };
  }

  /**
   * Format phone number for display
   */
  formatPhoneNumber(phone: string): string {
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length === 0) {
      return "";
    }

    // Format as: 05X-XXX-XXXX for mobile or 0X-XXX-XXXX for landline
    if (digitsOnly.startsWith("5") && digitsOnly.length === 9) {
      return `0${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2, 5)}-${digitsOnly.slice(5)}`;
    } else if (digitsOnly.length >= 8) {
      return `0${digitsOnly.slice(0, 1)}-${digitsOnly.slice(1, 4)}-${digitsOnly.slice(4)}`;
    }

    return digitsOnly;
  }

  /**
   * Mask phone number for display (privacy)
   */
  maskPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 6) {
      return digits;
    }
    return `${digits.slice(0, 2)}***${digits.slice(-4)}`;
  }

  /**
   * Send OTP to user's phone
   * Business logic: Validate phone, then call repository
   */
  async sendOtp(phone: string): Promise<{ message: string }> {
    console.log("AuthViewModel.sendOtp: phone:", phone);

    // Validate phone
    const validation = this.validatePhoneNumber(phone);
    console.log("AuthViewModel.sendOtp: validation result:", validation);
    if (!validation.isValid) {
      console.error(
        "AuthViewModel.sendOtp: Phone validation failed:",
        validation.error
      );
      throw new Error(validation.error);
    }

    // Call repository
    console.log("AuthViewModel.sendOtp: Calling repository...");
    const response = await authRepository.sendOtp(phone);
    console.log("AuthViewModel.sendOtp: Repository response:", response);

    return {
      message: "OTP sent successfully to your mobile",
    };
  }

  /**
   * Request login OTP (for backward compatibility with AuthService interface)
   * Maps to sendOtp
   */
  async requestLogin(params: LoginParams): Promise<LoginResponse> {
    console.log("AuthViewModel.requestLogin: params:", params);
    if (!params.phone) {
      throw new Error("Phone number is required");
    }

    console.log("AuthViewModel.requestLogin: Calling sendOtp...");
    await this.sendOtp(params.phone);
    console.log("AuthViewModel.requestLogin: sendOtp completed");

    return {
      otpChannel: "sms",
      message: "OTP sent successfully to your mobile",
    };
  }

  /**
   * Verify OTP
   * Business logic: Validate OTP format, then call repository
   */
  async verifyOtp(phone: string, otp: string): Promise<Session> {
    console.log(
      "AuthViewModel.verifyOtp: phone:",
      phone,
      "otp length:",
      otp.length
    );

    // Validate OTP
    const validation = this.validateOtpCode(otp);
    if (!validation.isValid) {
      console.error(
        "AuthViewModel.verifyOtp: OTP validation failed:",
        validation.error
      );
      throw new Error(validation.error);
    }

    // Note: Phone validation is already done in login, so we skip it here
    // The phone format will be handled by the repository (formatPhoneToIdentifier)
    // We only validate OTP here to avoid showing phone validation errors on OTP screen

    // Call repository
    console.log("AuthViewModel.verifyOtp: Calling repository...");
    return await authRepository.verifyOtp(phone, otp);
  }

  /**
   * Verify OTP (for backward compatibility with AuthService interface)
   */
  async verifyOtpWithParams(
    params: OtpParams & { phone?: string }
  ): Promise<Session> {
    if (!params.phone) {
      throw new Error("Phone number is required");
    }
    return await this.verifyOtp(params.phone, params.code);
  }

  /**
   * Get current session
   */
  async getCurrentSession(): Promise<Session | null> {
    return await authRepository.getCurrentSession();
  }

  /**
   * Logout
   * Requires refreshToken from current session
   */
  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await authRepository.logout(refreshToken);
    } else {
      // If no refreshToken provided, just clear local session
      await authRepository.clearSession();
    }
  }

  /**
   * Resend OTP
   */
  async resendOtp(phone: string): Promise<{ message: string }> {
    // Validate phone
    const validation = this.validatePhoneNumber(phone);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // const response = await authRepository.resendOtp(phone);

    return {
      message: "OTP sent successfully to your mobile",
    };
  }

  /**
   * Resend OTP (for backward compatibility with AuthService interface)
   */
  async resendOtpWithParams(params: LoginParams): Promise<LoginResponse> {
    if (!params.phone) {
      throw new Error("Phone number is required");
    }

    await this.resendOtp(params.phone);

    return {
      otpChannel: "sms",
      message: "OTP sent successfully to your mobile",
    };
  }
}

// Export singleton instance
export const authViewModel = new AuthViewModel();
