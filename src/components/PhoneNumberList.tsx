import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";

type PhoneNumberListBoxProps = {
  numbers: string[]; // Array of phone numbers
  onPress?: (number: string) => void; // Optional press handler for each
  containerStyle?: any; // Optional external styling
};

export default function PhoneNumberListBox({
  numbers,
  onPress,
  containerStyle,
}: PhoneNumberListBoxProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {numbers.map((num, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.7}
          onPress={() => onPress && onPress(num)}
          disabled={!onPress}
          style={styles.numberBox}
        >
          {/* Phone number text (right-aligned) */}
          <Text style={styles.numberText}>{num}</Text>

          {/* Phone icon on the right */}
          <Ionicons
            name="call-outline"
            size={20}
            color="#606060"
            style={styles.icon}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10, // space between boxes
  },
  numberBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", // 👈 aligns everything toward the right
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    height: 40,
    paddingHorizontal: 16,
  },
  numberText: {
    flex: 1,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 16,
    color: colors.black || "#000",
    textAlign: "right", // 👈 right-aligns text
    marginRight: 8,
  },
  icon: {
    marginLeft: 8, // small spacing between text and icon
  },
});
