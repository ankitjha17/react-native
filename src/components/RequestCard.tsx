import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";
import typography from "@/src/constants/typography";

export type RequestCardProps = {
  width: number;
  status?: "Active" | "Inactive" | "Processing" | "Initiated" | string;
  requestId: string;
  requestType: string;
  createdDate?: string;
  startDate?: string;
  validTill?: string;
  premiumPerMonth?: string;
  companyName?: string;
  description?: string;
  onPress?: () => void;
  selected?: boolean;
};

function RequestCard({
  width,
  status = "Active",
  requestId,
  requestType,
  startDate,
  validTill,
  premiumPerMonth,
  companyName,
  onPress,
  selected = false,
}: RequestCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { width }, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessible
      accessibilityLabel={`${requestType}, ${status}, Request ${requestId}`}
    >
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.leftIconContainer}>
          <Image
            source={require("../assets/images/bag_icon.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.topSectionContent}>
          <View style={styles.headerRow}>
            <View
              style={[
                styles.badge,
                status === "Active"
                  ? styles.badgeActive
                  : status === "Inactive"
                    ? styles.badgeInactive
                    : status === "Initiated"
                      ? styles.badgeInitiated
                      : status === "Processing"
                        ? styles.badgeProcessing
                        : null,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  status === "Active"
                    ? styles.badgeTextActive
                    : status === "Inactive"
                      ? styles.badgeTextInactive
                      : status === "Initiated"
                        ? styles.badgeTextInitiated
                        : status === "Processing"
                          ? styles.badgeTextProcessing
                          : null,
                ]}
              >
                {status}
              </Text>
            </View>

            <Text
              style={styles.title}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
              accessibilityRole="header"
            >
              {requestType}
            </Text>
          </View>
          {companyName && (
            <Text
              style={styles.companyName}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
            >
              {companyName}
            </Text>
          )}
          <Text style={styles.sub} allowFontScaling maxFontSizeMultiplier={1.2}>
            {requestId}
          </Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.metaRow}>
          {startDate && (
            <View
              style={styles.metaCol}
              accessibilityRole="text"
              accessibilityLabel={`Start Date: ${startDate}`}
            >
              <Text
                style={styles.metaLabel}
                allowFontScaling
                maxFontSizeMultiplier={1.1}
              >
                Start Date
              </Text>
              <Text
                style={styles.metaValue}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              >
                {startDate}
              </Text>
            </View>
          )}
          {validTill && (
            <View
              style={styles.metaCol}
              accessibilityRole="text"
              accessibilityLabel={`Valid till: ${validTill}`}
            >
              <Text
                style={styles.metaLabel}
                allowFontScaling
                maxFontSizeMultiplier={1.1}
              >
                Valid till
              </Text>
              <Text
                style={styles.metaValue}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              >
                {validTill}
              </Text>
            </View>
          )}
          {premiumPerMonth && (
            <View
              style={styles.metaCol}
              accessibilityRole="text"
              accessibilityLabel={`Premium per month: ${premiumPerMonth}`}
            >
              <Text
                style={styles.metaLabel}
                allowFontScaling
                maxFontSizeMultiplier={1.1}
              >
                Premium/mo.
              </Text>
              <Text
                style={styles.metaValue}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              >
                {premiumPerMonth}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(RequestCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.blackOpacityeight,
    marginBottom: 20,
  },
  cardSelected: {
    backgroundColor: "rgba(234, 106, 50, 0.06)", // #EA6A320F
    borderColor: "#EA6A32",
    borderWidth: 1,
  },
  topSection: {
    height: 99,
    minHeight: 99,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  leftIconContainer: {
    width: "30%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 16,
  },

  iconImage: {
    width: 52, // as per your earlier image spec
    height: 52,
    opacity: 1,
  },
  topSectionContent: {
    flex: 1,
    alignItems: "flex-end",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 4,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeActive: {
    backgroundColor: colors.badgeActiveGreen,
  },
  badgeInactive: {
    backgroundColor: colors.badgeInActiveRed,
  },
  badgeInitiated: {
    backgroundColor: colors.initiatedColor,
  },
  badgeProcessing: {
    backgroundColor: colors.processingColor,
  },
  badgeText: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: typography.serviceText,
    lineHeight: Math.round(typography.serviceText * 1.17),
    textAlign: "center",
    letterSpacing: 0,
  },
  badgeTextActive: {
    color: colors.activeGreen,
  },
  badgeTextInactive: {
    color: colors.inactiveRed,
  },
  badgeTextInitiated: {
    color: colors.primaryColor,
  },
  badgeTextProcessing: {
    color: colors.lighBrown,
  },
  title: {
    fontSize: typography.cardHeadText2,
    fontWeight: fonts.weight.medium,
    fontFamily: fonts.family.medium,
    color: colors.deeptealColor,
    textAlign: "right",
    paddingRight: 8,
    letterSpacing: 0,
    lineHeight: Math.round(typography.cardHeadText2 * 1.2),
  },
  companyName: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: 18,
    lineHeight: Math.round(18 * 1.2),
    color: colors.primaryColor,
    textAlign: "right",
    letterSpacing: 0,
    paddingRight: 8,
  },
  sub: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: typography.serviceText,
    color: colors.deeptealColor,
    textAlign: "center",
    letterSpacing: 0,
    lineHeight: Math.round(typography.serviceText * 1.2),
    marginTop: 4,
    paddingRight: 8,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: colors.blackOpacityeight,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 26,
    width: "100%",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },
  metaCol: {
    flex: 1,
    alignItems: "center",
  },
  metaLabel: {
    fontFamily: fonts.family.medium,
    fontSize: typography.serviceText,
    fontWeight: fonts.weight.medium,
    textAlign: "center",
    letterSpacing: 0,
    lineHeight: Math.round(typography.serviceText * 1.17),
    color: colors.darkBlack,
    marginBottom: 4,
  },
  metaValue: {
    fontFamily: fonts.family.regular,
    fontSize: typography.headingText1,
    fontWeight: fonts.weight.regular,
    color: colors.deeptealColor,
    textAlign: "center",
    letterSpacing: 0,
    lineHeight: Math.round(typography.headingText1 * 1.17),
  },
});
