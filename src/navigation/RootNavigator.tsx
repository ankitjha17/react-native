import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../auth/AuthContext";
import { AuthStack } from "./AuthStack";
import { AppStack } from "./AppStack";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export function RootNavigator() {
  const { status, bootstrap } = useAuth();
  const navigationReady = useRef(false);

  // Bootstrap auth on app start
  useEffect(() => {
    console.log("RootNavigator: Starting bootstrap...");
    bootstrap().catch((error) => {
      console.error("RootNavigator: Bootstrap failed:", error);
    });
  }, [bootstrap]);

  // Fallback: Hide SplashScreen after 5 seconds regardless of status
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      console.log("RootNavigator: Fallback timer - hiding SplashScreen");
      SplashScreen.hideAsync();
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  // Hide SplashScreen when navigation is ready and auth status is resolved
  useEffect(() => {
    console.log(
      "RootNavigator: Status changed to:",
      status,
      "Navigation ready:",
      navigationReady.current
    );
    if (navigationReady.current && status !== "unknown") {
      console.log("RootNavigator: Hiding SplashScreen");
      SplashScreen.hideAsync();
    }
  }, [status]);

  const handleNavigationReady = () => {
    console.log("RootNavigator: Navigation ready");
    navigationReady.current = true;
    // Hide SplashScreen if auth status is already resolved
    if (status !== "unknown") {
      console.log("RootNavigator: Hiding SplashScreen on navigation ready");
      SplashScreen.hideAsync();
    }
  };

  // Determine which stack to show based on auth status
  const renderStack = () => {
    console.log("RootNavigator: Rendering stack for status:", status);
    switch (status) {
      case "authenticated":
        console.log("RootNavigator: Rendering AppStack");
        return <AppStack />;
      case "onboarding":
      case "unauthenticated":
      case "pending_otp":
      default:
        console.log("RootNavigator: Rendering AuthStack");
        return <AuthStack />;
    }
  };

  return (
    <NavigationContainer onReady={handleNavigationReady}>
      {renderStack()}
    </NavigationContainer>
  );
}
