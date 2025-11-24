import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApiService } from "../../services/auth/authApi";
import type {
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "../../services/auth/authApi";

export function useVerifyOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: VerifyOtpRequest) => authApiService.verifyOtp(params),
    onSuccess: (data: VerifyOtpResponse) => {
      // Clear any auth-related queries on successful login
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      console.error("useVerifyOtp: error:", error);
    },
  });
}
