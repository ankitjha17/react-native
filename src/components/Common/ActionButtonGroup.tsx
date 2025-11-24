import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";

export type ActionButton = {
  text: string;
  onPress: () => void;
  variant?: "outlined" | "filled";
  icon?: string;
  iconPosition?: "left" | "right";
  iconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
};

export type ActionButtonGroupProps = {
  leftButton: ActionButton;
  rightButton: ActionButton;
  containerStyle?: any;
  gap?: number;
  buttonHeight?: number; // Optional button height, default: 54
};

export default function ActionButtonGroup({
  leftButton,
  rightButton,
  containerStyle,
  gap = 12,
  buttonHeight = 54,
}: ActionButtonGroupProps) {
  const renderButton = (button: ActionButton) => {
    const hasIcon = !!button.icon;
    const variant = button.variant || "outlined";
    const buttonBgColor = button.backgroundColor || colors.button;
    const buttonBorderColor = button.borderColor || buttonBgColor;
    const buttonTextColor =
      button.textColor || (variant === "filled" ? colors.white : buttonBgColor);
    const iconColor = button.iconColor || buttonTextColor;
    const iconPosition = button.iconPosition || "left";

    return (
      <TouchableOpacity
        style={[
          styles.baseButton,
          { height: buttonHeight },
          hasIcon ? styles.buttonWithIcon : styles.buttonWithoutIcon,
          variant === "outlined"
            ? [
                styles.outlined,
                {
                  borderColor: buttonBorderColor,
                  backgroundColor: colors.white,
                },
              ]
            : [styles.filled, { backgroundColor: buttonBgColor }],
        ]}
        onPress={button.onPress}
        accessibilityRole="button"
        accessibilityLabel={button.text}
      >
        {hasIcon && iconPosition === "left" && (
          <Ionicons name={button.icon as any} size={24} color={iconColor} />
        )}
        <Text
          style={[
            styles.baseText,
            hasIcon ? styles.textWithIcon : styles.textWithoutIcon,
            { color: buttonTextColor },
          ]}
        >
          {button.text}
        </Text>
        {hasIcon && iconPosition === "right" && (
          <Ionicons name={button.icon as any} size={24} color={iconColor} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { gap }, containerStyle]}>
      {renderButton(leftButton)}
      {renderButton(rightButton)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },
  baseButton: {
    flex: 1,
    borderRadius: 12,
    // height and paddingVertical are set dynamically via inline style
  },
  buttonWithIcon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
  },
  buttonWithoutIcon: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  outlined: {
    borderWidth: 1,
  },
  filled: {
    borderWidth: 0,
  },
  baseText: {
    fontFamily: fonts.family.semiBold,
    fontSize: typography.headingText1,
  },
  textWithIcon: {
    // Text aligns naturally with flex row
  },
  textWithoutIcon: {
    textAlign: "center",
    width: "100%",
  },
});
