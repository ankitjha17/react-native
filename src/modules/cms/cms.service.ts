/**
 * CMS Service
 * API functions for CMS/Strapi data
 */
import axios from "axios";
import { CMS_ENDPOINTS } from "../../api/endpoints";
import { STRAPI_URL } from "../../config/env";
import type {
  CMSData,
  CMSResponse,
  GetCMSDataParams,
  OnboardingStep,
} from "./cms.types";

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

export const cmsService = {
  /**
   * Get CMS data from Strapi
   * Note: Uses direct axios since Strapi has a different base URL than main API
   */
  async getCMSData(params?: GetCMSDataParams): Promise<CMSData> {
    console.log("🔵 [cmsService.getCMSData] Starting - params:", params);

    try {
      // Build query string - only pLevel parameter is accepted by the API
      // pLevel must always be passed: ?pLevel (if empty/undefined) or ?pLevel=value (if has value)
      const pLevel = params?.pLevel || "";
      const queryString =
        pLevel.trim() !== ""
          ? `?pLevel=${encodeURIComponent(pLevel)}`
          : "?pLevel";

      const fullUrl = `${STRAPI_URL}${CMS_ENDPOINTS.ONBOARDING}${queryString}`;
      console.log("🔵 [cmsService.getCMSData] Full URL:", fullUrl);
      console.log(
        "🔵 [cmsService.getCMSData] Endpoint:",
        CMS_ENDPOINTS.ONBOARDING
      );

      const response = await axios.get<CMSResponse>(fullUrl, {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log(
        "✅ [cmsService.getCMSData] Success - response status:",
        response.status
      );

      const entry = response.data?.data?.[0];

      if (!entry) {
        console.warn(
          "⚠️ [cmsService.getCMSData] No CMS data found in response"
        );
        return {
          onboarding: { logoUrl: null, steps: [] },
          loginScreen: null,
          validationScreen: null,
        };
      }

      console.log("🔵 [cmsService.getCMSData] Processing CMS entry data...");

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

      const result = {
        onboarding: {
          logoUrl: onboardingLogo,
          steps: onboardingScreens,
        },
        loginScreen,
        validationScreen,
      };

      console.log("✅ [cmsService.getCMSData] Processed successfully -", {
        onboardingSteps: result.onboarding.steps.length,
        hasLoginScreen: !!result.loginScreen,
        hasValidationScreen: !!result.validationScreen,
      });

      return result;
    } catch (error) {
      console.error("❌ [cmsService.getCMSData] Error:", error);
      throw error;
    }
  },
};
