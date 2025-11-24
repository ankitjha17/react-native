// Types
export type {
  StrapiResponse,
  StrapiCollectionResponse,
  StrapiMeta,
  StrapiPaginationMeta,
  StrapiEntityAttributes,
  StrapiEntity,
  StrapiError,
  StrapiQueryParams,
} from "./types";

// Endpoints (exported from main endpoints file)
export { ONBOARDING_ENDPOINTS } from "../api/endpoints";

// Services
export { onboardingApiService } from "./onboarding/onboardingApi";

export type {
  CMSData,
  CMSResponse,
  CMSItem,
  GetOnboardingStepsParams,
  StrapiImage,
  StrapiImageFormat,
  StrapiLoginScreen,
  StrapiValidationScreen,
  StrapiOnboardingScreenStep,
} from "./onboarding/onboardingApi";
