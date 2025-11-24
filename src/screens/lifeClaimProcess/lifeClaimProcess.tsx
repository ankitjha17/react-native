import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ClaimProcessInput from "../../components/Common/ClaimProcessInput";
import DetailHeader from "../../components/Common/DetailHeader";
import InfoBanner from "../../components/InfoBanner";
import TextField from "../../components/TextField";
import UploadDocument from "../../components/UploadDocument";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import ConcernTextInput from "@/src/components/Common/ConcernTextInput";
import Button from "@/src/components/Common/Button";

export default function HealthClaimProcess() {
  const { goBack, navigateToSupport, navigateToClaimSuccess } =
    useAppNavigation();

  const [concernText, setConcernText] = useState<string>("");
  const [expenses, setExpenses] = useState<string>("");
  return (
    <SafeAreaView edges={["bottom"]} style={styles.maincontainer}>
      <DetailHeader
        title="Health Claim Process"
        subtitle="A12735484937"
        onBackPress={goBack}
        rightIcon="headset-outline"
        onRightPress={navigateToSupport}
      />

      <ScrollView
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

          <ClaimProcessInput title="Required Documents">
            <UploadDocument
              label="Upload the Policy Document *"
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
            <UploadDocument
              label="Upload death certificate (Official from the Ministry of Interior) *"
              subtitle="Supported Format: PDF/JPEG/PNG"
              iconName="add-circle-outline"
              onCameraPress={() => {
                console.log("Camera selected - Death certificate");
                // TODO: Implement camera functionality
              }}
              onGalleryPress={() => {
                console.log("Gallery selected - Death certificate");
                // TODO: Implement gallery functionality
              }}
              onFilesPress={() => {
                console.log("Files selected - Death certificate");
                // TODO: Implement files functionality
              }}
            />
          </ClaimProcessInput>
          <ClaimProcessInput title="Identify Verification">
            <UploadDocument
              label="Upload copy of Insured's ID *"
              subtitle="Supported Format: PDF/JPEG/PNG"
              iconName="add-circle-outline"
              onCameraPress={() => {
                console.log("Camera selected - Insured ID");
                // TODO: Implement camera functionality
              }}
              onGalleryPress={() => {
                console.log("Gallery selected - Insured ID");
                // TODO: Implement gallery functionality
              }}
              onFilesPress={() => {
                console.log("Files selected - Insured ID");
                // TODO: Implement files functionality
              }}
            />
            <UploadDocument
              label="Upload copy of the beneficiary's ID card *"
              subtitle="Supported Format: PDF/JPEG/PNG"
              iconName="add-circle-outline"
              onCameraPress={() => {
                console.log("Camera selected - Beneficiary ID");
                // TODO: Implement camera functionality
              }}
              onGalleryPress={() => {
                console.log("Gallery selected - Beneficiary ID");
                // TODO: Implement gallery functionality
              }}
              onFilesPress={() => {
                console.log("Files selected - Beneficiary ID");
                // TODO: Implement files functionality
              }}
            />
          </ClaimProcessInput>
          <ClaimProcessInput title="Financial Details">
            <UploadDocument
              label="Upload Bank confirmation (cheque or bank letter with account number) *"
              subtitle="Supported Format: PDF/JPEG/PNG"
              iconName="add-circle-outline"
              onCameraPress={() => {
                console.log("Camera selected - Bank confirmation");
                // TODO: Implement camera functionality
              }}
              onGalleryPress={() => {
                console.log("Gallery selected - Bank confirmation");
                // TODO: Implement gallery functionality
              }}
              onFilesPress={() => {
                console.log("Files selected - Bank confirmation");
                // TODO: Implement files functionality
              }}
            />
          </ClaimProcessInput>
          <ClaimProcessInput title="Claim Documents">
            <UploadDocument
              label="Upload Completed & signed claim form *"
              subtitle="Supported Format: PDF/JPEG/PNG"
              iconName="add-circle-outline"
              onCameraPress={() => {
                console.log("Camera selected - Claim form");
                // TODO: Implement camera functionality
              }}
              onGalleryPress={() => {
                console.log("Gallery selected - Claim form");
                // TODO: Implement gallery functionality
              }}
              onFilesPress={() => {
                console.log("Files selected - Claim form");
                // TODO: Implement files functionality
              }}
            />
            <UploadDocument
              label="Upload medical documents (if death was due to illness) *"
              subtitle="Supported Format: PDF/JPEG/PNG"
              iconName="add-circle-outline"
              onCameraPress={() => {
                console.log("Camera selected - Medical documents");
                // TODO: Implement camera functionality
              }}
              onGalleryPress={() => {
                console.log("Gallery selected - Medical documents");
                // TODO: Implement gallery functionality
              }}
              onFilesPress={() => {
                console.log("Files selected - Medical documents");
                // TODO: Implement files functionality
              }}
            />
            <UploadDocument
              label="Upload police report (if death occurred as a result of an accident) *"
              subtitle="Supported Format: PDF/JPEG/PNG"
              iconName="add-circle-outline"
              onCameraPress={() => {
                console.log("Camera selected - Police report");
                // TODO: Implement camera functionality
              }}
              onGalleryPress={() => {
                console.log("Gallery selected - Police report");
                // TODO: Implement gallery functionality
              }}
              onFilesPress={() => {
                console.log("Files selected - Police report");
                // TODO: Implement files functionality
              }}
            />
            <ConcernTextInput
              title="Provide Incident Detail *"
              // iconName="document-text-outline"
              placeholder="Enter incident detail"
              value={concernText}
              onChangeText={setConcernText}
              useClaimProcessStyle={true}
            />
          </ClaimProcessInput>
          <ClaimProcessInput title="Expenses">
            <TextField
              label="Enter Medical Expenses *"
              value={expenses}
              placeholder="Enter Total amount claimed"
              onChangeText={setExpenses}
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
    // marginTop: 24,
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
