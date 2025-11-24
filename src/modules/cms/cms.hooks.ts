/**
 * CMS Hooks
 * React Query hooks for CMS data
 */
import { useQuery } from "@tanstack/react-query";
import { cmsService } from "./cms.service";
import type { GetCMSDataParams, CMSData } from "./cms.types";

export function useCMSData(params?: GetCMSDataParams) {
  return useQuery<CMSData, Error>({
    queryKey: ["cms", "data", params?.pLevel],
    queryFn: () => cmsService.getCMSData(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
