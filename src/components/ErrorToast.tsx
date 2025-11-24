import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";
import typography from "@/src/constants/typography";

export type ErrorType = "error" | "network" | "api" | "warning";

interface ErrorToastProps {
  message: string;
  type?: ErrorType;
  visible: boolean;
  onDismiss?: () => void;
  duration?: number; // Auto-dismiss duration in ms (0 = no auto-dismiss)
  position?: "top" | "bottom";
}

export default function ErrorToast({
  message,
  type = "error",
  visible,
  onDismiss,
  duration = 5000, // Default 5 seconds
  position = "top",
}: ErrorToastProps) {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: position === "top" ? -100 : 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) {
        onDismiss();
      }
    });
  }, [slideAnim, position, opacityAnim, onDismiss]);

  useEffect(() => {
    if (visible) {
      // Slide in animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss if duration > 0
      if (duration > 0 && onDismiss) {
        timeoutRef.current = setTimeout(() => {
          handleDismiss();
        }, duration);
      }
    } else {
      handleDismiss();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, duration, handleDismiss, onDismiss, slideAnim, opacityAnim]);

  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "network":
        return "cloud-offline-outline";
      case "api":
        return "alert-circle-outline";
      case "warning":
        return "warning-outline";
      default:
        return "close-circle-outline";
    }
  };

  const getBackgroundColor = (): string => {
    switch (type) {
      case "network":
        return "#FF404333"; // Light red background
      case "api":
        return "#FF404333"; // Light red background
      case "warning":
        return "#ED992333"; // Light orange background
      default:
        return "#FF404333"; // Light red background
    }
  };

  const getIconColor = (): string => {
    switch (type) {
      case "network":
        return colors.inactiveRed;
      case "api":
        return colors.inactiveRed;
      case "warning":
        return colors.orange;
      default:
        return colors.inactiveRed;
    }
  };

  const getBorderColor = (): string => {
    switch (type) {
      case "network":
        return colors.inactiveRed;
      case "api":
        return colors.inactiveRed;
      case "warning":
        return colors.orange;
      default:
        return colors.inactiveRed;
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          top: position === "top" ? 50 : undefined,
          bottom: position === "bottom" ? 50 : undefined,
        },
      ]}
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
          },
        ]}
      >
        <View style={styles.content}>
          <Ionicons
            name={getIconName()}
            size={20}
            color={getIconColor()}
            style={styles.icon}
          />
          <Text style={styles.message} maxFontSizeMultiplier={1.2}>
            {message}
          </Text>
        </View>
        {onDismiss && (
          <TouchableOpacity
            onPress={handleDismiss}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={18} color={colors.darkBlack} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 9999,
    elevation: 5,
  },
  toast: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    marginRight: 0,
  },
  message: {
    flex: 1,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: typography.serviceText,
    lineHeight: Math.round(typography.serviceText * 1.4),
    color: colors.darkBlack,
    textAlign: "left",
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
