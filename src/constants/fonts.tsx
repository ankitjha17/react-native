import {
  Rubik_300Light,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
} from "@expo-google-fonts/rubik";

// Font family names (used in styles)
const fonts = {
  family: {
    regular: "Rubik_400Regular",
    medium: "Rubik_500Medium",
    bold: "Rubik_700Bold",
    semiBold: "Rubik_600SemiBold",
    light: "Rubik_300Light",
  },
  weight: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
} as const;

// Font map for useFonts hook (used in App.tsx)
export const fontMap = {
  Rubik_300Light,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
};

export default fonts;
