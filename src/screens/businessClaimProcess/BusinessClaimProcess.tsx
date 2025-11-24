import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryOption } from "../../components/Common/CategoryDropdown";
import ClaimProcessInput from "../../components/Common/ClaimProcessInput";
import DetailHeader from "../../components/Common/DetailHeader";
import DropdownField from "../../components/Common/DropdownField";
import InfoBanner from "../../components/InfoBanner";
import TextField from "../../components/TextField";
import UploadDocument from "../../components/UploadDocument";
import YesNoQuestion from "../../components/YesNoQuestion";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import ConcernTextInput from "@/src/components/Common/ConcernTextInput";
import Button from "@/src/components/Common/Button";

export default function BusinessClaimProcess() {
  const { goBack, navigateToSupport, navigateToClaimSuccess } =
    useAppNavigation();
  const claimTypeOptions: CategoryOption[] = [
    { id: "1", label: "Injury" },
    { id: "2", label: "Fire" },
    { id: "3", label: "Burglary" },
    { id: "4", label: "NaturalDamage" },
    { id: "5", label: "Water" },
  ];
  // Note: claimTypeId is not used, keeping for potential future use

  // Business details
  const [registeredBusinessName, setRegisteredBusinessName] =
    useState<string>("");
  const [businessIncidentDetails, setBusinessIncidentDetails] =
    useState<string>("");

  // Contact person details
  const [contactPersonName, setContactPersonName] = React.useState("");
  const [contactPersonPhone, setContactPersonPhone] = React.useState("");
  const [contactPersonEmail, setContactPersonEmail] = React.useState("");

  // Claim information details
  const [damageTypeId, setDamageTypeId] = React.useState<string | undefined>(
    undefined
  );
  const [claimIncidentDetails, setClaimIncidentDetails] = useState<string>("");
  const [didAnyoneGoToHospital, setDidAnyoneGoToHospital] = useState<
    "yes" | "no" | null
  >(null);

  const countryCode = "+972";
  return (
    <SafeAreaView edges={["bottom"]} style={styles.maincontainer}>
      <DetailHeader
        title="Business Insurance"
        subtitle="A12735484937"
        onBackPress={goBack}
        rightIcon="headset-outline"
        onRightPress={navigateToSupport}
      />

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
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

          <ClaimProcessInput title="Business Details">
            <TextField
              label="Registered Business Name*"
              value={registeredBusinessName}
              placeholder="Enter the name"
              onChangeText={setRegisteredBusinessName}
            />
            <UploadDocument
              label="Registration / License / ID Number * 
(for company or individual)"
              subtitle="Supported Format: PDF/JPEG/PNG"
              iconName="add-circle-outline"
              onCameraPress={() => {
                console.log("Camera selected - Policy Document");
                // TODO: Implement camera functionality
              }}
              onGalleryPress={() => {
                console.log("Gallery selected - Policy Document");
                // TODO: Implement gallery functionality
              }}
              onFilesPress={() => {
                console.log("Files selected - Policy Document");
                // TODO: Implement files functionality
              }}
            />
            <ConcernTextInput
              title="Provide Incident Details (Include description of damages and any third-party damages, if occurred) *"
              placeholder="Enter incident detail"
              value={businessIncidentDetails}
              onChangeText={setBusinessIncidentDetails}
              useClaimProcessStyle={true}
            />
          </ClaimProcessInput>
          <ClaimProcessInput title="Contact Person Details">
            <TextField
              label="Contact Person Name*"
              value={contactPersonName}
              placeholder="Enter name"
              onChangeText={setContactPersonName}
            />
            <TextField
              label="Phone / Mobile Number *"
              value={contactPersonPhone}
              placeholder="Enter Phone / Mobile Number"
              onChangeText={setContactPersonPhone}
              rightIcon={
                <View style={styles.phoneRightAddon}>
                  <View style={styles.phoneDivider} />
                  <Text style={styles.phoneCode}>{countryCode}</Text>
                </View>
              }
            />
            <TextField
              label="Contact Person Email Address *"
              value={contactPersonEmail}
              placeholder="Enter the email address"
              onChangeText={setContactPersonEmail}
              isLast={true}
            />
          </ClaimProcessInput>
          <ClaimProcessInput title="Claim Information Details">
            <DropdownField
              label="Select the Type of Damage*"
              options={claimTypeOptions}
              value={damageTypeId}
              placeholder="Select Damage Type"
              onSelect={(opt) => setDamageTypeId(opt.id)}
            />
            <UploadDocument
              label="Upload the photos of Damage Caused*"
              subtitle="Supported Format: PDF/JPEG/PNG"
              iconName="add-circle-outline"
              onCameraPress={() => {
                console.log("Camera selected - Policy Document");
                // TODO: Implement camera functionality
              }}
              onGalleryPress={() => {
                console.log("Gallery selected - Policy Document");
                // TODO: Implement gallery functionality
              }}
              onFilesPress={() => {
                console.log("Files selected - Policy Document");
                // TODO: Implement files functionality
              }}
            />
            <ConcernTextInput
              title="Provide Incident Detail *"
              // iconName="document-text-outline"
              placeholder="Enter incident detail"
              value={claimIncidentDetails}
              onChangeText={setClaimIncidentDetails}
              useClaimProcessStyle={true}
            />
            <YesNoQuestion
              label="Is there anyone went to Hospital*"
              value={didAnyoneGoToHospital}
              onChange={(value) => setDidAnyoneGoToHospital(value)}
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
      </KeyboardAwareScrollView>
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
    gap: 24,
  },
  componentSpacing: {
    marginBottom: 24,
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
    marginTop: 24,
    // marginBottom: 20,
    width: "100%",
  },
  infoBanner: {
    marginBottom: 16,
  },
  sectionCard: {
    marginBottom: 16,
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
  buttonWrapper: {
    flex: 1,
  },
  buttonSpacer: {
    width: 12,
  },
  spacer: {
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
