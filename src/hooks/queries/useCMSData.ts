import { useQuery } from "@tanstack/react-query";
import { onboardingApiService } from "../../services/strapi";
import type { GetOnboardingStepsParams, CMSData } from "../../services/strapi";

export function useCMSData(params?: GetOnboardingStepsParams) {
  return useQuery<CMSData, Error>({
    queryKey: ["cms", "data", params?.pLevel],
    queryFn: () => onboardingApiService.getCMSData(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
