import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../constants/colors";
import typography from "../../constants/typography";
import fonts from "../../constants/fonts";
import { useAuth } from "../../auth/AuthContext";
import { useAuthNavigation } from "../../hooks/useAuthNavigation";
import { useCMSData } from "../../hooks/queries/useCMSData";
import { ReusableImage } from "../../components/ReusableImage";

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  duration: number;
}

// Dummy steps (fallback)
const dummySteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Insure your Future",
    subtitle: "with InsurUp",
    imageUrl: "https://picsum.photos/300/400?random=1",
    duration: 4000,
  },
  {
    id: 2,
    title: "Protect your Family",
    subtitle: "with comprehensive coverage",
    imageUrl: "https://picsum.photos/300/400?random=2",
    duration: 4000,
  },
  {
    id: 3,
    title: "Secure your Dreams",
    subtitle: "with InsurUp insurance",
    imageUrl: "https://picsum.photos/300/400?random=3",
    duration: 4000,
  },
];

const fallbackImage = require("../../assets/images/login_screen_logo.png");

const OnboardingScreen = () => {
  const { width } = useWindowDimensions();
  const { navigateToLogin } = useAuthNavigation();
  const { completeOnboarding } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);

  const { data: cmsData, isLoading } = useCMSData({ pLevel: "" });
  const onboardingData = cmsData?.onboarding;

  const steps =
    onboardingData?.steps && onboardingData.steps.length > 0
      ? onboardingData.steps
      : dummySteps;

  const logoUrl = onboardingData?.logoUrl || null;

  const currentStepData = useMemo(
    () => steps[currentStep],
    [steps, currentStep]
  );

  const handleSkip = () => {
    completeOnboarding();
    navigateToLogin();
  };

  const contentWidth = width - 40;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image */}
      <ReusableImage
        uri={currentStepData?.imageUrl || null}
        fallback={fallbackImage}
        style={styles.backgroundImage}
        resizeMode="cover"
        showLoader={false}
      />

      {/* HEADER (Skip only) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <ReusableImage
            uri={logoUrl}
            fallback={require("../../assets/images/login_screen_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.textContainer, { width: contentWidth }]}>
          <Text style={styles.title}>
            {currentStepData?.title} {currentStepData?.subtitle}
          </Text>
        </View>
      </View>

      {/* BOTTOM NAVIGATION WITH DASHES */}
      <View style={styles.bottomNav}>
        {/* Previous */}
        <TouchableOpacity
          style={[
            styles.navButton,
            currentStep === 0 && styles.navButtonDisabled,
          ]}
          disabled={currentStep === 0}
          onPress={() => setCurrentStep((prev) => prev - 1)}
        >
          <Text
            style={[
              styles.navButtonText,
              currentStep === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        {/* Dashes */}
        <View style={styles.dashContainer}>
          {steps.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentStep(index)}
              style={[styles.dash, index === currentStep && styles.activeDash]}
            />
          ))}
        </View>

        {/* Next */}
        <TouchableOpacity
          style={[
            styles.navButton,
            currentStep === steps.length - 1 && styles.navButtonDisabled,
          ]}
          disabled={currentStep === steps.length - 1}
          onPress={() => setCurrentStep((prev) => prev + 1)}
        >
          <Text
            style={[
              styles.navButtonText,
              currentStep === steps.length - 1 && styles.navButtonTextDisabled,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

/* -------------------------------- STYLES ------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: fonts.family.regular,
    fontSize: typography.serviceText,
    color: colors.gray600,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  skipButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skipText: {
    fontFamily: fonts.family.medium,
    fontSize: 16,
    color: colors.black,
  },

  /* MAIN CONTENT */
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  logoContainer: {
    position: "absolute",
    top: 10,
    left: 20,
  },
  logo: {
    width: 163,
    height: 65,
  },

  textContainer: {
    position: "absolute",
    top: 80,
    left: 20,
    maxWidth: 329,
  },
  title: {
    fontFamily: fonts.family.medium,
    fontSize: 28,
    lineHeight: 33.6,
    color: colors.black,
  },

  /* BOTTOM NAVIGATION */
  bottomNav: {
    position: "absolute",
    bottom: 20, // ABOVE SAFE AREA
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  navButtonText: {
    fontFamily: fonts.family.medium,
    fontSize: 16,
    color: colors.black,
  },
  navButtonTextDisabled: {
    color: colors.gray600,
  },

  /* DASHES (progress bars) */
  dashContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dash: {
    width: 38,
    height: 4,
    borderRadius: 30,
    backgroundColor: colors.gray600,
  },
  activeDash: {
    backgroundColor: colors.orange,
  },
});
