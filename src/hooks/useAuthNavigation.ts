import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthStack";

export const useAuthNavigation = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  // Basic navigation methods
  const navigateToOnboarding = useCallback(() => {
    navigation.navigate("Onboarding");
  }, [navigation]);

  const navigateToLogin = useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  // Parameterized navigation methods
  const navigateToOTP = useCallback(
    (phone: string) => {
      navigation.navigate("OTP", { phone });
    },
    [navigation]
  );

  // Navigation control methods
  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    // Basic navigations
    navigateToOnboarding,
    navigateToLogin,

    // Parameterized navigations
    navigateToOTP,

    // Navigation control
    goBack,

    // Expose raw navigation object for edge cases
    navigation,
  };
};
