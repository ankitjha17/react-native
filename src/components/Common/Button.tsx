import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  Text,
  ActivityIndicator,
  Easing,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";
import typography from "@/src/constants/typography";

interface ButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "filled" | "outlined";
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  leftIconName?: keyof typeof Ionicons.glyphMap;
  leftIconColor?: string;
  leftIconSize?: number;
}

export default function Button({
  text,
  onPress,
  disabled = false,
  loading = false,
  variant = "filled",
  backgroundColor,
  textColor,
  borderColor,
  borderWidth,
  leftIconName,
  leftIconColor,
  leftIconSize = 20,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Press animation
  const scale = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.97,
      duration: 100,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Determine colors based on variant
  const getBackgroundColor = (): string => {
    if (isDisabled) return "#ccc";
    if (variant === "outlined") return colors.white;
    if (backgroundColor) return backgroundColor;
    return colors.button;
  };

  const getTextColor = (): string => {
    if (isDisabled) return colors.white;
    if (textColor) return textColor;
    if (variant === "outlined") return backgroundColor || colors.button;
    return colors.white;
  };

  const getBorderColor = (): string => {
    if (isDisabled) return "#ccc";
    if (borderColor) return borderColor;
    if (variant === "outlined") return backgroundColor || colors.button;
    return "transparent";
  };

  const getBorderWidth = (): number => {
    if (borderWidth !== undefined) return borderWidth;
    if (variant === "outlined") return 1;
    return 0;
  };

  const buttonStyle: ViewStyle = {
    width: "100%",
    height: 54,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: getBackgroundColor(),
    borderWidth: getBorderWidth(),
    borderColor: getBorderColor(),
  };

  const textStyle: TextStyle = {
    fontFamily: fonts.family.semiBold,
    fontWeight: fonts.weight.semiBold,
    fontSize: typography.buttonText,
    lineHeight: Math.round(typography.buttonText * 1.2),
    letterSpacing: 0,
    textAlign: "center",
    color: getTextColor(),
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={isDisabled}
        style={buttonStyle}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <>
            {leftIconName ? (
              <Ionicons
                name={leftIconName}
                size={leftIconSize}
                color={leftIconColor ?? getTextColor()}
              />
            ) : null}
            <Text style={textStyle} maxFontSizeMultiplier={1.2}>
              {text}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}
