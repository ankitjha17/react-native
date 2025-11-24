import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import CategoryDropdown, { CategoryOption } from "./CategoryDropdown";

type DropdownFieldProps = {
  label: string;
  options: CategoryOption[];
  value?: string;
  placeholder?: string;
  onSelect: (option: CategoryOption) => void;
  containerStyle?: any;
};

export default function DropdownField({
  label,
  options,
  value,
  placeholder = "Select a Category",
  onSelect,
  containerStyle,
}: DropdownFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <CategoryDropdown
        options={options}
        value={value}
        placeholder={placeholder}
        onSelect={onSelect}
        useClaimProcessStyle={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
  },
  label: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: typography.headingText1,
    lineHeight: Math.round(typography.headingText1 * 1.4),
    letterSpacing: 0,
    textAlign: "right",
    color: colors.darkBlack,
    marginBottom: 24, // Gap between label and input is handled by CategoryDropdown spacing
  },
});
