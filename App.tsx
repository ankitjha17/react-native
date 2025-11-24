import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAuthProvider } from "./src/auth/AuthContext";
import { authService } from "./src/services/auth/AuthService";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { useAppBootstrap } from "./src/hooks/useAppBootstrap";
import { ActivityIndicator, View, StyleSheet } from "react-native";

const AuthProvider = createAuthProvider(authService);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  const { ready, fontError } = useAppBootstrap();

  if (!ready) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  if (fontError) {
    console.warn("Font loading error:", fontError);
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});

export default App;
