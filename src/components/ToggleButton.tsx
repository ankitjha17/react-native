import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";
import typography from "@/src/constants/typography";

export type ToggleValue = "Active" | "Expired" | "Open" | "Close";

export type ToggleButtonProps = {
  onChange?: (value: ToggleValue) => void;
  initialValue?: ToggleValue;
  marginBottom?: number;
  containerStyle?: object;
  leftText?: string;
  rightText?: string;
};

export default function ToggleButton({
  onChange,
  initialValue = "Expired",
  marginBottom,
  containerStyle,
  leftText = "Inactive",
  rightText = "Active",
}: ToggleButtonProps) {
  const [selected, setSelected] = useState<ToggleValue>(initialValue);

  const handlePress = (value: ToggleValue) => {
    setSelected(value);
    onChange?.(value);
  };

  // Determine which button is selected based on the current selected value
  const isLeftSelected = selected === "Expired" || selected === "Close";
  const isRightSelected = selected === "Active" || selected === "Open";

  return (
    <View
      style={[
        styles.container,
        marginBottom !== undefined && { marginBottom },
        containerStyle,
      ]}
    >
      <TouchableOpacity
        onPress={() => handlePress(leftText === "Close" ? "Close" : "Expired")}
        style={[
          styles.button,
          isLeftSelected ? styles.buttonActive : styles.buttonInactive,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Filter by ${leftText.toLowerCase()}`}
        accessibilityState={{ selected: isLeftSelected }}
      >
        <Text
          style={[
            styles.buttonText,
            isLeftSelected
              ? styles.buttonTextActive
              : styles.buttonTextInactive,
          ]}
          allowFontScaling
          maxFontSizeMultiplier={1.2}
        >
          {leftText}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handlePress(rightText === "Open" ? "Open" : "Active")}
        style={[
          styles.button,
          isRightSelected ? styles.buttonActive : styles.buttonInactive,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Filter by ${rightText.toLowerCase()}`}
        accessibilityState={{ selected: isRightSelected }}
      >
        <Text
          style={[
            styles.buttonText,
            isRightSelected
              ? styles.buttonTextActive
              : styles.buttonTextInactive,
          ]}
          allowFontScaling
          maxFontSizeMultiplier={1.2}
        >
          {rightText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.toggleBackground,
    borderRadius: 76,
    padding: 4,
    height: 44,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    height: 36,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    backgroundColor: colors.toggleActive,
  },
  buttonInactive: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: typography.serviceText,
    lineHeight: Math.round(typography.serviceText * 1.5),
  },
  buttonTextActive: {
    color: colors.white,
  },
  buttonTextInactive: {
    color: colors.toggleInactiveText,
  },
});
