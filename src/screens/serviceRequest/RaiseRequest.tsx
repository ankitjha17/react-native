import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DetailHeader from "../../components/Common/DetailHeader";
import RequestCard from "../../components/RequestCard";
import ToggleButton, { ToggleValue } from "../../components/ToggleButton";
import colors from "../../constants/colors";
import { useAppNavigation } from "../../hooks/useAppNavigation";

type Request = {
  id: string;
  requestId: string;
  requestType: string;
  status: "Active" | "Inactive" | "Processing" | "Initiated";
  startDate: string;
  validTill: string;
  premiumPerMonth?: string;
  companyName?: string;
};

const MOCK_REQUESTS: Request[] = [
  {
    id: "1",
    requestId: "(UP65EQ2828)",
    requestType: "Car Insurance",
    status: "Active",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
    companyName: "Tata Nexon",
  },
  {
    id: "2",
    requestId: "(UP65EQ2828)",
    requestType: "Travel Insurance",
    status: "Processing",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
    companyName: "₪ 15 Lakh Accidental Cover",
  },
  {
    id: "3",
    requestId: "(UP65EQ2828)",
    requestType: "Health Insurance",
    status: "Initiated",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
    companyName: "Sum Insured Covered",
  },
  {
    id: "4",
    requestId: "(UP65EQ2828)",
    requestType: "Health Insurance",
    status: "Inactive",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
    companyName: "Sum Insured Covered",
  },
];

export default function RaiseRequest() {
  const { navigateToRaiseRequestCardDetails, goBack } = useAppNavigation();
  const { width } = useWindowDimensions();
  const horizontalPadding = 20;
  const cardWidth = width - horizontalPadding * 2;
  const [selectedStatus, setSelectedStatus] = useState<ToggleValue>("Open");

  const filteredRequests = useMemo(() => {
    return MOCK_REQUESTS.filter((request) => {
      if (selectedStatus === "Open") {
        // Show Active, Processing, or Initiated
        return (
          request.status === "Active" ||
          request.status === "Processing" ||
          request.status === "Initiated"
        );
      } else if (selectedStatus === "Close") {
        // Show Inactive
        return request.status === "Inactive";
      }
      return true;
    });
  }, [selectedStatus]);

  const handleCardPress = (request: Request) => {
    navigateToRaiseRequestCardDetails({ request });
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.maincontainer}>
      <DetailHeader title="Raise a Request" onBackPress={goBack} />

      {/* Fixed Toggle Button */}
      <View style={styles.toggleContainer}>
        <ToggleButton
          onChange={(val) => setSelectedStatus(val)}
          initialValue="Open"
          leftText="Close"
          rightText="Open"
        />
      </View>

      {/* Scrollable Request Cards */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredRequests.map((request) => (
          <RequestCard
            key={request.id}
            width={cardWidth}
            status={request.status}
            requestId={request.requestId}
            requestType={request.requestType}
            startDate={request.startDate}
            validTill={request.validTill}
            premiumPerMonth={request.premiumPerMonth}
            companyName={request.companyName}
            onPress={() => handleCardPress(request)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  toggleContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
