/**
 * Auth Storage Utilities
 * Handles session storage for authentication
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "../../api/apiClient";
import type { Session } from "../../auth/types";

const SESSION_KEY = "@insurup_session";

/**
 * Save session to storage
 */
export async function saveSession(session: Session): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));

    // Also store tokens in API client
    if (session.accessToken) {
      await apiClient.setAccessToken(session.accessToken);
    }
    if (session.refreshToken) {
      await apiClient.setRefreshToken(session.refreshToken);
    }
  } catch (error) {
    console.error("Error saving session:", error);
    throw new Error("Failed to save session");
  }
}

/**
 * Get current session from storage
 */
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const sessionData = await AsyncStorage.getItem(SESSION_KEY);
    if (!sessionData) {
      return null;
    }

    const session: Session = JSON.parse(sessionData);

    // Restore tokens to API client
    if (session.accessToken) {
      await apiClient.setAccessToken(session.accessToken);
    }
    if (session.refreshToken) {
      await apiClient.setRefreshToken(session.refreshToken);
    }

    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Clear session from storage
 */
export async function clearSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
    await apiClient.clearTokens();
  } catch (error) {
    console.error("Error clearing session:", error);
    throw new Error("Failed to clear session");
  }
}
