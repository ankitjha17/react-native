import { type ExpoConfig } from "@expo/config-types";

// Load the appropriate .env file based on APP_ENV
const envFile = process.env.APP_ENV
  ? `.env.${process.env.APP_ENV}`
  : ".env.development";

// Use require for CommonJS compatibility in config files
require("dotenv").config({
  path: require("path").resolve(process.cwd(), envFile),
});

const config: ExpoConfig = {
  name: "insurup",
  slug: "insurup",
  version: "1.0.0",
  extra: {
    APP_ENV: process.env.APP_ENV,
    API_URL: process.env.API_URL,
  },
};

export default config;
