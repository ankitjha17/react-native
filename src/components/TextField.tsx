import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";
import typography from "@/src/constants/typography";

type TextFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  editable?: boolean;
  multiline?: boolean;
  iconLeftName?: keyof typeof Ionicons.glyphMap;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  height?: number;
  containerStyle?: any;
  isLast?: boolean; // If true, uses 20px marginBottom instead of 24px
};

export default function TextField({
  label,
  value,
  placeholder,
  onChangeText,
  onFocus,
  editable = true,
  multiline = false,
  iconLeftName,
  rightIconName,
  onPress,
  leftIcon,
  rightIcon,
  height,
  containerStyle,
  isLast = false,
}: TextFieldProps) {
  const inputHeight = height || 54;

  const isPressable = !!onPress || editable === false;

  const hasLeftIcon = !!leftIcon || !!iconLeftName;
  const hasRightIcon = !!rightIcon || !!rightIconName;

  const inputContent = (
    <View style={[styles.inputContainer, { height: inputHeight }]}>
      {leftIcon ? (
        <View style={styles.leftIconContainer}>{leftIcon}</View>
      ) : iconLeftName ? (
        <View style={styles.leftIconContainer}>
          <Ionicons name={iconLeftName} size={18} color={colors.black60} />
        </View>
      ) : null}
      <View
        style={[
          styles.inputContentWrapper,
          hasLeftIcon && styles.inputContentWithLeftIcon,
        ]}
      >
        {isPressable ? (
          <Text
            style={[
              styles.inputText,
              !value && styles.placeholderText,
              hasRightIcon && styles.inputTextWithRightIcon,
            ]}
          >
            {value || placeholder}
          </Text>
        ) : (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            placeholder={placeholder}
            placeholderTextColor="#999999"
            style={[
              styles.textInput,
              hasRightIcon && styles.inputTextWithRightIcon,
            ]}
            textAlign="right"
            multiline={multiline}
            editable={editable}
          />
        )}
        {rightIcon ? (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        ) : rightIconName ? (
          <View style={styles.rightIconContainer}>
            <Ionicons name={rightIconName} size={18} color={colors.black60} />
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <View
      style={[styles.container, isLast && styles.containerLast, containerStyle]}
    >
      <Text style={styles.label}>{label}</Text>
      {isPressable ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          {inputContent}
        </TouchableOpacity>
      ) : (
        inputContent
      )}
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
    backgroundColor: "#FFFFFF",
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
  inputContentWithLeftIcon: {
    marginLeft: 0,
  },
  rightIconContainer: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.4), // 140% line height
    letterSpacing: 0,
    textAlign: "right",
    color: colors.black,
    padding: 0,
    margin: 0,
    minWidth: 0, // Allow text to shrink when needed
  },
  inputText: {
    flex: 1,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.4), // 140% line height
    letterSpacing: 0,
    textAlign: "right",
    color: colors.black,
    minWidth: 0, // Allow text to shrink when needed
  },
  inputTextWithRightIcon: {
    marginRight: 8,
  },
  placeholderText: {
    color: "#999999",
  },
});
