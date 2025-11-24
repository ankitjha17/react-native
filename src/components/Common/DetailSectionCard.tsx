import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";

export type DetailItem = {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
};

export type DetailSectionCardProps = {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  data: DetailItem[];
};

export default function DetailSectionCard({
  title,
  iconName,
  data,
}: DetailSectionCardProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = 20; // consistent margin on both sides
  const cardWidth = width - horizontalPadding * 2;
  const isSingleRow = data.length === 1;
  const cardHeight = isSingleRow ? 86 : 128;

  // Calculate column width dynamically
  const cardContainerPadding = 16 * 2; // padding: 16 on each side
  const gapBetweenColumns = 24; // gap between left and right columns
  const availableWidth = cardWidth - cardContainerPadding;
  const columnWidth = (availableWidth - gapBetweenColumns) / 2; // Equal columns for alignment

  return (
    <View style={[styles.wrapper, { width: cardWidth }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={iconName} size={24} color={colors.primaryColor} />
      </View>

      {/* Card */}
      <View
        style={[
          styles.cardContainer,
          { width: cardWidth, minHeight: cardHeight },
        ]}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.detailRow}>
            <View style={[styles.column, { width: columnWidth }]}>
              <Text style={styles.label}>{item.leftLabel}</Text>
              <Text style={styles.value}>{item.leftValue}</Text>
            </View>
            <View style={[styles.column, { width: columnWidth }]}>
              <Text style={styles.label}>{item.rightLabel}</Text>
              <Text style={styles.value}>{item.rightValue}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    marginBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: typography.cardHeadText2,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    color: colors.darkBlack,
    textAlign: "center",
    lineHeight: Math.round(typography.cardHeadText2 * 1.2),
    letterSpacing: 0,
  },
  cardContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.blackOpacityeight,
    backgroundColor: colors.cardOverViewBackground,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 24,
  },
  column: {
    alignItems: "flex-end",
  },
  label: {
    fontSize: typography.serviceText,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    color: colors.darkBlack,
    marginBottom: 4,
    textAlign: "right",
    lineHeight: Math.round(typography.serviceText * 1.2),
    letterSpacing: 0,
    width: "100%",
  },
  value: {
    fontSize: typography.headingText1,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    color: colors.deeptealColor,
    textAlign: "right",
    lineHeight: Math.round(typography.headingText1 * 1.2),
    letterSpacing: 0,
    width: "100%",
  },
});
