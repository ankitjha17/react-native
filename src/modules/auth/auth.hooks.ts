/**
 * Auth Hooks
 * React Query hooks for authentication
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "./auth.service";
import { saveSession, clearSession, getCurrentSession } from "./auth.storage";
import type { VerifyOtpResponse, LogoutRequest } from "./auth.types";
import type { Session } from "../../auth/types";

/**
 * Send OTP mutation hook
 */
export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) => authService.sendOtp(phone),
    onError: (error) => {
      console.error("useSendOtp: error:", error);
    },
  });
}

/**
 * Verify OTP mutation hook
 * Automatically saves session on success
 */
export function useVerifyOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
      authService.verifyOtp(phone, otp),
    onSuccess: async (data: VerifyOtpResponse, variables) => {
      // Create session object
      const session: Session = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userPhone: variables.phone,
      };

      // Save session to storage
      await saveSession(session);

      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      console.error("useVerifyOtp: error:", error);
    },
  });
}

/**
 * Resend OTP mutation hook
 */
export function useResendOtp() {
  return useMutation({
    mutationFn: (phone: string) => authService.resendOtp(phone),
    onError: (error) => {
      console.error("useResendOtp: error:", error);
    },
  });
}

/**
 * Logout mutation hook
 * Automatically clears session on success
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: LogoutRequest) => authService.logout(params),
    onSuccess: async () => {
      // Clear session from storage
      await clearSession();

      // Clear all queries
      queryClient.clear();
    },
    onError: async (error) => {
      console.error("useLogout: error:", error);
      // Even if API call fails, clear local session
      await clearSession();
      queryClient.clear();
    },
  });
}

/**
 * Get current session query hook
 * Used for bootstrapping app on startup
 */
export function useGetCurrentSession() {
  return useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => getCurrentSession(),
    staleTime: Infinity, // Session doesn't change unless explicitly updated
    gcTime: Infinity,
    retry: false,
  });
}
