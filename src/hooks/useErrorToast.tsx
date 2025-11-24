import { useState, useCallback } from "react";
import { ErrorType } from "../components/ErrorToast";

interface UseErrorToastReturn {
  error: string | null;
  errorType: ErrorType;
  showError: (message: string, type?: ErrorType) => void;
  showNetworkError: () => void;
  showApiError: (message: string) => void;
  clearError: () => void;
}

export function useErrorToast(): UseErrorToastReturn {
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>("error");

  const showError = useCallback(
    (message: string, type: ErrorType = "error") => {
      setError(message);
      setErrorType(type);
    },
    []
  );

  const showNetworkError = useCallback(() => {
    setError("Network error. Please check your connection.");
    setErrorType("network");
  }, []);

  const showApiError = useCallback((message: string) => {
    setError(message);
    setErrorType("api");
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    errorType,
    showError,
    showNetworkError,
    showApiError,
    clearError,
  };
}
