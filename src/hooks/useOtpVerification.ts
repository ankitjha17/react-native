import { useState, useCallback } from "react";
import { authViewModel } from "../viewmodels/AuthViewModel";

interface UseOtpVerificationReturn {
  code: string[];
  error: string | null;
  loading: boolean;
  setCode: (code: string[]) => void;
  validateCode: (code: string) => boolean;
  handleVerify: (otpCode: string, phone: string) => Promise<void>;
  handleResend: (phone: string) => Promise<void>;
  clearError: () => void;
}

export function useOtpVerification(): UseOtpVerificationReturn {
  const [code, setCodeState] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const setCode = useCallback(
    (newCode: string[]) => {
      setCodeState(newCode);
      if (error) {
        setError(null);
      }
    },
    [error]
  );

  const validateCode = useCallback((otpCode: string): boolean => {
    const validation = authViewModel.validateOtpCode(otpCode);
    if (!validation.isValid) {
      setError(validation.error || "Invalid OTP code");
      return false;
    }
    setError(null);
    return true;
  }, []);

  const handleVerify = useCallback(
    async (otpCode: string, phone: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const isValid = validateCode(otpCode);
        if (!isValid) {
          throw new Error(error || "Invalid OTP code");
        }

        if (!phone) {
          throw new Error("Phone number is required");
        }

        await authViewModel.verifyOtp(phone, otpCode);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "OTP verification failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [validateCode, error]
  );

  const handleResend = useCallback(async (phone: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      if (!phone) {
        throw new Error("Phone number is required");
      }

      await authViewModel.resendOtp(phone);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resend OTP";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    code,
    error,
    loading,
    setCode,
    validateCode,
    handleVerify,
    handleResend,
    clearError,
  };
}
