import React, { useState, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";
import typography from "@/src/constants/typography";
import { Ionicons } from "@expo/vector-icons";

type ClaimProcessInputProps = {
  title: string; // Header text (right-aligned, SemiBold, 16px, #008081)
  children: ReactNode; // Field components (DropdownField, TextField, etc.)
  containerStyle?: any;
  defaultOpen?: boolean; // Default: true (open)
  showChevron?: boolean; // Show/hide chevron icon (default: true)
  leftIcon?: ReactNode; // Optional icon to display on the left of the title
  hasBackground?: boolean; // Optional background color (#0080810A), default: false
};

export default function ClaimProcessInput({
  title,
  children,
  containerStyle,
  defaultOpen = true,
  showChevron = true,
  leftIcon,
  hasBackground = false,
}: ClaimProcessInputProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = 20;
  const containerWidth = width - horizontalPadding * 2;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // When closed: 54px (just header)
  // When open: Let content determine height (minHeight for base case)
  const headerHeight = 54;
  const paddingTop = 12; // Reduced when open
  const paddingBottom = 0;
  const gapAfterHeader = 0;

  // Calculate minimum height based on open/closed state
  const minHeight = isOpen
    ? paddingTop + paddingBottom + headerHeight + gapAfterHeader + 54 // Base: header + gap + one field
    : 54; // Closed: 54px

  return (
    <View
      style={[
        styles.container,
        { width: containerWidth, minHeight: minHeight },
        isOpen ? styles.containerOpen : styles.containerClosed,
        hasBackground && styles.containerWithBackground,
        containerStyle,
      ]}
    >
      {/* Header - Always Visible */}
      <TouchableOpacity
        style={[
          styles.header,
          isOpen ? styles.headerOpen : styles.headerClosed,
        ]}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
        disabled={!showChevron}
      >
        {/* Icon - Left (only show if showChevron is true) */}
        {showChevron && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={isOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.blackColor}
            />
          </View>
        )}

        {/* Text Container with Optional Left Icon */}
        <View style={styles.headerTextContainer}>
          {/* Optional Left Icon - placed to the left of title */}
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <Text style={styles.headerText}>{title}</Text>
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isOpen && (
        <View style={styles.expandedContent}>
          {/* Gap after header */}
          <View style={styles.gapAfterHeader} />

          {/* Children - Field components */}
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.boxBorder,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: colors.white,
    alignSelf: "center",
  },
  containerOpen: {
    paddingTop: 12,
    paddingBottom: 0,
  },
  containerClosed: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  containerWithBackground: {
    backgroundColor: "#0080810A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    height: 54,
  },
  headerOpen: {
    gap: 24,
  },
  headerClosed: {
    gap: 8,
  },
  iconContainer: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  leftIconContainer: {
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  headerText: {
    fontFamily: fonts.family.semiBold,
    fontWeight: fonts.weight.semiBold,
    fontSize: typography.cardHeadText2,
    lineHeight: Math.round(typography.cardHeadText2 * 1.2),
    letterSpacing: 0,
    textAlign: "right",
    color: colors.primaryColor,
  },
  expandedContent: {
    width: "100%",
  },
  gapAfterHeader: {
    height: 32,
  },
});
