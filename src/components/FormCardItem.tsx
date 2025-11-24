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

type Props = {
  label?: string;
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
  labelBold?: boolean;
  height?: number;
};

const FormCardItem: React.FC<Props> = ({
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
  labelBold,
  height,
}) => {
  const isPressable = !!onPress || editable === false;
  const containerHeight = height ? height : multiline ? 182 : 54;

  if (isPressable) {
    return (
      <TouchableOpacity
        style={[styles.container, { height: containerHeight }]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        {leftIcon ? (
          <View style={styles.iconLeft}>{leftIcon}</View>
        ) : iconLeftName ? (
          <View style={styles.iconLeft}>
            <Ionicons name={iconLeftName} size={18} color={colors.black60} />
          </View>
        ) : null}
        <Text
          style={[
            styles.labelRight,
            labelBold ? { fontFamily: fonts.family.semiBold } : null,
          ]}
        >
          {label}
        </Text>
        <View style={styles.valueRow}>
          <Text style={styles.valueRight}>{value}</Text>
          {rightIcon ? (
            <View style={{ marginLeft: 8 }}>{rightIcon}</View>
          ) : rightIconName ? (
            <View style={{ marginLeft: 8 }}>
              <Ionicons name={rightIconName} size={18} color={colors.black60} />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {leftIcon ? (
        <View style={styles.iconLeft}>{leftIcon}</View>
      ) : iconLeftName ? (
        <View style={styles.iconLeft}>
          <Ionicons name={iconLeftName} size={18} color={colors.black60} />
        </View>
      ) : null}
      <Text
        style={[
          styles.labelRight,
          labelBold ? { fontFamily: fonts.family.semiBold } : null,
        ]}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        style={[
          styles.inputRight,
          iconLeftName || leftIcon ? { paddingLeft: 36 } : null,
          multiline ? { flex: 1, textAlignVertical: "top" } : null,
        ]}
        textAlign="right"
        multiline={multiline}
      />
      {rightIcon ? (
        <View style={{ position: "absolute", right: 12, top: 12 }}>
          {rightIcon}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.boxBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: colors.white,
    width: "100%",
    height: 54,
    alignSelf: "stretch",
  },
  iconLeft: {
    position: "absolute",
    left: 12,
    top: 12,
  },
  labelRight: {
    alignSelf: "flex-end",
    color: colors.black60,
    fontFamily: fonts.family.medium,
    fontSize: typography.serviceText,
    marginBottom: 2,
  },
  inputRight: {
    fontFamily: fonts.family.medium,
    fontSize: typography.cardHeadText2,
    color: colors.black,
    lineHeight: 20,
    paddingVertical: 0,
    minHeight: 20,
  },
  valueRight: {
    fontFamily: fonts.family.bold,
    fontSize: typography.cardHeadText2,
    color: colors.black,
    textAlign: "right",
    flex: 1,
    lineHeight: 20,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

export default FormCardItem;
