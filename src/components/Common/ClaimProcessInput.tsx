import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";

type ClaimProcessInputProps = {
  title: string; // Header text (right-aligned, SemiBold, 16px, #008081)
  children: ReactNode; // Field components (DropdownField, TextField, etc.)
  containerStyle?: any;
  defaultOpen?: boolean; // Default: true (open)
  showChevron?: boolean; // Show/hide chevron icon (default: true)
  leftIcon?: ReactNode; // Optional icon to display on the left of the title
  hasBackground?: boolean; // Optional background color (#0080810A), default: false
  // Toggle props
  toggleValue?: boolean; // Toggle switch value
  onToggleChange?: (value: boolean) => void; // Toggle change callback
  toggleLabel?: string; // Label text for toggle (e.g., "Is anyone injured?")
};

export default function ClaimProcessInput({
  title,
  children,
  containerStyle,
  defaultOpen = true,
  showChevron = true,
  leftIcon,
  hasBackground = false,
  toggleValue,
  onToggleChange,
  toggleLabel = "Is anyone injured?",
}: ClaimProcessInputProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = 20;
  const containerWidth = width - horizontalPadding * 2;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [internalToggleValue, setInternalToggleValue] = useState(
    toggleValue ?? false
  );
  const toggleAnimation = React.useRef(
    new Animated.Value(toggleValue ? 20 : 0)
  ).current;

  // Use controlled or uncontrolled toggle
  const isToggleEnabled =
    toggleValue !== undefined ? toggleValue : internalToggleValue;

  // Animate toggle when value changes
  React.useEffect(() => {
    Animated.timing(toggleAnimation, {
      toValue: isToggleEnabled ? 20 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isToggleEnabled, toggleAnimation]);

  const handleToggleChange = (value: boolean) => {
    if (toggleValue === undefined) {
      setInternalToggleValue(value);
    }
    onToggleChange?.(value);
  };

  // When closed: 54px (just header)
  // When open: Let content determine height (minHeight for base case)
  const headerHeight = 54;
  const paddingTop = 12; // Reduced when open
  const paddingBottom = 0;
  const gapAfterHeader = 0;

  // Calculate minimum height based on open/closed state
  const hasToggle = toggleValue !== undefined || onToggleChange !== undefined;
  const minHeight = isOpen
    ? paddingTop +
      paddingBottom +
      headerHeight +
      gapAfterHeader +
      (hasToggle ? 60 : 54) // Base: header + gap + toggle/field
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

          {/* Toggle Switch (if provided) */}
          {hasToggle && (
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>{toggleLabel}</Text>
              <TouchableOpacity
                style={[
                  styles.toggleTrack,
                  isToggleEnabled && styles.toggleTrackActive,
                ]}
                onPress={() => handleToggleChange(!isToggleEnabled)}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.toggleThumb,
                    {
                      transform: [{ translateX: toggleAnimation }],
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Children - Field components (only show if toggle is enabled or no toggle) */}
          {(!hasToggle || isToggleEnabled) && children}
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
  toggleContainer: {
    flexDirection: "row-reverse", // RTL: toggle on left, text on right
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
    width: "100%",
  },
  toggleLabel: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.4),
    color: colors.black,
    textAlign: "right",
    flex: 1,
    marginLeft: 12, // Space between toggle and text (left margin since we're using row-reverse)
  },
  toggleTrack: {
    width: 51,
    height: 31,
    borderRadius: 15.5,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    padding: 2,
  },
  toggleTrackActive: {
    backgroundColor: colors.primaryColor,
  },
  toggleThumb: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
