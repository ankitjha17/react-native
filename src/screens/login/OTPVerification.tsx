import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../../auth/AuthContext";
import colors from "../../constants/colors";

import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import { useAuthNavigation } from "../../hooks/useAuthNavigation";
import ErrorToast from "../../components/ErrorToast";
import { useErrorToast } from "../../hooks/useErrorToast";
import { useCMSData } from "../../hooks/queries/useCMSData";
import Button from "@/src/components/Common/Button";
import LoginHeader from "@/src/components/Common/LoginHeader";

const OTPVerification = () => {
  const { width } = useWindowDimensions();
  const { goBack } = useAuthNavigation();
  const route = useRoute();
  const params = (route as any).params as { phone?: string } | undefined;

  const phone = params?.phone || "";

  const maskedPhone = React.useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 6) return digits;
    return `${digits.slice(0, 2)}***${digits.slice(-4)}`;
  }, [phone]);

  const {
    verifyOtp,
    resendOtp,
    loading,
    error: authError,
    validateOtpCode,
  } = useAuth();

  const {
    error: toastError,
    errorType,
    showApiError,
    clearError: clearToastError,
  } = useErrorToast();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const [timeLeft, setTimeLeft] = useState(60);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inputs = Array.from({ length: 6 }, () => useRef<TextInput>(null));
  const codeRef = useRef(code);
  const inputsRef = useRef(inputs);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    inputsRef.current = inputs;
  }, [inputs]);

  /** CMS data */
  const { data: cmsData } = useCMSData({ pLevel: "" });
  // Extract dynamic values with fallbacks
  const validationScreenData = cmsData?.validationScreen;
  const title = validationScreenData?.title || "Enter Verification Code";
  const description =
    validationScreenData?.description ||
    "We have sent a 6-digit verification code to ";
  const text = validationScreenData?.text || "Didn't receive code?";
  const btnText = validationScreenData?.btnText || "Verify";
  const resendText = validationScreenData?.resend || "Resend";
  const logoUrl = validationScreenData?.logoUrl;

  /** OTP change handler */
  const handleChange = (value: string, index: number) => {
    const sanitized = value.replace(/\D/g, "");

    // 6-digit paste
    if (sanitized.length === 6 && value.length > 1) {
      const arr = sanitized.split("").slice(0, 6);
      setCode(arr);
      inputsRef.current[5].current?.focus();
      return;
    }

    // Single digit typing
    const next = [...codeRef.current];
    next[index] = sanitized.slice(-1);
    setCode(next);

    if (sanitized && index < 5) {
      inputsRef.current[index + 1].current?.focus();
    }
  };

  /** Backspace handling */
  const handleKeyPress = (key: string, index: number) => {
    if (key !== "Backspace") return;

    const next = [...codeRef.current];

    if (next[index]) {
      next[index] = "";
      setCode(next);
      return;
    }

    if (index > 0) {
      inputsRef.current[index - 1].current?.focus();
    }
  };

  /** Verify OTP */
  const handleVerify = async () => {
    const otpCode = codeRef.current.join("");

    const validation = validateOtpCode(otpCode);
    if (!validation.isValid) {
      showApiError(validation.error || "Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await verifyOtp({ code: otpCode, phone });
    } catch {
      /* handled by AuthContext */
    }
  };

  /** Timer effect - counts down from 60 to 0 */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /** Clear OTP when timer expires - separate effect for reliable state update */
  useEffect(() => {
    if (timeLeft === 0) {
      // Clear ALL digits when timer expires, regardless of how many are entered
      const currentCode = codeRef.current.join("");
      if (currentCode.length > 0) {
        setCode(["", "", "", "", "", ""]);
        // Small delay to ensure state update before focusing
        setTimeout(() => {
          inputsRef.current[0].current?.focus();
        }, 0);
      }
    }
  }, [timeLeft]);

  /** Show error toast from API */
  useEffect(() => {
    if (authError) showApiError(authError);
  }, [authError, showApiError]);

  /** Timer format */
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  /** Resend OTP */
  const handleResend = async () => {
    if (!phone) return showApiError("Phone number is required");

    try {
      await resendOtp({ phone });

      setCode(["", "", "", "", "", ""]);
      inputsRef.current[0].current?.focus();

      setTimeLeft(60);
    } catch {
      showApiError("Failed to resend OTP");
    }
  };

  const contentWidth = width - 40;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={[styles.internalContainer, { width: contentWidth }]}>
        <View style={styles.spacer32} />

        {/* Header */}
        <LoginHeader logoUrl={logoUrl} onBack={goBack} />

        {/* Title */}
        <View style={styles.logoAndTitle}>
          <Text style={styles.headingOne}>{title}</Text>
          <Text style={styles.headingTwo}>
            {description}
            {maskedPhone}
          </Text>
        </View>

        {/* OTP Inputs */}
        <View style={styles.form}>
          <View style={styles.otpRow}>
            {code.map((char, idx) => (
              <TextInput
                key={idx}
                ref={inputs[idx]}
                value={char}
                onChangeText={(v) => handleChange(v, idx)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, idx)
                }
                keyboardType="number-pad"
                maxLength={6}
                style={[
                  styles.otpBox,
                  focusedIndex === idx && styles.otpBoxFocused,
                ]}
                placeholder="-"
                placeholderTextColor={colors.gray600}
                textAlign="center"
                autoFocus={idx === 0}
                selectTextOnFocus
                onFocus={() => setFocusedIndex(idx)}
                onBlur={() => setFocusedIndex(null)}
              />
            ))}
          </View>

          {/* Timer + Resend */}
          <View style={styles.dontreceiveandandresend}>
            <Text style={styles.rememberText}>{formatTime(timeLeft)}</Text>

            <View style={styles.resendRow}>
              <Text style={styles.dontreceiveText}>{text}</Text>

              <TouchableOpacity
                onPress={handleResend}
                disabled={timeLeft !== 0 || loading}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text
                  style={[
                    styles.resendText,
                    timeLeft !== 0 && { color: colors.gray500 },
                  ]}
                >
                  {resendText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            text={btnText}
            loading={loading}
            onPress={handleVerify}
            disabled={code.join("").length !== 6 || loading}
          />
        </View>
      </View>
      <ErrorToast
        message={toastError || ""}
        type={errorType}
        visible={!!toastError}
        onDismiss={clearToastError}
        duration={5000}
        position="bottom"
      />
    </SafeAreaView>
  );
};

export default OTPVerification;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  internalContainer: {
    alignItems: "center",
    gap: 32,
  },
  spacer32: {
    minHeight: 32,
  },
  logoAndTitle: {
    gap: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  headingOne: {
    fontFamily: fonts.family.medium,
    fontSize: typography.headingText,
    color: colors.black,
  },
  headingTwo: {
    fontFamily: fonts.family.regular,
    fontSize: typography.headingText1,
    color: colors.gray600,
    maxWidth: 256,
    textAlign: "center",
  },
  form: {
    width: "100%",
    gap: 16,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  otpBox: {
    width: "15%",
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: "#F6F6F6",
    fontSize: typography.serviceText,
    fontFamily: fonts.family.regular,
    textAlign: "center",
    color: colors.black,
  },
  otpBoxFocused: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.button,
  },
  dontreceiveandandresend: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  dontreceiveText: {
    fontFamily: fonts.family.regular,
    fontSize: typography.headingText1,
    color: colors.gray500,
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  resendText: {
    fontFamily: fonts.family.regular,
    fontSize: typography.headingText1,
    color: colors.deeptealColor,
  },
  rememberText: {
    fontFamily: fonts.family.regular,
    fontSize: typography.serviceText,
    color: colors.gray600,
  },
});
