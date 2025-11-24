import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  ReactNode,
} from "react";
import type {
  AuthService,
  Session,
  AuthStatus,
  LoginParams,
  OtpParams,
} from "./types";
import { authViewModel } from "../viewmodels/AuthViewModel";

// Auth State
interface AuthState {
  status: AuthStatus;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

// Auth Actions
interface AuthActions {
  bootstrap(): Promise<void>;
  completeOnboarding(): void;
  requestLogin(params: LoginParams): Promise<void>;
  verifyOtp(params: OtpParams): Promise<void>;
  resendOtp(params: LoginParams): Promise<void>;
  logout(): Promise<void>;
  clearError(): void;
  validatePhoneNumber(phone: string): { isValid: boolean; error?: string };
  validateOtpCode(code: string): { isValid: boolean; error?: string };
}

// Combined Auth Context Type
type AuthContextType = AuthState & AuthActions;

// Action Types for Reducer
type AuthAction =
  | { type: "BOOTSTRAP_START" }
  | { type: "BOOTSTRAP_SUCCESS"; session: Session | null }
  | { type: "BOOTSTRAP_ERROR"; error: string }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS" }
  | { type: "LOGIN_ERROR"; error: string }
  | { type: "OTP_VERIFY_START" }
  | { type: "OTP_VERIFY_SUCCESS"; session: Session }
  | { type: "OTP_VERIFY_ERROR"; error: string }
  | { type: "LOGOUT_START" }
  | { type: "LOGOUT_SUCCESS" }
  | { type: "LOGOUT_ERROR"; error: string }
  | { type: "CLEAR_ERROR" };

// Initial State
const initialState: AuthState = {
  status: "onboarding", // Start with onboarding
  session: null,
  loading: false,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "BOOTSTRAP_START":
      return { ...state, loading: true, error: null };

    case "BOOTSTRAP_SUCCESS":
      return {
        ...state,
        status: action.session ? "authenticated" : "unauthenticated",
        session: action.session,
        loading: false,
        error: null,
      };

    case "BOOTSTRAP_ERROR":
      return {
        ...state,
        status: "unauthenticated",
        session: null,
        loading: false,
        error: action.error,
      };

    case "COMPLETE_ONBOARDING":
      return {
        ...state,
        status: "unauthenticated",
        error: null,
      };

    case "LOGIN_START":
      return { ...state, loading: true, error: null };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        status: "pending_otp",
        loading: false,
        error: null,
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case "OTP_VERIFY_START":
      return { ...state, loading: true, error: null };

    case "OTP_VERIFY_SUCCESS":
      return {
        ...state,
        status: "authenticated",
        session: action.session,
        loading: false,
        error: null,
      };

    case "OTP_VERIFY_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case "LOGOUT_START":
      return { ...state, loading: true, error: null };

    case "LOGOUT_SUCCESS":
      return {
        ...state,
        status: "unauthenticated",
        session: null,
        loading: false,
        error: null,
      };

    case "LOGOUT_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
}

// Context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider Factory
export function createAuthProvider(authService: AuthService) {
  return function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const actions: AuthActions = useMemo(
      () => ({
        async bootstrap() {
          try {
            dispatch({ type: "BOOTSTRAP_START" });
            const session = await authService.getCurrentSession();
            dispatch({ type: "BOOTSTRAP_SUCCESS", session });
          } catch (error) {
            dispatch({
              type: "BOOTSTRAP_ERROR",
              error:
                error instanceof Error ? error.message : "Bootstrap failed",
            });
          }
        },

        completeOnboarding() {
          dispatch({ type: "COMPLETE_ONBOARDING" });
        },

        async requestLogin(params: LoginParams) {
          try {
            dispatch({ type: "LOGIN_START" });
            await authService.requestLogin(params);
            dispatch({ type: "LOGIN_SUCCESS" });
          } catch (error) {
            dispatch({
              type: "LOGIN_ERROR",
              error: error instanceof Error ? error.message : "Login failed",
            });
          }
        },

        async verifyOtp(params: OtpParams) {
          try {
            dispatch({ type: "OTP_VERIFY_START" });
            const session = await authService.verifyOtp(params);
            dispatch({ type: "OTP_VERIFY_SUCCESS", session });
          } catch (error) {
            dispatch({
              type: "OTP_VERIFY_ERROR",
              error:
                error instanceof Error
                  ? error.message
                  : "OTP verification failed",
            });
          }
        },

        async resendOtp(params: LoginParams) {
          try {
            dispatch({ type: "LOGIN_START" });
            await authService.resendOtp(params);
            dispatch({ type: "LOGIN_SUCCESS" });
          } catch (error) {
            dispatch({
              type: "LOGIN_ERROR",
              error:
                error instanceof Error ? error.message : "Failed to resend OTP",
            });
          }
        },

        async logout() {
          try {
            dispatch({ type: "LOGOUT_START" });
            await authService.logout();
            dispatch({ type: "LOGOUT_SUCCESS" });
          } catch (error) {
            dispatch({
              type: "LOGOUT_ERROR",
              error: error instanceof Error ? error.message : "Logout failed",
            });
          }
        },

        clearError() {
          dispatch({ type: "CLEAR_ERROR" });
        },

        validatePhoneNumber(phone: string) {
          return authViewModel.validatePhoneNumber(phone);
        },

        validateOtpCode(code: string) {
          return authViewModel.validateOtpCode(code);
        },
      }),
      []
    );

    return (
      <AuthContext.Provider value={{ ...state, ...actions }}>
        {children}
      </AuthContext.Provider>
    );
  };
}

// Hook to use Auth Context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
