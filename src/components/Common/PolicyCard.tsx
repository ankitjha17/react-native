import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import PolicyActions from "../PolicyActions";

export type PolicyCardProps = {
  width: number;
  status?: "Active" | "Expired" | "Open" | "Close" | string;
  name: string;
  claimNumber?: string;
  policyNumber: string;
  startDate: string;
  validTill: string;
  premiumPerMonth: string;
  showStatusBadge?: boolean;
  isFromPolicyScreen?: boolean;
  selectedStatus?: "Active" | "Expired";
  onPress?: () => void;
  onRaiseClaim?: () => void;
  onContactSupport?: () => void;
  statusColor?: string;
  textColor?: string;
};

function PolicyCard({
  width,
  status = "Active",
  name,
  claimNumber: _claimNumber,
  policyNumber,
  startDate,
  validTill,
  premiumPerMonth,
  showStatusBadge = true,
  isFromPolicyScreen,
  selectedStatus,
  onPress,
  onRaiseClaim,
  onContactSupport,
  statusColor,
  textColor,
}: PolicyCardProps) {
  // const isActive = useMemo(
  //   () => (status ?? '').toLowerCase() === 'active',
  //   [status],
  // );
  // const isActive = (status ?? '').toLowerCase() === 'active';

  const badgeContainerVariant =
    status === "Active"
      ? styles.badgeActive
      : status === "Expired"
        ? styles.badgeInactive
        : status === "Initiated"
          ? styles.badgeInitiated
          : status === "Processing"
            ? styles.badgeProcessing
            : null;

  const badgeTextVariant =
    status === "Active"
      ? styles.badgeTextActive
      : status === "Expired"
        ? styles.badgeTextInactive
        : status === "Initiated"
          ? styles.badgeTextInitiated
          : status === "Processing"
            ? styles.badgeTextProcessing
            : null;

  const badgeContainerStyle = [
    styles.badge,
    badgeContainerVariant,
    statusColor ? { backgroundColor: statusColor } : null,
  ];
  const badgeTextStyle = [
    styles.badgeText,
    textColor
      ? { color: textColor }
      : statusColor
        ? { color: colors.darkBlack }
        : badgeTextVariant,
  ];

  const showButtons =
    isFromPolicyScreen && selectedStatus === "Active" && status === "Active";

  return onPress ? (
    <TouchableOpacity
      style={[styles.card, { width }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessible
      accessibilityLabel={`${name}, ${status}, Policy ${policyNumber}`}
    >
      {/* Top Section */}
      <View style={styles.topSection}>
        <Ionicons
          name="chevron-back"
          size={20}
          color={colors.black}
          style={styles.arrowIcon}
          accessibilityRole="image"
          accessibilityLabel="Policy details"
        />
        <View style={styles.topSectionContent}>
          <View style={styles.headerRow}>
            {showStatusBadge && (
              <View style={badgeContainerStyle}>
                <Text style={badgeTextStyle}>{status}</Text>
              </View>
            )}

            <Text
              style={styles.title}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
              accessibilityRole="header"
            >
              {name}
            </Text>
          </View>
          <Text style={styles.sub} allowFontScaling maxFontSizeMultiplier={1.2}>
            {`Policy No: ${policyNumber}`}
          </Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.metaRow}>
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
        </View>
      </View>
      {showButtons && (
        <View style={styles.actionsContainer}>
          <PolicyActions
            onContactSupport={
              onContactSupport || (() => console.log("Contact Support"))
            }
            onRaiseClaim={onRaiseClaim || (() => console.log("Raise a Claim"))}
          />
        </View>
      )}
    </TouchableOpacity>
  ) : (
    <View
      style={[styles.card, { width }]}
      accessibilityRole="summary"
      accessible
      accessibilityLabel={`${name}, ${status}, Policy ${policyNumber}`}
    >
      {/* Top Section */}
      <View style={styles.topSection}>
        <Ionicons
          name="chevron-back"
          size={20}
          color={colors.black}
          style={styles.arrowIcon}
          accessibilityRole="image"
          accessibilityLabel="Policy details"
        />
        <View style={styles.topSectionContent}>
          <View style={styles.headerRow}>
            {showStatusBadge && (
              <View style={badgeContainerStyle}>
                <Text style={badgeTextStyle}>{status}</Text>
              </View>
            )}

            <Text
              style={styles.title}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
              accessibilityRole="header"
            >
              {name}
            </Text>
          </View>
          <Text style={styles.sub} allowFontScaling maxFontSizeMultiplier={1.2}>
            {`Policy No: ${policyNumber}`}
          </Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.metaRow}>
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
        </View>
      </View>
      {showButtons && (
        <View style={styles.actionsContainer}>
          <PolicyActions
            onContactSupport={
              onContactSupport || (() => console.log("Contact Support"))
            }
            onRaiseClaim={onRaiseClaim || (() => console.log("Raise a Claim"))}
          />
        </View>
      )}
    </View>
  );
}

export default memo(PolicyCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.blackOpacityeight,
    marginBottom: 20,
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
  badgeActive: {
    backgroundColor: colors.badgeActiveGreen,
  },
  badgeInactive: {
    backgroundColor: colors.badgeInActiveRed,
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
  title: {
    fontSize: typography.cardHeadText2,
    fontWeight: fonts.weight.medium,
    fontFamily: fonts.family.medium,
    color: colors.deeptealColor,
    textAlign: "right",
    paddingRight: 8,
    letterSpacing: 0,
    lineHeight: Math.round(typography.cardHeadText2 * 1.2),
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
  badgeInitiated: {
    backgroundColor: colors.initiatedColor,
  },
  badgeProcessing: {
    backgroundColor: colors.processingColor,
  },
  badgeTextInitiated: {
    color: colors.primaryColor,
  },
  badgeTextProcessing: {
    color: colors.lighBrown,
  },
  actionsContainer: {
    width: "100%",
    alignSelf: "center",
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
  },
});
