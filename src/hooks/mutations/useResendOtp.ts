import { useMutation } from "@tanstack/react-query";
import { authApiService } from "../../services/auth/authApi";
import type { ResendOtpRequest } from "../../services/auth/authApi";

export function useResendOtp() {
  return useMutation({
    mutationFn: (params: ResendOtpRequest) => authApiService.resendOtp(params),
    onError: (error) => {
      console.error("useResendOtp: error:", error);
    },
  });
}
