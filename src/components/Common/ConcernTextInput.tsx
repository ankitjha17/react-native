import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";

type ConcernTextInputProps = {
  title: string;
  iconName?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  containerStyle?: any;
  useClaimProcessStyle?: boolean; // When true, applies ClaimProcessInput title styling
};

export default function ConcernTextInput({
  title,
  iconName,
  placeholder,
  value,
  onChangeText,
  containerStyle,
  useClaimProcessStyle = false,
}: ConcernTextInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Title with Icon - Right Aligned */}
      <View style={styles.titleContainer}>
        <Text
          style={
            useClaimProcessStyle
              ? styles.titleTextClaimProcess
              : styles.titleText
          }
        >
          {title}
        </Text>
        {iconName && (
          <View style={styles.icon}>
            <Ionicons name={iconName as any} size={24} color={colors.black} />
          </View>
        )}
      </View>

      {/* Text Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.black60}
          multiline
          textAlign="right"
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
    marginBottom: 20,
  },
  titleContainer: {
    width: "100%",
    height: 24,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },
  titleText: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: 16,
    lineHeight: Math.round(16 * 1.2), // 120% line height
    letterSpacing: 0,
    textAlign: "center",
    color: colors.black,
  },
  titleTextClaimProcess: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.4), // 140% line height
    letterSpacing: 0,
    textAlign: "right",
    color: colors.deeptealColor, // #1E4646
  },
  icon: {
    width: 24,
    height: 24,
  },
  inputContainer: {
    width: "100%",
    height: 150,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.boxBorder,
    padding: 16,
    backgroundColor: colors.white,
  },
  textInput: {
    flex: 1,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 12,
    lineHeight: Math.round(12 * 1.4), // 140% line height
    letterSpacing: 0,
    textAlign: "right",
    color: colors.black,
    padding: 0,
  },
});
