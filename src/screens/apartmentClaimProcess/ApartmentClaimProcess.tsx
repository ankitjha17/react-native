import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryOption } from "../../components/Common/CategoryDropdown";
import ClaimProcessInput from "../../components/Common/ClaimProcessInput";
import DetailHeader from "../../components/Common/DetailHeader";
import DropdownField from "../../components/Common/DropdownField";

import InfoBanner from "../../components/InfoBanner";
import UploadDocument from "../../components/UploadDocument";
import YesNoQuestion from "../../components/YesNoQuestion";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import ConcernTextInput from "@/src/components/Common/ConcernTextInput";
import Button from "@/src/components/Common/Button";

export default function ApartmentClaimProcess() {
  const { goBack, navigateToSupport, navigateToClaimSuccess } =
    useAppNavigation();
  const claimTypeOptions: CategoryOption[] = [
    { id: "1", label: "Personal Property" },
    { id: "2", label: "Natural Disaster" },
    { id: "3", label: "Burglary" },
    { id: "4", label: "Property Damage" },
  ];
  // Damage type selection
  const [damageTypeId, setDamageTypeId] = React.useState<string | undefined>(
    undefined
  );

  // Incident details
  const [incidentDetails, setIncidentDetails] = useState<string>("");
  const [wasReportedToPolice, setWasReportedToPolice] = useState<
    "yes" | "no" | null
  >(null);
  return (
    <SafeAreaView edges={["bottom"]} style={styles.maincontainer}>
      <DetailHeader
        title="Apartment Claim Process"
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

          <ClaimProcessInput title="Damage Information Details">
            <DropdownField
              label="Select Claim Type*"
              options={claimTypeOptions}
              value={damageTypeId}
              placeholder="Select Claim Type"
              onSelect={(opt) => setDamageTypeId(opt.id)}
            />
            <UploadDocument
              label="Upload the Photo of Damage Caused*"
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
          </ClaimProcessInput>

          <ClaimProcessInput title="Incident Details">
            <YesNoQuestion
              label="Was the incident reported to the police? *"
              value={wasReportedToPolice}
              onChange={(value) => setWasReportedToPolice(value)}
            />
            <UploadDocument
              label="Upload the Police Report*"
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
              value={incidentDetails}
              onChangeText={setIncidentDetails}
              useClaimProcessStyle={true}
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
