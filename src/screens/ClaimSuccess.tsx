import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButtonGroup, {
  ActionButtonGroupProps,
} from "../components/Common/ActionButtonGroup";
import DetailHeader from "../components/Common/DetailHeader";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import typography from "../constants/typography";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { AppStackParamList } from "../navigation/AppStack";

export type ClaimSuccessProps = {
  title?: string;
  policyNumber?: string;
  description?: string;
  primaryText?: string;
  secondaryText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
};

export default function ClaimSuccess({
  title = "Claim Filed Successfully",
  policyNumber = "#P1278292728",
  description = "Our agent will reach out to you shortly. You can also monitor the status of your claim under 'My Claims' section.",
  primaryText = "View Details",
  secondaryText = "Home",
  onPrimaryPress,
  onSecondaryPress,
}: ClaimSuccessProps) {
  // const { width } = useWindowDimensions();
  const { navigateToFiledClaimDetail, navigateToTabs, goBack } =
    useAppNavigation();
  const { params } = useRoute<RouteProp<AppStackParamList, "ClaimSuccess">>();
  const { policyNumber: routePolicyNumber } = params ?? {};
  const finalPolicyNumber = routePolicyNumber ?? policyNumber ?? "";

  // const horizontalPadding = 20;
  // const contentWidth = width - horizontalPadding * 2;

  const handleViewDetails = () => {
    if (onPrimaryPress) {
      onPrimaryPress();
    } else {
      navigateToFiledClaimDetail();
    }
  };

  const handleHome = () => {
    if (onSecondaryPress) {
      onSecondaryPress();
    } else {
      navigateToTabs();
    }
  };

  const buttons: ActionButtonGroupProps = {
    leftButton: {
      text: primaryText,
      onPress: handleViewDetails,
      variant: "filled",
      backgroundColor: colors.button,
      textColor: colors.white,
    },
    rightButton: {
      text: secondaryText,
      onPress: handleHome,
      variant: "outlined",
      backgroundColor: colors.button,
      textColor: colors.button,
      borderColor: colors.button,
    },
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <DetailHeader onBackPress={goBack} />

      {/* Main content */}
      <View style={styles.content}>
        <Image
          source={require("../assets/images/success.png")}
          style={styles.successImage}
          resizeMode="contain"
          accessibilityLabel="Success"
        />
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          {title}
        </Text>

        {!!finalPolicyNumber && (
          <Text
            style={styles.token}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            {finalPolicyNumber}
          </Text>
        )}

        <Text
          style={styles.description}
          allowFontScaling
          maxFontSizeMultiplier={1.2}
        >
          {description}
        </Text>
      </View>

      {/* Fixed bottom button section */}
      <View style={styles.buttonsWrapper}>
        <ActionButtonGroup
          leftButton={buttons.leftButton}
          rightButton={buttons.rightButton}
          containerStyle={styles.buttonsContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  successImage: {
    width: 150,
    height: 150,
    minHeight: 150,
    marginBottom: 32,
    aspectRatio: 1, // Maintains square proportions
  },
  title: {
    fontSize: typography.headingText,
    fontFamily: fonts.family.semiBold,
    fontWeight: fonts.weight.semiBold,
    color: colors.darkBlack,
    textAlign: "center",
    marginBottom: 8,
  },
  token: {
    fontSize: typography.tabText,
    fontFamily: fonts.family.semiBold,
    fontWeight: fonts.weight.semiBold,
    color: colors.button,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: typography.headingText1,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    color: colors.darkBlack,
    textAlign: "center",
    lineHeight: Math.round(typography.headingText1 * 1.6),
    paddingHorizontal: 10,
  },
  buttonsWrapper: {
    position: "absolute", // 👈 fixed at bottom
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: colors.white, // ensures visible if content scrolls
  },
  buttonsContainer: {
    gap: 16,
    flexDirection: "column",
    alignItems: "stretch",
  },
});
