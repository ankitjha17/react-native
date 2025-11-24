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
import { Ionicons as Icon } from "@expo/vector-icons";
import { useAuth } from "../../auth/AuthContext";
import colors from "../../constants/colors";

import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import { useAuthNavigation } from "../../hooks/useAuthNavigation";
import ErrorToast from "../../components/ErrorToast";
import { useErrorToast } from "../../hooks/useErrorToast";
import { useCMSData } from "../../hooks/queries/useCMSData";
import { ReusableImage } from "../../components/ReusableImage";
import Button from "@/src/components/Common/Button";

const OTPVerification = () => {
  const { width } = useWindowDimensions();
  const { goBack } = useAuthNavigation();
  const route = useRoute();
  const params = (route as any).params as { phone?: string } | undefined;
  const maskedPhone = React.useMemo(() => {
    const raw = params?.phone ?? "";
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 6) return digits;
    return `${digits.slice(0, 2)}***${digits.slice(-4)}`;
  }, [params]);
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
  const inputs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResend, setShowResend] = useState(false);

  // Fetch CMS data for ValidationScreen
  const { data: cmsData } = useCMSData({ pLevel: "" });
  const validationScreenData = cmsData?.validationScreen;

  // Extract dynamic values with fallbacks
  const title = validationScreenData?.title || "Enter Verification Code";
  const description =
    validationScreenData?.description ||
    "We have sent a 6-digit verification code to ";
  const text = validationScreenData?.text || "Didn't receive code?";
  const btnText = validationScreenData?.btnText || "Verify";
  const resendText = validationScreenData?.resend || "Resend";
  const logoUrl = validationScreenData?.logoUrl;
  const handleChange = (value: string, index: number) => {
    const sanitized = value.replace(/\D/g, "");
    const next = [...code];

    if (code[index] && sanitized.length === 1) {
      next[index] = sanitized;
      setCode(next);
      return;
    }
    if (sanitized.length <= 1) {
      next[index] = sanitized;
      setCode(next);
      if (sanitized && index < inputs.length - 1) {
        inputs[index + 1].current?.focus();
      }
      return;
    }
    let cursor = index;
    for (let i = 0; i < sanitized.length && cursor < next.length; i++) {
      next[cursor] = sanitized[i];
      cursor++;
    }
    setCode(next);
    if (cursor <= inputs.length - 1) {
      inputs[cursor].current?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace") {
      if (code[index]) {
        const next = [...code];
        next[index] = "";
        setCode(next);
        return;
      }
      if (index > 0) {
        inputs[index - 1].current?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpCode = code.join("");
    console.log("OTP Verification: Attempting to verify code:", otpCode);

    const validation = validateOtpCode(otpCode);
    console.log("OTP Verification: Validation result:", validation);

    if (!validation.isValid) {
      console.log("OTP Verification: Validation failed:", validation.error);
      showApiError(validation.error || "Please enter a valid 6-digit OTP code");
      return;
    }

    try {
      console.log("OTP Verification: Calling verifyOtp...");
      const phoneNumber = params?.phone || "";
      await verifyOtp({ code: otpCode, phone: phoneNumber });
      console.log(
        "OTP Verification: Success! Auth status should change to authenticated"
      );
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  useEffect(() => {
    console.log("OTP: Timer started");
    setTimeLeft(60);
    setShowResend(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          console.log("OTP: Timer ended, showing resend");
          setShowResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      console.log("OTP: Timer cleared");
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (authError) {
      showApiError(authError);
    }
  }, [authError, showApiError]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle resend OTP
  const handleResend = async () => {
    const phoneNumber = params?.phone || "";
    if (!phoneNumber) {
      showApiError("Phone number is required");
      return;
    }

    console.log("OTP: Resending OTP for phone:", phoneNumber);
    try {
      await resendOtp({ phone: phoneNumber });
      console.log("OTP: Resend successful, restarting timer");
      // Restart timer
      setTimeLeft(60);
      setShowResend(false);
      // Success message can be shown via a success toast if needed
    } catch (err) {
      console.error("OTP: Resend failed:", err);
      showApiError(err instanceof Error ? err.message : "Failed to resend OTP");
    }
  };

  const horizontalPadding = 20;
  const contentWidth = width - horizontalPadding * 2;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ErrorToast
        message={toastError || ""}
        type={errorType}
        visible={!!toastError}
        onDismiss={clearToastError}
        duration={5000}
        position="top"
      />
      <View style={[styles.internalContainer, { width: contentWidth }]}>
        <View style={styles.spacer32} />
        {/* Header: Back + Centered Logo */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={goBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.headerIconButton}
          >
            <Icon name="chevron-back-outline" size={24} color={colors.black} />
          </TouchableOpacity>
          <ReusableImage
            uri={logoUrl}
            fallback={require("../../assets/images/login_screen_logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          {/* Right placeholder to keep logo perfectly centered */}
          <View style={styles.headerRightPlaceholder} />
        </View>
        {/* Title Section */}
        <View style={styles.logoAndTitle}>
          <Text
            style={styles.headingOne}
            allowFontScaling
            maxFontSizeMultiplier={1.3}
          >
            {title}
          </Text>
          <Text
            style={styles.headingTwo}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            {description}
            {maskedPhone}
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* OTP Boxes */}
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
                maxLength={1}
                style={[
                  styles.otpBox,
                  focusedIndex === idx && styles.otpBoxFocused,
                ]}
                placeholder="-"
                placeholderTextColor={colors.gray600}
                textAlign="center"
                returnKeyType="next"
                autoFocus={idx === 0}
                selectTextOnFocus
                onFocus={() => setFocusedIndex(idx)}
                onBlur={() => setFocusedIndex(null)}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              />
            ))}
          </View>

          <View style={styles.dontreceiveandandresend}>
            {!showResend ? (
              <View style={styles.rememberContainer}>
                <Text
                  style={styles.rememberText}
                  allowFontScaling
                  maxFontSizeMultiplier={1.2}
                >
                  {formatTime(timeLeft)}
                </Text>
              </View>
            ) : (
              <View style={styles.resendRow}>
                <Text
                  style={styles.dontreceiveText}
                  allowFontScaling
                  maxFontSizeMultiplier={1.2}
                >
                  {text}
                </Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={handleResend}
                  disabled={loading}
                >
                  <Text
                    style={styles.resendText}
                    allowFontScaling
                    maxFontSizeMultiplier={1.2}
                  >
                    {resendText}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Verify Button */}
          <Button
            text={btnText}
            onPress={handleVerify}
            loading={loading}
            disabled={code.join("").length !== 6}
          />
        </View>
      </View>
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
    overflow: "hidden",
  },
  internalContainer: {
    alignItems: "center",
    gap: 32,
    alignSelf: "center",
  },
  spacer32: {
    minHeight: 32,
  },
  logoAndTitle: {
    gap: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    // marginBottom: 12,
  },
  headerIconButton: {
    width: 32,
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 100,
    minHeight: 40,
    aspectRatio: 2.5, // Maintains logo proportions
  },
  headerRightPlaceholder: {
    width: 32,
    minHeight: 32,
  },
  headingOne: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: typography.headingText,
    textAlign: "center",
    color: colors.black,
    // marginBottom: 2,
  },
  headingTwo: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: typography.headingText1,
    textAlign: "center",
    color: colors.gray600,
    maxWidth: 256,
    minHeight: 34,
    alignSelf: "center",
  },
  form: {
    width: "100%",
    gap: 16,
  },
  otpRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 6,
  },
  otpBox: {
    width: "15%",
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: "#F6F6F6",
    fontSize: typography.serviceText,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    lineHeight: Math.round(typography.serviceText * 1.2),
    letterSpacing: 0,
    textAlign: "center",
    color: colors.black,
    paddingRight: 16,
    paddingLeft: 16,
  },
  otpBoxFocused: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.button,
  },
  inputWrapper: {
    width: "100%",
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: "#F6F6F6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 14, // prevents clipping at larger text sizes
    fontSize: typography.cardHeadText2,
    color: colors.black,
  },
  inputIcon: {
    marginRight: 12,
  },
  trailingIconButton: {
    marginLeft: 12,
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
    fontWeight: fonts.weight.regular,
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
    fontWeight: fonts.weight.regular,
    fontSize: typography.headingText1,
    color: colors.deeptealColor,
  },
  rememberText: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: typography.serviceText,
    color: colors.gray600,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
