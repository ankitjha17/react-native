import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import { useAuthNavigation } from "../../hooks/useAuthNavigation";
import { useAuth } from "../../auth/AuthContext";
import { ENV_NAME } from "../../config/env";
import { useCMSData } from "../../hooks/queries/useCMSData";
import { ReusableImage } from "../../components/ReusableImage";
import Button from "@/src/components/Common/Button";
import LoginHeader from "@/src/components/Common/LoginHeader";

const LoginScreen = () => {
  const { width } = useWindowDimensions();
  const { navigateToOTP, goBack } = useAuthNavigation();
  const {
    requestLogin,
    loading,
    error: authError,
    clearError,
    validatePhoneNumber,
  } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  // Fetch CMS data for LoginScreen
  const { data: cmsData } = useCMSData({ pLevel: "" });
  const loginScreenData = cmsData?.loginScreen;

  // Extract dynamic values with fallbacks
  const title = loginScreenData?.title || "Log into your account";
  const subtitle =
    loginScreenData?.subtitle ||
    "Your policies, claims, and benefits—all in one place.";
  const description =
    loginScreenData?.description ||
    "A 4-digit OTP will be sent via SMS to verify your phone number";
  const formText = loginScreenData?.formText || "Enter Mobile Number";
  const btnText = loginScreenData?.btnText || "Login";
  const logoUrl = loginScreenData?.logoUrl;
  const flagUrl = loginScreenData?.flagUrl;

  const handleLogin = async () => {
    // Clear any previous errors
    setError("");
    clearError();

    // Validate phone number using ViewModel (business logic)
    console.log("Login: handleLogin - Validating phone number...");
    const validation = validatePhoneNumber(phoneNumber);
    console.log("Login: handleLogin - Validation result:", validation);

    if (!validation.isValid) {
      console.log("Login: handleLogin - Validation failed, setting error");
      setError(validation.error || "Please enter a valid Israeli phone number");
      return;
    }

    console.log(
      "Login: handleLogin - Validation passed, navigating to OTP screen immediately"
    );

    // Navigate to OTP screen immediately (don't wait for API response)
    navigateToOTP(phoneNumber);

    // Call API to send OTP in the background
    try {
      console.log(
        "Login: handleLogin - Calling requestLogin API with phone:",
        phoneNumber
      );
      await requestLogin({ phone: phoneNumber });
      console.log("Login: handleLogin - requestLogin completed successfully");
    } catch (err) {
      console.error("Login: handleLogin - Exception caught:", err);
      // Error will be handled by AuthContext and can be shown on OTP screen if needed
    }
  };

  // Show auth error if it exists (for errors that occur after navigation)
  React.useEffect(() => {
    if (authError) {
      console.error("Login: Auth error detected:", authError);
      // Error will be shown on OTP screen, but we can also show it here if user navigates back
    }
  }, [authError]);

  const handleChangePhone = (value: string) => {
    console.log("📱 Login: handleChangePhone - Raw input:", value);
    const digitsOnly = value.replace(/\D/g, "");
    console.log(
      "📱 Login: handleChangePhone - After removing non-digits:",
      digitsOnly
    );
    setPhoneNumber(digitsOnly);
    if (digitsOnly.length === 0) {
      console.log("📱 Login: handleChangePhone - Empty input, clearing error");
      setError("");
      return;
    }
    // Use ViewModel validation (business logic)
    const validation = validatePhoneNumber(digitsOnly);
    console.log("📱 Login: handleChangePhone - Validation result:", validation);
    setError(
      validation.isValid
        ? ""
        : validation.error || "Please enter a valid phone number"
    );
  };

  const horizontalPadding = 20;
  const contentWidth = width - horizontalPadding * 2;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={[styles.internalContainer, { width: contentWidth }]}>
        <View style={styles.spacer32} />
        {/* Logo & Title Section */}
        <View style={styles.logoAndTitle}>
          <LoginHeader logoUrl={logoUrl} onBack={goBack} />
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
            {subtitle}
          </Text>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.phoneContainer}>
            <TextInput
              style={styles.phoneInput}
              placeholder={formText}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              value={phoneNumber}
              onChangeText={handleChangePhone}
              maxLength={10}
              placeholderTextColor={colors.gray500}
              allowFontScaling
              maxFontSizeMultiplier={1.2}
            />
            {/* Divider + Country code and flag on the right */}
            <View style={styles.rightCodeContainer}>
              <View style={styles.divider} />
              <Text
                style={styles.countryCode}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              >
                +972
              </Text>
              <ReusableImage
                uri={flagUrl}
                fallback={{ uri: "https://flagcdn.com/w20/il.png" }}
                style={styles.flagIcon}
                resizeMode="contain"
                showLoader={false}
              />
            </View>
          </View>
          {error ? (
            <Text
              style={styles.errorText}
              allowFontScaling
              maxFontSizeMultiplier={1.2}
            >
              {error}
            </Text>
          ) : null}
          <Text
            style={styles.infoText}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            {description}
          </Text>
        </View>

        {/* Login Button */}
        <View style={styles.fullWidth}>
          <Button text={btnText} onPress={handleLogin} loading={loading} />
          {/* Environment Name Display */}
          <Text
            style={styles.envText}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            Environment: {ENV_NAME}
          </Text>
        </View>
      </View>
      {/* </View> */}
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    alignSelf: "center",
  },
  spacer32: {
    minHeight: 32,
  },
  logoAndTitle: {
    gap: 14,
    alignItems: "center",
    marginBottom: 24,
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
    color: colors.gray500,
    maxWidth: 256,
    minHeight: 34,
    alignSelf: "center",
  },
  form: {
    width: "100%",
    gap: 20,
  },
  inputSection: {
    width: "100%",
    gap: 10,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 0,
  },
  rightCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.gray500,
    marginHorizontal: 8,
    opacity: 0.5,
  },
  flagIcon: {
    width: 24,
    height: 16,
    marginRight: 6,
  },
  countryCode: {
    marginRight: 8,
    fontWeight: "600",
    color: colors.gray500,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    textAlign: "right",
    writingDirection: "rtl",
  },
  inputWrapper: {
    width: "100%",
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: colors.toggleBackground,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: typography.cardHeadText2,
    color: colors.black,
  },
  inputIcon: {
    marginRight: 12,
  },
  trailingIconButton: {
    marginLeft: 12,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  infoText: {
    color: colors.gray500,
    textAlign: "right",
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.2),
    letterSpacing: 0,
    alignSelf: "flex-end",
    maxWidth: "100%",
    marginBottom: 20,
  },
  fullWidth: {
    width: "100%",
  },
  envText: {
    marginTop: 16,
    textAlign: "center",
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 14,
    color: colors.gray500,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "center",
  },
});
