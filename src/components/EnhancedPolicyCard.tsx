import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";
import typography from "@/src/constants/typography";

export type EnhancedPolicyCardProps = {
  width?: number;
  title: string;
  badgeText?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  showBackButton?: boolean;
  showClaimNumber?: boolean;
  claimNumber?: string;
  showPolicyNumber?: boolean;
  policyNumber?: string;
  startDate?: string;
  validTill?: string;
  premiumPerMonth?: string;
  backgroundColor?: string;
  elevation?: number;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
};

function EnhancedPolicyCard({
  width,
  title,
  badgeText,
  badgeColor,
  badgeTextColor,
  showBackButton,
  showClaimNumber,
  claimNumber,
  showPolicyNumber = true,
  policyNumber,
  startDate,
  validTill,
  premiumPerMonth,
  backgroundColor = colors.white,
  elevation = 0,
  onPress,
  containerStyle,
  titleStyle,
}: EnhancedPolicyCardProps) {
  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          width ? { width } : null,
          { backgroundColor, elevation },
          containerStyle,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessible
        accessibilityLabel={`${title}${policyNumber ? `, Policy ${policyNumber}` : ""}`}
      >
        <View style={styles.topSection}>
          {showBackButton ? (
            <Ionicons
              name="chevron-back"
              size={20}
              color={colors.black}
              style={styles.arrowIcon}
              accessibilityRole="image"
              accessibilityLabel="Back"
            />
          ) : null}
          <View style={styles.topSectionContent}>
            <View style={styles.headerRow}>
              {badgeText ? (
                <View
                  style={[
                    styles.badge,
                    badgeColor ? { backgroundColor: badgeColor } : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      badgeTextColor
                        ? { color: badgeTextColor }
                        : { color: colors.darkBlack },
                    ]}
                  >
                    {badgeText}
                  </Text>
                </View>
              ) : null}
              <Text
                style={[styles.title, titleStyle]}
                allowFontScaling
                maxFontSizeMultiplier={1.3}
              >
                {title}
              </Text>
            </View>
            {showClaimNumber && claimNumber ? (
              <Text
                style={styles.sub}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              >{`Claim No: ${claimNumber}`}</Text>
            ) : null}
            {showPolicyNumber && policyNumber ? (
              <Text
                style={styles.sub}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              >{`Policy No: ${policyNumber}`}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.metaRow}>
            {startDate ? (
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
            ) : null}
            {validTill ? (
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
            ) : null}
            {premiumPerMonth ? (
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
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.card,
        width ? { width } : null,
        { backgroundColor, elevation },
        containerStyle,
      ]}
      accessibilityRole="summary"
      accessible
      accessibilityLabel={`${title}${policyNumber ? `, Policy ${policyNumber}` : ""}`}
    >
      <View style={styles.topSection}>
        {showBackButton ? (
          <Ionicons
            name="chevron-back"
            size={20}
            color={colors.black}
            style={styles.arrowIcon}
            accessibilityRole="image"
            accessibilityLabel="Back"
          />
        ) : null}
        <View style={styles.topSectionContent}>
          <View style={styles.headerRow}>
            {badgeText ? (
              <View
                style={[
                  styles.badge,
                  badgeColor ? { backgroundColor: badgeColor } : null,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    badgeTextColor
                      ? { color: badgeTextColor }
                      : { color: colors.darkBlack },
                  ]}
                >
                  {badgeText}
                </Text>
              </View>
            ) : null}
            <Text
              style={[styles.title, titleStyle]}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
            >
              {title}
            </Text>
          </View>
          {showClaimNumber && claimNumber ? (
            <Text
              style={styles.sub}
              allowFontScaling
              maxFontSizeMultiplier={1.2}
            >{`Claim No: ${claimNumber}`}</Text>
          ) : null}
          {showPolicyNumber && policyNumber ? (
            <Text
              style={styles.sub}
              allowFontScaling
              maxFontSizeMultiplier={1.2}
            >{`Policy No: ${policyNumber}`}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.metaRow}>
          {startDate ? (
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
          ) : null}
          {validTill ? (
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
          ) : null}
          {premiumPerMonth ? (
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
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default EnhancedPolicyCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.blackOpacityeight,
    marginBottom: 20,
    overflow: "hidden",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  arrowIcon: {
    marginRight: 10,
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
    flexWrap: "wrap",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 2,
  },
  badgeText: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: typography.serviceText,
    lineHeight: Math.round(typography.serviceText * 1.17),
    textAlign: "center",
    letterSpacing: 0,
  },
  title: {
    fontSize: typography.cardHeadText2,
    fontWeight: fonts.weight.medium,
    fontFamily: fonts.family.medium,
    color: colors.deeptealColor,
    textAlign: "right",
    paddingRight: 8,
    letterSpacing: 0,
    lineHeight: Math.round(typography.cardHeadText2 * 0.875),
    flexShrink: 1,
    minWidth: 0,
  },
  sub: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: typography.serviceText,
    color: colors.deeptealColor,
    textAlign: "right",
    letterSpacing: 0,
    lineHeight: Math.round(typography.serviceText * 1.17),
    paddingRight: 8,
    marginTop: 2,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: colors.blackOpacityeight,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  metaCol: {
    flex: 1,
    alignItems: "center",
  },
  metaLabel: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: typography.serviceText,
    color: colors.black,
    textAlign: "center",
  },
  metaValue: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: typography.headingText1,
    color: colors.deeptealColor,
    textAlign: "center",
  },
});
