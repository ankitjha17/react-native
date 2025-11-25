import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, Text, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PolicyCard from "../../components/Common/PolicyCard";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import CommonHeader from "@/src/components/Common/CommonHeader";

type Policy = {
  id: string;
  status: "Active" | "Expired" | "Initiated" | "Processing";
  name: string;
  policyNumber: string;
  startDate: string;
  validTill: string;
  premiumPerMonth: string;
};

const MOCK_POLICIES: Policy[] = [
  {
    id: "1",
    status: "Active",
    name: "Health Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
  {
    id: "2",
    status: "Initiated",
    name: "Travel Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
  {
    id: "3",
    status: "Processing",
    name: "Vehicle Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
];

export default function Claims() {
  const { navigateToSupport } = useAppNavigation();
  const { width } = useWindowDimensions();
  const horizontalPadding = 20;
  const cardWidth = width - horizontalPadding * 2;

  const renderItem = useCallback(
    ({ item }: { item: Policy }) => (
      <PolicyCard
        width={cardWidth}
        status={item.status}
        name={item.name}
        policyNumber={item.policyNumber}
        startDate={item.startDate}
        validTill={item.validTill}
        premiumPerMonth={item.premiumPerMonth}
      />
    ),
    [cardWidth]
  );

  const keyExtractor = useCallback((item: Policy) => item.id, []);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.maincontainer}>
      <CommonHeader
        title="File a Claim"
        subtitle="Fast, simple, and hassle-free claims at your fingertips"
        rightIcon="headset-outline"
        onRightPress={navigateToSupport}
        backgroundImage={require("../../assets/images/background.png")}
      />

      <LinearGradient
        colors={[
          colors.white,
          colors.gradientLightGray2,
          colors.gradientLightGray,
        ]}
        locations={[0, 0.7024, 1]}
        style={[styles.policiesContainer, { width }]}
      >
        <Text
          style={styles.sectionTitle}
          allowFontScaling
          maxFontSizeMultiplier={1.2}
        >
          View All Claims
        </Text>
        <Text
          style={styles.sectionSubTitle}
          allowFontScaling
          maxFontSizeMultiplier={1.2}
        >
          File a new claim or view claim
        </Text>
        <FlatList
          data={MOCK_POLICIES}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
  headerContainer: {
    height: 240,
    minHeight: 240,
    padding: 20,
    justifyContent: "flex-start",
  },
  headerImage: {
    height: "100%",
    resizeMode: "cover",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  headingContainer: {
    alignItems: "flex-end",
    width: "100%",
  },
  headingText: {
    fontFamily: fonts.family.bold,
    fontWeight: fonts.weight.bold,
    fontSize: typography.cardHeadText2,
    lineHeight: 28,
    color: colors.white,
    textAlign: "right",
    marginBottom: 4,
  },
  subtitleText: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: typography.cardHeadText2,
    lineHeight: 22,
    color: colors.whiteAlpha85,
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: typography.cardHeadText2,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    color: colors.darkBlack,
    textAlign: "right",
    marginBottom: 6,
    paddingRight: 8,
    lineHeight: Math.round(typography.cardHeadText2 * 1.2),
    letterSpacing: 0,
  },
  sectionSubTitle: {
    fontSize: typography.serviceText,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    color: colors.darkBlack,
    textAlign: "right",
    marginBottom: 20,
    paddingRight: 8,
    lineHeight: Math.round(typography.cardHeadText2 * 1.2),
    letterSpacing: 0,
  },
  policiesContainer: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: -64,
    overflow: "hidden",
  },
  listContent: {
    paddingBottom: 100,
  },
});
