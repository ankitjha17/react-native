import { useState, useCallback } from "react";
import { authViewModel } from "../viewmodels/AuthViewModel";
import type { LoginParams, LoginResponse } from "../auth/types";

interface UseLoginReturn {
  phoneNumber: string;
  error: string | null;
  loading: boolean;
  setPhoneNumber: (phone: string) => void;
  validatePhone: (phone: string) => boolean;
  handleLogin: (params: LoginParams) => Promise<LoginResponse>;
  clearError: () => void;
}

export function useLogin(): UseLoginReturn {
  const [phoneNumber, setPhoneNumberState] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const setPhoneNumber = useCallback(
    (phone: string) => {
      const digitsOnly = phone.replace(/\D/g, "");
      setPhoneNumberState(digitsOnly);

      if (error) {
        setError(null);
      }
    },
    [error]
  );

  const validatePhone = useCallback((phone: string): boolean => {
    const validation = authViewModel.validatePhoneNumber(phone);
    if (!validation.isValid) {
      setError(validation.error || "Invalid phone number");
      return false;
    }
    setError(null);
    return true;
  }, []);

  const handleLogin = useCallback(
    async (params: LoginParams): Promise<LoginResponse> => {
      setLoading(true);
      setError(null);

      try {
        if (params.phone) {
          const isValid = validatePhone(params.phone);
          if (!isValid) {
            throw new Error(error || "Invalid phone number");
          }
        }

        const response = await authViewModel.requestLogin(params);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Login failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [validatePhone, error]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    phoneNumber,
    error,
    loading,
    setPhoneNumber,
    validatePhone,
    handleLogin,
    clearError,
  };
}
