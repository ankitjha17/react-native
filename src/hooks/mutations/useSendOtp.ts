import { useMutation } from "@tanstack/react-query";
import { authApiService } from "../../services/auth/authApi";
import type { SendOtpRequest } from "../../services/auth/authApi";

export function useSendOtp() {
  return useMutation({
    mutationFn: (params: SendOtpRequest) => authApiService.sendOtp(params),
    onError: (error) => {
      console.error("useSendOtp: error:", error);
    },
  });
}
