import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";

interface DetailHeaderProps {
  title?: string;
  subtitle?: string;
  onBackPress: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export default function DetailHeader({
  title,
  subtitle,
  onBackPress,
  rightIcon,
  onRightPress,
}: DetailHeaderProps) {
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={[styles.headerContainer, { width }]}>
        {/* Top Row */}
        <View style={styles.topRow}>
          {/* Left - Back Arrow (Always Present) */}
          <TouchableOpacity
            onPress={onBackPress}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back-outline"
              size={24}
              color={colors.black}
            />
          </TouchableOpacity>

          {/* Center - Title (Optional) */}
          <View style={styles.titleContainer}>
            {title ? (
              <Text
                style={subtitle ? styles.titleWithSubtitle : styles.title}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
                numberOfLines={1}
              >
                {title}
              </Text>
            ) : null}
            {subtitle ? (
              <Text
                style={styles.subtitle}
                allowFontScaling
                maxFontSizeMultiplier={1.1}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>

          {/* Right - Optional Icon */}
          <View style={styles.rightContainer}>
            {rightIcon ? (
              <TouchableOpacity
                onPress={onRightPress}
                accessibilityRole="button"
                accessibilityLabel="Right action"
                style={styles.rightButton}
              >
                <Ionicons name={rightIcon} size={24} color={colors.black} />
              </TouchableOpacity>
            ) : (
              <View style={styles.placeholder} />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  headerContainer: {
    height: 56,
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: typography.headingText1,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.semiBold,
    color: colors.darkBlack,
    textAlign: "center",
    lineHeight: Math.round(typography.cardHeadText2 * 1.2),
    letterSpacing: 0,
  },
  titleWithSubtitle: {
    fontSize: typography.headingText1,
    fontFamily: fonts.family.semiBold,
    fontWeight: fonts.weight.semiBold,
    color: colors.deeptealColor,
    textAlign: "center",
    lineHeight: Math.round(typography.headingText1 * 1.2),
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: typography.headingText1,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    color: colors.primaryColor,
    textAlign: "center",
    marginTop: 2,
    letterSpacing: 0,
    lineHeight: Math.round(typography.serviceText * 1.17),
  },
  rightContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  rightButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 40,
    height: 40,
  },
});
