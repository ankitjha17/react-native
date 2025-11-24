export type AuthStatus =
  | "unknown"
  | "onboarding"
  | "unauthenticated"
  | "pending_otp"
  | "authenticated";

export interface Session {
  accessToken: string;
  refreshToken?: string;
  userId?: string;
  userEmail?: string;
  userPhone?: string;
}

export interface LoginParams {
  phone?: string;
}

export interface LoginResponse {
  otpChannel: "sms" | "email";
  message?: string;
}

export interface OtpParams {
  code: string;
  phone?: string;
}

export interface AuthService {
  getCurrentSession(): Promise<Session | null>;
  requestLogin(params: LoginParams): Promise<LoginResponse>;
  verifyOtp(params: OtpParams): Promise<Session>;
  resendOtp(params: LoginParams): Promise<LoginResponse>;
  logout(): Promise<void>;
}
