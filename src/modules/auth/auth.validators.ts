/**
 * Auth Validators
 * Pure validation functions for phone numbers and OTP codes
 */

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
}

export interface OtpValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate Israeli phone number
 * Accepts phone with leading 0 (e.g., 0501234567)
 */
export function validatePhoneNumber(phone: string): PhoneValidationResult {
  if (!phone || phone.trim().length === 0) {
    return {
      isValid: false,
      error: "Phone number is required",
    };
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");

  // Israeli phone validation
  // User enters phone with leading 0 (e.g., 0501234567) since +972 is already shown in UI

  // Mobile: 05X + 7 digits = 10 digits total (e.g., 0501234567)
  const mobileRegex = /^05\d{8}$/;

  // Landline: 02/03/04/08/09 + 7-8 digits = 9-10 digits total (e.g., 021234567)
  const landlineRegex = /^0[23489]\d{7,8}$/;

  // Check if matches mobile or landline pattern
  if (mobileRegex.test(digitsOnly) || landlineRegex.test(digitsOnly)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: "Please enter a valid Israeli phone number",
  };
}

/**
 * Validate OTP code
 */
export function validateOtpCode(code: string): OtpValidationResult {
  if (!code || code.trim().length === 0) {
    return {
      isValid: false,
      error: "OTP code is required",
    };
  }

  // OTP should be 6 digits
  const otpRegex = /^\d{6}$/;
  if (!otpRegex.test(code)) {
    return {
      isValid: false,
      error: "OTP must be 6 digits",
    };
  }

  return { isValid: true };
}

/**
 * Format phone number to identifier for API
 * Converts "0501234567" to "9720501234567"
 */
export function formatPhoneToIdentifier(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.startsWith("972")) {
    return digitsOnly;
  }
  if (digitsOnly.startsWith("0")) {
    return `972${digitsOnly.slice(1)}`;
  }
  return `972${digitsOnly}`;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length === 0) {
    return "";
  }

  // Format as: 05X-XXX-XXXX for mobile or 0X-XXX-XXXX for landline
  if (digitsOnly.startsWith("5") && digitsOnly.length === 9) {
    return `0${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2, 5)}-${digitsOnly.slice(5)}`;
  } else if (digitsOnly.length >= 8) {
    return `0${digitsOnly.slice(0, 1)}-${digitsOnly.slice(1, 4)}-${digitsOnly.slice(4)}`;
  }

  return digitsOnly;
}

/**
 * Mask phone number for display (privacy)
 */
export function maskPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) {
    return digits;
  }
  return `${digits.slice(0, 2)}***${digits.slice(-4)}`;
}
