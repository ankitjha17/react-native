import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";

type YesNoQuestionProps = {
  label: string; // Question text (e.g., "Was the incident reported to the police? *")
  value: "yes" | "no" | null; // Selected value
  onChange: (value: "yes" | "no") => void; // Callback when selection changes
  containerStyle?: any;
};

export default function YesNoQuestion({
  label,
  value,
  onChange,
  containerStyle,
}: YesNoQuestionProps) {
  return (
    <View style={[styles.mainContainer, containerStyle]}>
      {/* Label Container */}
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{label}</Text>
      </View>

      {/* Buttons Container - Single Row */}
      <View style={styles.buttonsContainer}>
        {/* No Button */}
        <TouchableOpacity
          style={[styles.button, value === "no" && styles.buttonSelected]}
          onPress={() => onChange("no")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.buttonText,
              value === "no" && styles.buttonTextSelected,
            ]}
          >
            No
          </Text>
        </TouchableOpacity>

        {/* Yes Button */}
        <TouchableOpacity
          style={[styles.button, value === "yes" && styles.buttonSelected]}
          onPress={() => onChange("yes")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.buttonText,
              value === "yes" && styles.buttonTextSelected,
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: 82,
    gap: 12,
    marginBottom: 40,
  },
  labelContainer: {
    width: "100%",
    height: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  labelText: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.4), // 140% line height
    letterSpacing: 0,
    textAlign: "right",
    color: colors.deeptealColor, // #1E4646
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    height: 40,
    gap: 16,
  },
  button: {
    flex: 1,
    height: 40,
    paddingHorizontal: 14,
    paddingVertical: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryColor, // #008081
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSelected: {
    backgroundColor: "#01999A",
  },
  buttonText: {
    fontFamily: fonts.family.semiBold,
    fontWeight: fonts.weight.semiBold,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.2), // 120% line height
    letterSpacing: 0,
    textAlign: "center",
    color: colors.primaryColor, // #008081
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  buttonTextSelected: {
    color: colors.white, // White text when selected for better contrast
  },
});
