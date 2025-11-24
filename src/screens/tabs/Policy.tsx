import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PolicyCard from "../../components/Common/PolicyCard";
import ToggleButton from "../../components/ToggleButton";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import CommonHeader from "@/src/components/Common/CommonHeader";

type Policy = {
  id: string;
  status: "Active" | "Expired";
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
    status: "Active",
    name: "Travel Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
  {
    id: "3",
    status: "Expired",
    name: "Business Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
  {
    id: "4",
    status: "Expired",
    name: "Vehicle Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
  {
    id: "5",
    status: "Active",
    name: "Life Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
  {
    id: "6",
    status: "Active",
    name: "Apartment Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
  {
    id: "7",
    status: "Active",
    name: "Business Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
  {
    id: "8",
    status: "Active",
    name: "Vehicle Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
];

export default function Policy() {
  const { navigateToClaimProcess, navigateToSupport } = useAppNavigation();
  const { width } = useWindowDimensions();
  const horizontalPadding = 20;
  const cardWidth = width - horizontalPadding * 2;
  const [selectedStatus, setSelectedStatus] = useState<"Active" | "Expired">(
    "Active"
  );

  const handleRaiseClaim = useCallback(
    (policyName: string) => {
      navigateToClaimProcess(policyName);
    },
    [navigateToClaimProcess]
  );

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
        showStatusBadge={selectedStatus === "Active"}
        isFromPolicyScreen
        selectedStatus={selectedStatus}
        onRaiseClaim={() => handleRaiseClaim(item.name)}
        onContactSupport={navigateToSupport}
      />
    ),
    [cardWidth, selectedStatus, handleRaiseClaim, navigateToSupport]
  );

  const keyExtractor = useCallback((item: Policy) => item.id, []);
  const filteredPolicies = useMemo(
    () => MOCK_POLICIES.filter((p) => p.status === selectedStatus),
    [selectedStatus]
  );

  return (
    <SafeAreaView edges={["bottom"]} style={styles.maincontainer}>
      <CommonHeader
        title="All Policies"
        subtitle="Select a category and explore the best policy options for you"
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
        <ToggleButton
          initialValue="Active"
          onChange={(val) => {
            if (val === "Active" || val === "Expired") {
              setSelectedStatus(val);
            }
          }}
        />
        <Text
          style={styles.sectionTitle}
          allowFontScaling
          maxFontSizeMultiplier={1.2}
        >
          {selectedStatus === "Active"
            ? "Active Policies"
            : "Inactive Policies"}
        </Text>
        {filteredPolicies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text
              style={styles.emptyText}
              allowFontScaling
              maxFontSizeMultiplier={1.2}
            >
              No {selectedStatus === "Active" ? "active" : "inactive"} policies
              found
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredPolicies}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
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
    fontFamily: "Rubik",
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 28,
    color: "#FFFFFF",
    textAlign: "right",
    marginBottom: 4,
  },
  subtitleText: {
    fontFamily: "Rubik",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 22,
    color: "rgba(255,255,255,0.85)",
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: typography.cardHeadText2,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: typography.serviceText,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    color: colors.darkBlack,
    textAlign: "center",
    opacity: 0.6,
  },
});
