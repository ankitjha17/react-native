import Constants from "expo-constants";

// Read all environment variables from expo-constants
const extra = Constants.expoConfig?.extra || {};

const getEnvVar = (key: string, defaultValue: string = ""): string => {
  if (extra && extra[key] != null) {
    return String(extra[key]);
  }
  return defaultValue;
};

// Export environment variables
export const API_URL = getEnvVar("API_URL", "https://api-dev.insurup.co.il");
export const STRAPI_URL = getEnvVar(
  "STRAPI_URL",
  "https://dev-cms.insurup.co.il"
);
export const ENV_NAME = getEnvVar("ENV_NAME", "DEV") as
  | "DEV"
  | "PRODUCTION"
  | "STAGE";
export const FEATURE_FLAG_SAMPLE =
  getEnvVar("FEATURE_FLAG_SAMPLE", "false") === "true";
export const LOG_LEVEL = getEnvVar("LOG_LEVEL", "debug");

// Sentry Configuration
export const SENTRY_DSN = getEnvVar("sentryDsn", "");

// Firebase Configuration
export const FIREBASE_API_KEY = getEnvVar("firebaseApiKey", "");
export const FIREBASE_AUTH_DOMAIN = getEnvVar("firebaseAuthDomain", "");
export const FIREBASE_PROJECT_ID = getEnvVar("firebaseProjectId", "");
export const FIREBASE_STORAGE_BUCKET = getEnvVar("firebaseStorageBucket", "");
export const FIREBASE_MESSAGING_SENDER_ID = getEnvVar(
  "firebaseMessagingSenderId",
  ""
);
export const FIREBASE_APP_ID = getEnvVar("firebaseAppId", "");

// Default export for backward compatibility
export default {
  ENV: ENV_NAME,
  API_URL,
  STRAPI_URL,
  LOG_LEVEL,
  FEATURE_FLAG_SAMPLE,
};
