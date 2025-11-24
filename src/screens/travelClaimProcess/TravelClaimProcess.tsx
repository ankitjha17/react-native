import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButtonGroup from "../../components/Common/ActionButtonGroup";
import { CategoryOption } from "../../components/Common/CategoryDropdown";
import ClaimProcessInput from "../../components/Common/ClaimProcessInput";
import DateField from "../../components/Common/DateField";
import DetailHeader from "../../components/Common/DetailHeader";
import DropdownField from "../../components/Common/DropdownField";
import InfoBanner from "../../components/InfoBanner";
import PhoneNumberListBox from "../../components/PhoneNumberList";
import TextField from "../../components/TextField";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import ConcernTextInput from "@/src/components/Common/ConcernTextInput";
import Button from "@/src/components/Common/Button";
import CalendarModal from "@/src/components/Common/CalendarModal";

export default function TravelClaimProcess() {
  const { goBack, navigateToSupport, navigateToClaimSuccess } =
    useAppNavigation();

  // Claim type selection
  const [claimTypeId, setClaimTypeId] = React.useState<string | undefined>(
    undefined
  );
  const claimTypeOptions: CategoryOption[] = [
    { id: "1", label: "Medical Expense" },
    { id: "2", label: "Trip Cancellation" },
    { id: "3", label: "Trip Extension" },
    { id: "4", label: "Lost Baggage" },
  ];

  // Claimant information
  const [claimantName, setClaimantName] = React.useState("");
  const [claimantIdPassport, setClaimantIdPassport] = React.useState("");
  const [claimantPhone, setClaimantPhone] = React.useState("");
  const [claimantEmail, setClaimantEmail] = React.useState("");
  const countryCode = "+972";

  // Travel information - dates
  const [departureDate, setDepartureDate] = React.useState("");
  const [arrivalDate, setArrivalDate] = React.useState("");

  // Incident details
  const [incidentDate, setIncidentDate] = React.useState("");
  const [incidentLocationId, setIncidentLocationId] = React.useState<
    string | undefined
  >(undefined);
  const [incidentDetails, setIncidentDetails] = useState<string>("");

  // Calendar modal state
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [calendarTarget, setCalendarTarget] = React.useState<
    "departure" | "arrival" | "incident" | null
  >(null);
  const [calendarPosition, setCalendarPosition] = React.useState({
    x: 0,
    y: 0,
    width: 335,
  });

  // Assistance contact
  const phoneNumbers = [
    "+972 123456789",
    "+972 123456789",
    "+972 123456789",
    "+972 123456789",
  ];
  const handleMail = () =>
    Linking.openURL("mailto:applications.support@gmail.com");
  const handleChat = () => console.log("Chat now pressed");

  const locationOptions: CategoryOption[] = [
    { id: "IL-TA", label: "Tel Aviv, Israel" },
    { id: "IL-JM", label: "Jerusalem, Israel" },
    { id: "AE-DXB", label: "Dubai, UAE" },
    { id: "US-NYC", label: "New York, USA" },
  ];

  const handleDateSelect = (date: string) => {
    if (calendarTarget === "departure") {
      setDepartureDate(date);
    } else if (calendarTarget === "arrival") {
      setArrivalDate(date);
    } else if (calendarTarget === "incident") {
      setIncidentDate(date);
    }
    setCalendarTarget(null);
  };

  const handleCalendarClose = () => {
    setCalendarOpen(false);
    setCalendarTarget(null);
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.maincontainer}>
      <DetailHeader
        title="Travel Claim Process"
        subtitle="A12735484937"
        onBackPress={goBack}
        rightIcon="headset-outline"
        onRightPress={navigateToSupport}
      />

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        enableResetScrollToCoords={false}
        extraScrollHeight={120}
        extraHeight={120}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.componentSpacing}>
            <InfoBanner
              text={
                "Please provide all necessary information Incident report for better claim process."
              }
            />
          </View>

          <View style={styles.sectionCard}>
            <ClaimProcessInput title="Claim Details">
              <DropdownField
                label="Select the Type of Claim *"
                options={claimTypeOptions}
                value={claimTypeId}
                placeholder="Select Claim Type"
                onSelect={(opt) => setClaimTypeId(opt.id)}
              />
            </ClaimProcessInput>

            <ClaimProcessInput title="Claimant Information">
              <TextField
                label="Name *"
                value={claimantName}
                placeholder="Enter claimant's full name"
                onChangeText={setClaimantName}
              />
              <TextField
                label="ID / Passport No. *"
                value={claimantIdPassport}
                placeholder="Enter ID / Passport No."
                onChangeText={setClaimantIdPassport}
              />
              <TextField
                label="Phone / Mobile Number *"
                value={claimantPhone}
                placeholder="Enter Phone / Mobile Number"
                onChangeText={setClaimantPhone}
                rightIcon={
                  <View style={styles.phoneRightAddon}>
                    <View style={styles.phoneDivider} />
                    <Text style={styles.phoneCode}>{countryCode}</Text>
                  </View>
                }
              />
              <TextField
                label="Email Address *"
                value={claimantEmail}
                placeholder="Enter the email address"
                onChangeText={setClaimantEmail}
                isLast={true}
              />
            </ClaimProcessInput>

            <ClaimProcessInput title="Travel Information">
              <DateField
                label="Date of Travel (Departure) *"
                value={departureDate}
                placeholder="Select / Enter date"
                onPress={(position) => {
                  setCalendarPosition(position);
                  setCalendarTarget("departure");
                  setTimeout(() => {
                    setCalendarOpen(true);
                  }, 10);
                }}
              />
              <DateField
                label="Date of Travel (Arrival) *"
                value={arrivalDate}
                placeholder="Select / Enter date"
                onPress={(position) => {
                  setCalendarPosition(position);
                  setCalendarTarget("arrival");
                  setTimeout(() => {
                    setCalendarOpen(true);
                  }, 10);
                }}
                isLast={true}
              />
            </ClaimProcessInput>
            <ClaimProcessInput title="Incident Details">
              <DateField
                label="Date of incident occured *"
                value={incidentDate}
                placeholder="Select / enter date"
                onPress={(position) => {
                  setCalendarPosition(position);
                  setCalendarTarget("incident");
                  setTimeout(() => {
                    setCalendarOpen(true);
                  }, 10);
                }}
                isLast={true}
              />
              <DropdownField
                label="Location of the Incident occured *"
                options={locationOptions}
                value={incidentLocationId}
                placeholder="Select Location"
                onSelect={(opt) => setIncidentLocationId(opt.id)}
              />
              <ConcernTextInput
                title="Provide Incident Detail *"
                // iconName="document-text-outline"
                placeholder="Enter incident detail"
                value={incidentDetails}
                onChangeText={setIncidentDetails}
                useClaimProcessStyle={true}
              />
            </ClaimProcessInput>
            <ClaimProcessInput
              title="Need Assistance"
              hasBackground={true}
              leftIcon={
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={colors.primaryColor}
                />
              }
            >
              <PhoneNumberListBox
                numbers={phoneNumbers}
                onPress={(num) => console.log("Calling:", num)}
                containerStyle={{ marginBottom: 14 }}
              />
              <ActionButtonGroup
                leftButton={{
                  text: "WhatsApp",
                  onPress: handleMail,
                  variant: "outlined",
                  icon: "logo-whatsapp",
                  iconPosition: "left",
                  iconColor: "#1E4D92",
                  backgroundColor: "#1E4D92",
                  borderColor: "#1E4D92",
                  textColor: "#1E4D92",
                }}
                rightButton={{
                  text: "Email",
                  onPress: handleChat,
                  variant: "outlined",
                  icon: "mail-outline",
                  iconPosition: "left",
                  iconColor: "#1E4D92",
                  backgroundColor: "#1E4D92",
                  borderColor: "#1E4D92",
                  textColor: "#1E4D92",
                }}
                gap={12}
                buttonHeight={40}
              />
            </ClaimProcessInput>
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              text="Submit Claim"
              onPress={navigateToClaimSuccess}
              variant="filled"
              backgroundColor={colors.button}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <CalendarModal
        visible={calendarOpen}
        position={calendarPosition}
        onClose={handleCalendarClose}
        onDateSelect={handleDateSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: typography.headingText1,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    lineHeight: Math.round(typography.headingText1 * 1.4),
    color: colors.darkBlack,
    textAlign: "right",
  },
  buttonsContainer: {
    marginTop: 20,
    width: "100%",
  },

  componentSpacing: {
    marginBottom: 24,
  },
  sectionCard: {
    gap: 24,
  },
  phoneRightAddon: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
  },
  phoneDivider: {
    width: 1,
    height: "100%",
    backgroundColor: colors.boxBorder,
    marginRight: 8,
  },
  phoneCode: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: typography.serviceText,
    color: colors.black60,
  },
  assistanceList: {
    gap: 8,
    marginBottom: 12,
  },
  assistanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.boxBorder,
    paddingHorizontal: 16,
  },
  assistanceText: {
    fontFamily: fonts.family.medium,
    fontSize: typography.cardHeadText2,
    color: colors.black,
    textAlign: "right",
    flex: 1,
    marginRight: 12,
  },
  assistanceActionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
