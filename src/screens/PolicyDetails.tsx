import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButtonGroup from "../components/Common/ActionButtonGroup";
import DetailHeader from "../components/Common/DetailHeader";
import DetailSectionCard, {
  DetailItem,
} from "../components/Common/DetailSectionCard";
import PolicyOverviewCard from "../components/PolicyOverviewCard";
import colors from "../constants/colors";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { AppStackParamList } from "../navigation/AppStack";

type PolicyDetailsRouteProp = RouteProp<AppStackParamList, "PolicyDetails">;

export default function PolicyDetails() {
  const { navigateToClaimProcess, navigateToSupport, goBack } =
    useAppNavigation();
  const { navigateToClaimsTab } = useAppNavigation();
  const route = useRoute<PolicyDetailsRouteProp>();
  const { width } = useWindowDimensions();

  const horizontalPadding = 20;
  const contentWidth = width - horizontalPadding * 2;

  const {
    name,
    policyNumber,
    status,
    startDate,
    validTill,
    premiumPerMonth,
    // claimNumber,
  } = route.params;

  const policyDetailsData: DetailItem[] = [
    {
      leftLabel: "Valid till",
      leftValue: validTill || "N/A",
      rightLabel: "Premium",
      rightValue: premiumPerMonth || "N/A",
    },
    {
      leftLabel: "Start Date",
      leftValue: startDate || "N/A",
      rightLabel: "Policy Number",
      rightValue: policyNumber || "N/A",
    },
  ];

  const coverageSummaryData: DetailItem[] = [
    {
      leftLabel: "Coverage Limit",
      leftValue: "₪50,000.00",
      rightLabel: "Coverage Type",
      rightValue: "Gold Plan",
    },
    {
      leftLabel: "",
      leftValue: "",
      rightLabel: "Deductible",
      rightValue: "₪15000",
    },
  ];

  const benefitsData: DetailItem[] = [
    {
      leftLabel: "Emergency Cover",
      leftValue: "24/7 ambulance and teleconsultation.",
      rightLabel: "Wellness Benefits",
      rightValue: "Free annual health check-up.",
    },
  ];

  const exclusionData: DetailItem[] = [
    {
      leftLabel: "Waiting Periods",
      leftValue: "Certain illnesses covered after 24 months.",
      rightLabel: "Not Covered",
      rightValue: "Cosmetic procedures and experimental treatments",
    },
  ];

  const renewalData: DetailItem[] = [
    {
      leftLabel: "Premium on Renewal",
      leftValue: "May vary based on coverage.",
      rightLabel: "Renewal Date",
      rightValue: "5 August 26",
    },
  ];

  return (
    <SafeAreaView edges={["bottom"]} style={styles.maincontainer}>
      <DetailHeader
        title={`${name || "Policy"} Detail`}
        onBackPress={goBack}
        rightIcon="headset-outline"
        onRightPress={navigateToSupport}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: horizontalPadding },
        ]}
      >
        {/* Policy Overview Card */}
        <View style={[styles.policyOverviewWrapper, { width: contentWidth }]}>
          <PolicyOverviewCard
            insuranceName={name || "Insurance"}
            // claimNumber={claimNumber || "To be assign"}
            policyNumber={policyNumber || "N/A"}
            status={status || "Active"}
          />
        </View>

        {/* Dynamic-width detail cards */}
        <DetailSectionCard
          title="Policy Details"
          iconName="checkmark-outline"
          data={policyDetailsData}
        />

        <DetailSectionCard
          title="Coverage Summary"
          iconName="shield-outline"
          data={coverageSummaryData}
        />

        <DetailSectionCard
          title="Benefits & Addons"
          iconName="gift-outline"
          data={benefitsData}
        />

        <DetailSectionCard
          title="Exclusion"
          iconName="close-circle-outline"
          data={exclusionData}
        />

        <DetailSectionCard
          title="Renewal Info"
          iconName="refresh-outline"
          data={renewalData}
        />

        {/* Action Buttons */}
        <View style={[styles.buttonContainer, { width: contentWidth }]}>
          <ActionButtonGroup
            leftButton={{
              text: "Claim History",
              onPress: () => navigateToClaimsTab(),
              variant: "outlined",
              backgroundColor: colors.button,
            }}
            rightButton={{
              text: "Raise a Claim",
              onPress: () => navigateToClaimProcess(name),
              variant: "filled",
              backgroundColor: colors.button,
            }}
            gap={12}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 6,
  },
  policyOverviewWrapper: {
    marginTop: 24,
    alignSelf: "center",
  },
  buttonContainer: {
    marginTop: 0,
    marginBottom: 20,
    alignSelf: "center",
  },
});
