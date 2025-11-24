import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";
import typography from "@/src/constants/typography";

export type PolicyOverviewCardProps = {
  insuranceName: string;
  claimNumber?: string;
  policyNumber: string;
  status: "Active" | "Expired" | "Initiated" | "Processing" | string;
};

export default function PolicyOverviewCard({
  insuranceName,
  claimNumber,
  policyNumber,
  status,
}: PolicyOverviewCardProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = 20; // From PolicyDetails screen
  const cardWidth = width - horizontalPadding * 2;
  const containerPadding = 10 * 2; // paddingHorizontal: 10
  const availableWidth = cardWidth - containerPadding;
  const sectionWidth = availableWidth / 2; // Equal sections for alignment

  const isActive = status === "Active";
  const claimNumberText = claimNumber || "To be assign";

  return (
    <View style={styles.container}>
      {/* Left Section - Icon */}
      <View style={[styles.leftSection, { width: sectionWidth }]}>
        <Image
          source={require("../assets/images/bag_icon.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>

      {/* Right Section - Texts + Badge */}
      <View style={[styles.rightSection, { width: sectionWidth }]}>
        <Text style={styles.insuranceName} numberOfLines={2} allowFontScaling>
          {insuranceName}
        </Text>

        <Text
          style={styles.claimNumber}
          allowFontScaling
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Claim No: {claimNumberText}
        </Text>

        <Text
          style={styles.policyNumber}
          allowFontScaling
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Policy No-{policyNumber}
        </Text>

        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.badge,
              isActive ? styles.badgeActive : styles.badgeInactive,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                isActive ? styles.badgeTextActive : styles.badgeTextInactive,
              ]}
              allowFontScaling
              maxFontSizeMultiplier={1.2}
            >
              {status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 91,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    opacity: 1,
    marginBottom: 24,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  leftSection: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 8,
    paddingLeft: 8,
  },
  icon: {
    width: 52,
    height: 52,
  },

  rightSection: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingVertical: 4,
    paddingRight: 0,
  },

  insuranceName: {
    fontSize: 16,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    color: colors.deeptealColor,
    textAlign: "center",
    lineHeight: Math.round(16 * 1.2),
    letterSpacing: 0,
  },
  claimNumber: {
    fontSize: typography.headingText1,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    color: colors.deeptealColor,
    textAlign: "center",
    lineHeight: Math.round(typography.headingText1 * 1.2),
    letterSpacing: 0,
    marginTop: 4,
  },
  policyNumber: {
    fontSize: typography.headingText1,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    color: colors.primaryColor,
    textAlign: "center",
    lineHeight: Math.round(typography.headingText1 * 1.2),
    letterSpacing: 0,
    marginTop: 4,
  },
  policyNoValue: {
    color: "#149087",
    fontWeight: "500",
  },

  badgeContainer: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  badge: {
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    minHeight: 18,
    opacity: 1,
  },
  badgeActive: {
    backgroundColor: "#D5F5DA",
  },
  badgeInactive: {
    backgroundColor: "#FFEEEE",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  badgeTextActive: {
    color: "#23AA49",
  },
  badgeTextInactive: {
    color: "#C44343",
  },
});
