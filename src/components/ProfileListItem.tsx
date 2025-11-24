import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";
import typography from "@/src/constants/typography";

interface ProfileListItemProps {
  title: string;
  subtitle: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  showLeftChevron?: boolean;
}

const ProfileListItem: React.FC<ProfileListItemProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  showLeftChevron = true,
}) => {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    "square-check-big": "checkbox-outline",
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {showLeftChevron && (
        <Ionicons name="chevron-back" size={18} color={colors.gray500} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title} allowFontScaling={true}>
          {title}
        </Text>
        <Text style={styles.subtitle} allowFontScaling={true}>
          {subtitle}
        </Text>
      </View>

      {icon ? (
        <Ionicons
          name={(iconMap[icon] ?? icon) as keyof typeof Ionicons.glyphMap}
          size={24}
          color={colors.primaryColor}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gradientLightGray,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: "flex-end",
  },
  title: {
    fontSize: typography.cardHeadText2,
    fontFamily: fonts.family.medium,
    color: colors.black,
    fontWeight: fonts.weight.medium,
    textAlign: "right",
  },
  subtitle: {
    fontSize: typography.headingText1,
    fontFamily: fonts.family.regular,
    color: colors.gray500,
    textAlign: "right",
  },
});

export default ProfileListItem;
