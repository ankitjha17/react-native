import { type ExpoConfig } from "@expo/config-types";
import dotenv from "dotenv";
import path from "path";

// Load the appropriate .env file based on APP_ENV
const envFile = process.env.APP_ENV
  ? `.env.${process.env.APP_ENV}`
  : ".env.development";

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const config: ExpoConfig = {
  name: "insurup",
  slug: "insurup",
  version: "1.0.0",
  icon: "./assets/images/app_icon.png",
  plugins: ["expo-font"],
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
  },
  ios: {
    icon: "./assets/images/app_icon.png",
  },
  splash: {
    image: "./assets/images/splash_icon.png",
    resizeMode: "contain",
    backgroundColor: "#FFFFFF",
  },
  extra: {
    APP_ENV: process.env.APP_ENV,
    API_URL: process.env.API_URL,
  },
};

export default config;
