import axios from "axios";
import { ONBOARDING_ENDPOINTS } from "../../api/endpoints";
import { STRAPI_URL } from "../../../config/env";
import type { StrapiPaginationMeta } from "../types";

export interface StrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats?: {
    large?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    small?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiOnboardingScreenStep {
  id: number;
  Title: string;
  SubTitle: string;
  Duration: string; // Stored as string in Strapi
  ImageUrl: StrapiImage;
}

export interface StrapiLoginScreen {
  id: number;
  Title: string;
  SubTitle: string;
  Description: string;
  FormText: string;
  BtnText: string;
  Logo: StrapiImage | null;
  Flag: StrapiImage | null;
}

export interface StrapiValidationScreen {
  id: number;
  Title: string;
  Description: string;
  Text: string;
  BtnText: string;
  Resend?: string;
  Logo: StrapiImage | null;
}

export interface CMSResponse {
  data: CMSItem[];
  meta: StrapiPaginationMeta;
}

export interface CMSItem {
  id: number;
  documentId: string;
  alias: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  LoginScreen: StrapiLoginScreen | null;
  ValidationScreen: StrapiValidationScreen | null;
  Onboarding: {
    id: number;
    Icon: StrapiImage | null;
    OnboardingScreen: StrapiOnboardingScreenStep[];
  } | null;
}

export interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  duration: number; // milliseconds
}

export interface LoginScreenData {
  title: string;
  subtitle: string;
  description: string;
  formText: string;
  btnText: string;
  logoUrl: string | null;
  flagUrl: string | null;
}

export interface ValidationScreenData {
  title: string;
  description: string;
  text: string;
  btnText: string;
  resend: string;
  logoUrl: string | null;
}

export interface CMSData {
  // Onboarding Screen Data
  onboarding: {
    logoUrl: string | null;
    steps: OnboardingStep[];
  };
  // Login Screen Data
  loginScreen: LoginScreenData | null;
  // Validation Screen Data
  validationScreen: ValidationScreenData | null;
}

export interface OnboardingData {
  logoUrl: string | null;
  steps: OnboardingStep[];
}

export interface GetOnboardingStepsParams {
  pLevel?: string;
}

function buildImageUrl(imagePath: string): string {
  if (!imagePath) return "";

  // If already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  // Construct full URL
  const baseUrl = STRAPI_URL.endsWith("/")
    ? STRAPI_URL.slice(0, -1)
    : STRAPI_URL;
  return `${baseUrl}/${cleanPath}`;
}

function pickImageUrl(imageObj?: any): string | null {
  if (!imageObj) return null;

  const formats = imageObj.formats;
  const url =
    formats?.large?.url ||
    formats?.medium?.url ||
    formats?.small?.url ||
    formats?.thumbnail?.url ||
    imageObj?.url ||
    null;

  return url ? buildImageUrl(url) : null;
}

function normalizeOnboardingScreens(screenList: any[]): OnboardingStep[] {
  return screenList.map((screen) => ({
    id: screen.id,
    title: screen.Title,
    subtitle: screen.SubTitle,
    duration: parseInt(screen.Duration, 10) || 4000,
    imageUrl: pickImageUrl(screen.ImageUrl) || "",
  }));
}

class OnboardingApiService {
  async getCMSData(params?: GetOnboardingStepsParams): Promise<CMSData> {
    try {
      console.log(
        "OnboardingApiService.getCMSData: fetching all CMS data with params:",
        params
      );

      // Build query string - only pLevel parameter is accepted by the API
      // pLevel must always be passed: ?pLevel (if empty/undefined) or ?pLevel=value (if has value)
      const pLevel = params?.pLevel || "";
      const queryString =
        pLevel.trim() !== ""
          ? `?pLevel=${encodeURIComponent(pLevel)}`
          : "?pLevel";

      const fullUrl = `${STRAPI_URL}${ONBOARDING_ENDPOINTS.BASE}${queryString}`;

      console.log("OnboardingApiService.getCMSData: calling URL:", fullUrl);

      const response = await axios.get<CMSResponse>(fullUrl, {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log(
        "OnboardingApiService.getCMSData: response received:",
        response.data
      );

      const entry = response.data?.data?.[0];

      if (!entry) {
        console.warn("No CMS data found in response");
        return {
          onboarding: { logoUrl: null, steps: [] },
          loginScreen: null,
          validationScreen: null,
        };
      }

      // Extract Onboarding data
      const onboarding = entry.Onboarding;
      const onboardingLogo = pickImageUrl(onboarding?.Icon);
      const onboardingScreens = onboarding?.OnboardingScreen
        ? normalizeOnboardingScreens(onboarding.OnboardingScreen)
        : [];

      // Extract LoginScreen data
      const login = entry.LoginScreen;
      const loginScreen = login
        ? {
            title: login.Title,
            subtitle: login.SubTitle,
            description: login.Description,
            formText: login.FormText,
            btnText: login.BtnText,
            logoUrl: pickImageUrl(login.Logo),
            flagUrl: pickImageUrl(login.Flag),
          }
        : null;

      // Extract ValidationScreen data
      const validation = entry.ValidationScreen;
      const validationScreen = validation
        ? {
            title: validation.Title,
            description: validation.Description,
            text: validation.Text,
            btnText: validation.BtnText,
            resend: validation.Resend || "Resend",
            logoUrl: pickImageUrl(validation.Logo),
          }
        : null;

      return {
        onboarding: {
          logoUrl: onboardingLogo,
          steps: onboardingScreens,
        },
        loginScreen,
        validationScreen,
      };
    } catch (error) {
      console.error("OnboardingApiService.getCMSData: error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const onboardingApiService = new OnboardingApiService();
