import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApiService } from "../../services/auth/authApi";
import type { LogoutRequest } from "../../services/auth/authApi";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: LogoutRequest) => authApiService.logout(params),
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
    onError: (error) => {
      console.error("useLogout: error:", error);
    },
  });
}
