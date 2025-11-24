const API_VERSION = "/api/v1";
const STRAPI_API_BASE = "/api";

const BASE_PATHS = {
  AUTH: `${API_VERSION}/auth`,
} as const;

const STRAPI_BASE_PATHS = {
  ONBOARDING: `${STRAPI_API_BASE}/onbordings`,
} as const;

//  Authentication Endpoints
export const AUTH_ENDPOINTS = {
  SEND_OTP: `${BASE_PATHS.AUTH}/send-otp`,
  VERIFY_OTP: `${BASE_PATHS.AUTH}/verify-otp`,
  RESEND_OTP: `${BASE_PATHS.AUTH}/resend-otp`,
  REFRESH_TOKEN: `${BASE_PATHS.AUTH}/refresh-token`,
  LOGOUT: `${BASE_PATHS.AUTH}/logout`,
} as const;

//  Strapi Onboarding Endpoints
export const ONBOARDING_ENDPOINTS = {
  BASE: STRAPI_BASE_PATHS.ONBOARDING,
} as const;
