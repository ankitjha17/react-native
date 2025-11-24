import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
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
  duration: number; // milliseconds
}

// Feature flags (these can later come from Remote Config / LaunchDarkly)
const FEATURE_FLAGS = {
  autoAdvanceEnabled: true,
};

// Dummy data - will be replaced with API data
const dummySteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Insure your Future",
    subtitle: "with InsurUp",
    imageUrl: "https://picsum.photos/300/400?random=1", // Lorem Picsum placeholder
    duration: 4000,
  },
  {
    id: 2,
    title: "Protect your Family",
    subtitle: "with comprehensive coverage",
    imageUrl: "https://picsum.photos/300/400?random=2", // Lorem Picsum placeholder
    duration: 4000,
  },
  {
    id: 3,
    title: "Secure your Dreams",
    subtitle: "with InsurUp insurance",
    imageUrl: "https://picsum.photos/300/400?random=3", // Lorem Picsum placeholder
    duration: 4000,
  },
];

//fallback local image
const fallbackImage = require("../../assets/images/login_screen_logo.png");

const OnboardingScreen = () => {
  const { width } = useWindowDimensions();
  const { navigateToLogin } = useAuthNavigation();
  const { completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Fetch CMS data (same pattern as Login and OTPVerification screens)
  const {
    data: cmsData,
    isLoading,
    error: onboardingError,
  } = useCMSData({ pLevel: "" });
  const onboardingData = cmsData?.onboarding;

  // Extract steps and logo with fallback to dummy data
  const steps =
    onboardingData?.steps && onboardingData.steps.length > 0
      ? onboardingData.steps
      : dummySteps;
  const logoUrl = onboardingData?.logoUrl || null;

  // Dynamic progress array based on steps length
  const [progress, setProgress] = useState<number[]>(() =>
    new Array(steps.length).fill(0)
  );

  // Dynamic animation array - use ref to persist across renders
  const progressAnimationsRef = useRef<Animated.Value[]>([]);

  // Initialize animations array on mount and update when steps length changes
  useEffect(() => {
    const newLength = steps.length;
    const currentLength = progressAnimationsRef.current.length;

    if (newLength > currentLength) {
      // Add new animations for additional steps
      for (let i = currentLength; i < newLength; i++) {
        progressAnimationsRef.current.push(new Animated.Value(0));
      }
    } else if (newLength < currentLength) {
      // Remove excess animations (though this is unlikely to happen)
      progressAnimationsRef.current = progressAnimationsRef.current.slice(
        0,
        newLength
      );
    } else if (currentLength === 0) {
      // Initial setup
      progressAnimationsRef.current = steps.map(() => new Animated.Value(0));
    }
  }, [steps.length]);

  const progressAnimations = progressAnimationsRef.current;

  // Update progress array when steps length changes
  useEffect(() => {
    const newLength = steps.length;
    const currentLength = progress.length;

    if (newLength !== currentLength) {
      setProgress(new Array(newLength).fill(0));
    }
  }, [steps.length, progress.length]);

  // Enterprise: Extracted constants for timing to keep behavior consistent app-wide
  const TIMER_INTERVAL_MS = 50;

  // Analytics helper (replace console.log with real analytics SDK later)
  const track = useCallback(
    (event: string, props?: Record<string, unknown>) => {
      console.log(`[analytics] ${event}`, props ?? {});
    },
    []
  );

  // Memoized current step data
  const currentStepData = useMemo(
    () => steps[currentStep],
    [steps, currentStep]
  );

  // Timer for auto-advance (guarded by feature flag)
  useEffect(() => {
    if (!FEATURE_FLAGS.autoAdvanceEnabled) return;
    if (!isActive || currentStep >= steps.length) return;

    track("onboarding_step_viewed", {
      stepIndex: currentStep,
      stepId: currentStepData?.id,
    });

    const stepDuration = currentStepData?.duration ?? 4000;
    const totalUpdates = stepDuration / TIMER_INTERVAL_MS;
    let currentUpdate = 0;

    const timer = setInterval(() => {
      currentUpdate += 1;
      const newProgress = (currentUpdate / totalUpdates) * 100;

      setProgress((prev) => {
        const updated = [...prev];
        updated[currentStep] = Math.min(newProgress, 100);
        return updated;
      });

      progressAnimations[currentStep].setValue(newProgress / 100);

      if (currentUpdate >= totalUpdates) {
        clearInterval(timer);
        if (currentStep < steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsActive(false);
          completeOnboarding();
          navigateToLogin();
        }
      }
    }, TIMER_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [
    currentStep,
    isActive,
    steps,
    currentStepData,
    progressAnimations,
    navigateToLogin,
    completeOnboarding,
    track,
  ]);

  const handleSkip = useCallback(() => {
    setIsActive(false);
    // Complete onboarding and navigate to login within AuthStack
    completeOnboarding();
    navigateToLogin();
    track("onboarding_skipped", { stepIndex: currentStep });
  }, [completeOnboarding, navigateToLogin, track, currentStep]);

  const handleProgressBarPress = useCallback(
    (index: number) => {
      if (index <= currentStep) {
        setCurrentStep(index);
        setProgress((prev) => {
          const updated = [...prev];
          // Reset all progress after selected step
          for (let i = index + 1; i < updated.length; i++) {
            updated[i] = 0;
          }
          return updated;
        });
      }
      track("onboarding_seek", { toIndex: index });
    },
    [currentStep, track]
  );

  useEffect(() => {
    if (onboardingData) {
      if (onboardingData.steps && onboardingData.steps.length > 0) {
        track("onboarding_data_loaded", { count: onboardingData.steps.length });
      } else {
        track("onboarding_data_empty");
      }
    }
  }, [onboardingData, track]);

  useEffect(() => {
    if (onboardingError) {
      track("onboarding_data_failed", {
        error:
          onboardingError instanceof Error
            ? onboardingError.message
            : "Unknown error",
      });
    }
  }, [onboardingError, track]);

  const horizontalPadding = 20;
  const contentWidth = width - horizontalPadding * 2;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text
            style={styles.loadingText}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Full-screen background image */}
      <ReusableImage
        uri={currentStepData?.imageUrl || null}
        fallback={fallbackImage}
        style={styles.backgroundImage}
        resizeMode="cover"
        showLoader={false}
      />
      {/* Header */}
      <View style={styles.header}>
        {/* Progress Dashes */}
        <View style={styles.progressContainer}>
          {progress.map((progressValue, index) => (
            <TouchableOpacity
              key={index}
              style={styles.progressDashContainer}
              onPress={() => handleProgressBarPress(index)}
              activeOpacity={0.7}
            >
              <View style={styles.progressDashBackground} />
              <Animated.View
                style={[
                  styles.progressDashFill,
                  {
                    width: progressAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                    backgroundColor:
                      index <= currentStep ? colors.orange : colors.gray600,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text
            style={styles.skipText}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content overlay */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <ReusableImage
            uri={logoUrl}
            fallback={require("../../assets/images/login_screen_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title and Subtitle */}
        <View style={[styles.textContainer, { width: contentWidth }]}>
          <Text
            style={styles.title}
            allowFontScaling
            maxFontSizeMultiplier={1.3}
          >
            {currentStepData?.title}
          </Text>
          <Text
            style={styles.subtitle}
            allowFontScaling
            maxFontSizeMultiplier={1.3}
          >
            {currentStepData?.subtitle}
          </Text>
        </View>

        {/* The background image now covers the whole screen. */}
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "transparent",
  },
  progressContainer: {
    flexDirection: "row",
    gap: 8,
  },
  progressDashContainer: {
    width: 38,
    height: 4,
    minHeight: 4,
    borderRadius: 30,
    overflow: "hidden",
  },
  progressDashBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.gray600,
    borderRadius: 30,
  },
  progressDashFill: {
    height: "100%",
    borderRadius: 30,
  },
  skipButton: {
    minWidth: 30,
    height: 17,
    minHeight: 17,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  skipText: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.2),
    letterSpacing: 0.25,
    color: colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logoContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    minWidth: 163,
    height: 65,
    minHeight: 65,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  logo: {
    width: 163,
    height: 65,
    minHeight: 65,
    // aspectRatio: 2.5, // Maintains logo proportions
  },
  textContainer: {
    position: "absolute",
    top: 92,
    left: 20,
    alignItems: "flex-start",
  },
  title: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: 28,
    lineHeight: Math.round(28 * 1.2),
    letterSpacing: 0,
    color: colors.black,
    textAlign: "left",
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: 28,
    lineHeight: Math.round(28 * 1.2),
    letterSpacing: 0,
    color: colors.black,
    textAlign: "left",
  },
  // Removed fixed-size foreground image; background covers entire screen now
});
