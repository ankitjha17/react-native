import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";
import typography from "@/src/constants/typography";

type InfoBannerProps = {
  text: string;
};

export default function InfoBanner({ text }: InfoBannerProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = 20; // consistent margin on both sides
  const bannerWidth = width - horizontalPadding * 2;

  // Calculate available width for text (banner width - container padding - icon - gap)
  const containerPadding = 16 * 2; // paddingLeft + paddingRight
  const iconWidth = 18;
  const gap = 8;
  const textContainerWidth = bannerWidth - containerPadding - iconWidth - gap;

  return (
    <View style={[styles.container, { width: bannerWidth }]}>
      <View style={[styles.textContainer, { width: textContainerWidth }]}>
        <Text style={styles.text} allowFontScaling maxFontSizeMultiplier={1.2}>
          {text}
        </Text>
      </View>
      <View style={styles.icon}>
        <Ionicons
          name="information-circle-outline"
          size={18}
          color={colors.primaryColor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    gap: 8,
    backgroundColor: "#ED99231F",
    borderColor: "#11111133",
    alignSelf: "center",
  },
  textContainer: {
    minHeight: 36,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  text: {
    width: "100%",
    textAlign: "right",
    color: colors.darkBlack,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: typography.serviceText,
    lineHeight: Math.round(typography.serviceText * 1.5),
    letterSpacing: 0,
  },
  icon: {
    width: 18,
    height: 18,
    marginTop: -18,
  },
});
