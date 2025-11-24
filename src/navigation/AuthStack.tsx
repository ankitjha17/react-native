import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../auth/AuthContext";
import OnboardingScreen from "../screens/login/OnboardingScreen";
import Login from "../screens/login/Login";
import OTPVerification from "../screens/login/OTPVerification";

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  OTP: { phone: string } | undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  const { status } = useAuth();

  // Determine initial route based on auth status
  // If user logged out (unauthenticated), show Login screen
  // Otherwise, show Onboarding for first-time users
  const initialRouteName =
    status === "unauthenticated" ? "Login" : "Onboarding";

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          title: "Onboarding",
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name="OTP"
        component={OTPVerification}
        options={{
          title: "Verify OTP",
        }}
      />
    </Stack.Navigator>
  );
}
