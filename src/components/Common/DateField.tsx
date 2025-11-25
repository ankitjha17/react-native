import { Feather } from "@expo/vector-icons";
import React, { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";

type DateFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  onPress: (position: { x: number; y: number; width: number }) => void;
  height?: number;
  containerStyle?: any;
  isLast?: boolean; // If true, uses 20px marginBottom instead of 24px
};

export default function DateField({
  label,
  value,
  placeholder = "Select / Enter date",
  onPress,
  height,
  containerStyle,
  isLast = false,
}: DateFieldProps) {
  const containerRef = useRef<View>(null);
  const inputHeight = height || 54;

  const handlePress = () => {
    if (containerRef.current) {
      containerRef.current.measureInWindow((x, y, width, height) => {
        const gap = 4; // Gap between input and calendar
        onPress({
          x: x, // Left position - aligns with input left edge
          y: y + height + gap, // Top position - below input with gap
          width: width, // Same width as input
        });
      });
    } else {
      onPress({ x: 0, y: 0, width: 335 });
    }
  };

  const inputContent = (
    <View style={[styles.inputContainer, { height: inputHeight }]}>
      <View style={styles.leftIconContainer}>
        <Feather name="calendar" size={20} color={colors.black60} />
      </View>
      <View style={styles.inputContentWrapper}>
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      ref={containerRef}
      style={[styles.container, isLast && styles.containerLast, containerStyle]}
      collapsable={false}
    >
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        {inputContent}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
  },
  containerLast: {
    marginBottom: 20,
  },
  label: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: typography.headingText1,
    lineHeight: Math.round(typography.headingText1 * 1.4),
    letterSpacing: 0,
    textAlign: "right",
    color: colors.deeptealColor,
    marginBottom: 24,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1111111F",
    backgroundColor: colors.white,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  leftIconContainer: {
    marginRight: 8,
  },
  inputContentWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  inputText: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.4), // 140% line height
    letterSpacing: 0,
    textAlign: "right",
    color: colors.black,
  },
  placeholderText: {
    color: colors.gray500,
  },
});
