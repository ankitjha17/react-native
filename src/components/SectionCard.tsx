import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";
import typography from "@/src/constants/typography";

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  containerStyle?: any;
  contentStyle?: any;
};

export default function SectionCard({
  title,
  children,
  collapsed,
  onToggle,
  containerStyle,
  contentStyle,
}: SectionCardProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = collapsed !== undefined ? collapsed : internalCollapsed;

  const handleToggle = () => {
    const next = !isCollapsed;
    if (onToggle) {
      onToggle(next);
    } else {
      setInternalCollapsed(next);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.chevronButton}
          onPress={handleToggle}
          accessibilityRole="button"
          accessibilityLabel="Toggle section"
        >
          <Ionicons
            name={isCollapsed ? "chevron-forward" : "chevron-down"}
            size={20}
            color={colors.black}
          />
        </TouchableOpacity>
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.2}>
          {title}
        </Text>
      </View>

      {!isCollapsed && (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.boxBorder,
    backgroundColor: colors.white,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  chevronButton: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: typography.cardHeadText2,
    fontFamily: fonts.family.semiBold,
    fontWeight: fonts.weight.semiBold,
    color: colors.primaryColor,
    textAlign: "right",
  },
  content: {
    gap: 12,
  },
});
