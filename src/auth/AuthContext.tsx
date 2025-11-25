import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  ReactNode,
  useEffect,
  useState,
} from "react";
import type { Session, AuthStatus, LoginParams, OtpParams } from "./types";
import {
  useSendOtp,
  useVerifyOtp,
  useResendOtp,
  useLogout,
} from "../modules/auth/auth.hooks";
import {
  validatePhoneNumber,
  validateOtpCode,
} from "../modules/auth/auth.validators";
import { getCurrentSession } from "../modules/auth/auth.storage";

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

// Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  // React Query hooks
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const logoutMutation = useLogout();

  // Bootstrap on mount (only once)
  useEffect(() => {
    if (!isBootstrapped) {
      setIsBootstrapped(true);
      getCurrentSession()
        .then((session) => {
          dispatch({ type: "BOOTSTRAP_SUCCESS", session });
        })
        .catch((error) => {
          dispatch({
            type: "BOOTSTRAP_ERROR",
            error: error instanceof Error ? error.message : "Bootstrap failed",
          });
        });
    }
  }, [isBootstrapped]);

  // Update session when verifyOtp succeeds
  useEffect(() => {
    if (
      verifyOtpMutation.isSuccess &&
      verifyOtpMutation.data &&
      verifyOtpMutation.variables
    ) {
      const session: Session = {
        accessToken: verifyOtpMutation.data.accessToken,
        refreshToken: verifyOtpMutation.data.refreshToken,
        userPhone: verifyOtpMutation.variables.phone,
      };
      dispatch({ type: "OTP_VERIFY_SUCCESS", session });
    }
  }, [verifyOtpMutation.isSuccess]);

  // Update state when logout succeeds
  useEffect(() => {
    if (logoutMutation.isSuccess) {
      dispatch({ type: "LOGOUT_SUCCESS" });
    }
  }, [logoutMutation.isSuccess]);

  // Use refs to store mutation functions to avoid re-renders
  const sendOtpRef = React.useRef(sendOtpMutation.mutateAsync);
  const verifyOtpRef = React.useRef(verifyOtpMutation.mutateAsync);
  const resendOtpRef = React.useRef(resendOtpMutation.mutateAsync);
  const logoutRef = React.useRef(logoutMutation.mutateAsync);
  const sessionRef = React.useRef(state.session);

  // Update refs when they change
  React.useEffect(() => {
    sendOtpRef.current = sendOtpMutation.mutateAsync;
    verifyOtpRef.current = verifyOtpMutation.mutateAsync;
    resendOtpRef.current = resendOtpMutation.mutateAsync;
    logoutRef.current = logoutMutation.mutateAsync;
    sessionRef.current = state.session;
  });

  const actions: AuthActions = useMemo(
    () => ({
      async bootstrap() {
        try {
          dispatch({ type: "BOOTSTRAP_START" });
          const session = await getCurrentSession();
          dispatch({ type: "BOOTSTRAP_SUCCESS", session });
        } catch (error) {
          dispatch({
            type: "BOOTSTRAP_ERROR",
            error: error instanceof Error ? error.message : "Bootstrap failed",
          });
        }
      },

      completeOnboarding() {
        dispatch({ type: "COMPLETE_ONBOARDING" });
      },

      async requestLogin(params: LoginParams) {
        if (!params.phone) {
          dispatch({
            type: "LOGIN_ERROR",
            error: "Phone number is required",
          });
          return;
        }

        try {
          dispatch({ type: "LOGIN_START" });
          await sendOtpRef.current(params.phone);
          dispatch({ type: "LOGIN_SUCCESS" });
        } catch (error) {
          dispatch({
            type: "LOGIN_ERROR",
            error: error instanceof Error ? error.message : "Login failed",
          });
        }
      },

      async verifyOtp(params: OtpParams) {
        if (!params.phone || !params.code) {
          dispatch({
            type: "OTP_VERIFY_ERROR",
            error: "Phone number and OTP code are required",
          });
          return;
        }

        try {
          dispatch({ type: "OTP_VERIFY_START" });
          await verifyOtpRef.current({
            phone: params.phone,
            otp: params.code,
          });
          // Session will be updated via useEffect when mutation succeeds
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
        if (!params.phone) {
          dispatch({
            type: "LOGIN_ERROR",
            error: "Phone number is required",
          });
          return;
        }

        try {
          dispatch({ type: "LOGIN_START" });
          await resendOtpRef.current(params.phone);
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

          // Get refresh token from current session
          const session = sessionRef.current || (await getCurrentSession());
          if (session?.refreshToken) {
            await logoutRef.current({
              refreshToken: session.refreshToken,
            });
          } else {
            // If no refresh token, just clear local session
            await logoutRef.current({
              refreshToken: "",
            });
          }
          // State will be updated via useEffect when mutation succeeds
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
        return validatePhoneNumber(phone);
      },

      validateOtpCode(code: string) {
        return validateOtpCode(code);
      },
    }),
    [] // Empty deps - using refs instead
  );

  // Update loading state based on mutations
  const loading = useMemo(
    () =>
      state.loading ||
      sendOtpMutation.isPending ||
      verifyOtpMutation.isPending ||
      resendOtpMutation.isPending ||
      logoutMutation.isPending,
    [
      state.loading,
      sendOtpMutation.isPending,
      verifyOtpMutation.isPending,
      resendOtpMutation.isPending,
      logoutMutation.isPending,
    ]
  );

  return (
    <AuthContext.Provider value={{ ...state, loading, ...actions }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use Auth Context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
