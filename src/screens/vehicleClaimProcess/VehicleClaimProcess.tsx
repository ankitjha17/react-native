import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryOption } from "../../components/Common/CategoryDropdown";
import ClaimProcessInput from "../../components/Common/ClaimProcessInput";
import DateField from "../../components/Common/DateField";
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

export default function VehicleClaimProcess() {
  const { goBack, navigateToSupport, navigateToClaimSuccess } =
    useAppNavigation();
  const claimTypeOptions: CategoryOption[] = [
    { id: "1", label: "Accident" },
    { id: "2", label: "Car theft" },
    { id: "3", label: "Fire Damage" },
    { id: "4", label: "Radio Tape" },
    { id: "5", label: "Third Party" },
    { id: "6", label: "Company Claim" },
    { id: "7", label: "Global Report" },
    { id: "8", label: "Natural Damage" },
    { id: "9", label: "Personal Injury" },
  ];
  const [selectedClaimTypeId, setSelectedClaimTypeId] = useState<
    string | undefined
  >(undefined);
  const [otherPartyPhone, setOtherPartyPhone] = useState("");
  const countryCode = "+972";
  const [incidentDetails, setIncidentDetails] = useState<string>("");
  const [insuredVehicleDamageDescription, setInsuredVehicleDamageDescription] =
    useState<string>("");
  const [
    thirdPartyVehicleDamageDescription,
    setThirdPartyVehicleDamageDescription,
  ] = useState<string>("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [insuredVehicleLicensePlate, setInsuredVehicleLicensePlate] =
    useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverLicenseNumber, setDriverLicenseNumber] = useState("");
  const [thirdPartyVehicleLicensePlate, setThirdPartyVehicleLicensePlate] =
    useState("");
  const [insuranceCompanyName, setInsuranceCompanyName] = useState("");
  const [incidentDateTime, setIncidentDateTime] = React.useState<string>("");
  const [didAnyoneGoToHospital, setDidAnyoneGoToHospital] = useState<
    "yes" | "no" | null
  >(null);
  const [isInjured, setIsInjured] = useState<boolean>(false);
  const [victimName, setVictimName] = useState("");
  const [victimId, setVictimId] = useState("");
  const [victimPhone, setVictimPhone] = useState("");

  return (
    <SafeAreaView edges={["bottom"]} style={styles.maincontainer}>
      <DetailHeader
        title="Car/Truck Claim"
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

          <ClaimProcessInput title="Claim Information Details">
            <DropdownField
              label="Select Claim Type*"
              options={claimTypeOptions}
              value={selectedClaimTypeId}
              placeholder="Select Claim Type"
              onSelect={(opt) => setSelectedClaimTypeId(opt.id)}
            />
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
          </ClaimProcessInput>

          <ClaimProcessInput title="Incident Details">
            <DateField
              label="Date and Time of incident *"
              value={incidentDateTime}
              placeholder="Select / enter date"
              onPress={() => {
                // TODO: Implement date picker functionality
                // For now, this is a placeholder
              }}
              isLast={true}
            />
            <TextField
              label="Location of the Incident *"
              value={incidentLocation}
              placeholder="Enter location detail"
              onChangeText={setIncidentLocation}
            />
            <UploadDocument
              label="Upload the Photos of Incident Location*"
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
              title="Provide Incident Details*"
              placeholder="Enter incident detail"
              value={incidentDetails}
              onChangeText={setIncidentDetails}
              useClaimProcessStyle={true}
            />
          </ClaimProcessInput>
          <ClaimProcessInput title="Insured Vehicle Details">
            <TextField
              label="License Plate Number*"
              value={insuredVehicleLicensePlate}
              placeholder="Enter lience plate number"
              onChangeText={setInsuredVehicleLicensePlate}
            />
            <TextField
              label="Vehcle Model Name*"
              value={vehicleModel}
              placeholder="Enter Modal name*"
              onChangeText={setVehicleModel}
            />
            <UploadDocument
              label="Upload Photos of Damage in the Vehicle*"
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
              title="Description of Damage to Insured Vehicle*"
              placeholder="Enter incident detail"
              value={insuredVehicleDamageDescription}
              onChangeText={setInsuredVehicleDamageDescription}
              useClaimProcessStyle={true}
            />
          </ClaimProcessInput>
          <ClaimProcessInput title="Driver Details">
            <TextField
              label="Name*"
              value={driverName}
              placeholder="Enter driver's full name"
              onChangeText={setDriverName}
            />
            <TextField
              label="Driver's License Number*"
              value={driverLicenseNumber}
              placeholder="Enter license number"
              onChangeText={setDriverLicenseNumber}
            />
            <UploadDocument
              label="Upload Driver's ID*"
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
              title="Description of Damage to Insured Vehicle*"
              placeholder="Enter incident detail"
              value={insuredVehicleDamageDescription}
              onChangeText={setInsuredVehicleDamageDescription}
              useClaimProcessStyle={true}
            />
          </ClaimProcessInput>
          <ClaimProcessInput title="Third Party Vehicle Details">
            <DropdownField
              label="Select Vehicle Type*"
              options={claimTypeOptions}
              value={selectedClaimTypeId}
              placeholder="Select Vehicle Type"
              onSelect={(opt) => setSelectedClaimTypeId(opt.id)}
            />
            <TextField
              label="Vehicle License Plate Number*"
              value={thirdPartyVehicleLicensePlate}
              placeholder="Enter license plate number"
              onChangeText={setThirdPartyVehicleLicensePlate}
            />
            <TextField
              label="Insurnace Company Name*"
              value={insuranceCompanyName}
              placeholder="Enter full name"
              onChangeText={setInsuranceCompanyName}
            />
            <UploadDocument
              label="Upload Photos of Damages to Third Party Vehicle*"
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
              title="Description of Damage*"
              placeholder="Enter incident detail"
              value={thirdPartyVehicleDamageDescription}
              onChangeText={setThirdPartyVehicleDamageDescription}
              useClaimProcessStyle={true}
            />
          </ClaimProcessInput>
          <ClaimProcessInput
            title="Any Injury"
            toggleValue={isInjured}
            onToggleChange={setIsInjured}
            toggleLabel="Is anyone injured?"
          >
            <TextField
              label="Name of the Victim*"
              value={victimName}
              placeholder="Enter victim name"
              onChangeText={setVictimName}
            />
            <TextField
              label="Victim's ID*"
              value={victimId}
              placeholder="Enter victim's ID number"
              onChangeText={setVictimId}
            />
            <TextField
              label="Victim's phone/Mobile Number*"
              value={victimPhone}
              placeholder="1800-123-456"
              onChangeText={setVictimPhone}
              rightIcon={
                <View style={styles.phoneRightAddon}>
                  <View style={styles.phoneDivider} />
                  <Text style={styles.phoneCode}>{countryCode}</Text>
                </View>
              }
            />
            <View style={styles.yesNoQuestionContainer}>
              <YesNoQuestion
                label="Did anyone go to the hospital? *"
                value={didAnyoneGoToHospital}
                onChange={(value) => setDidAnyoneGoToHospital(value)}
              />
            </View>
          </ClaimProcessInput>
          <ClaimProcessInput title="Other Information">
            <TextField
              label="if you are not in the incident area, provide the other party's phone number*"
              value={otherPartyPhone}
              placeholder="1800-123-456"
              onChangeText={setOtherPartyPhone}
              rightIcon={
                <View style={styles.phoneRightAddon}>
                  <View style={styles.phoneDivider} />
                  <Text style={styles.phoneCode}>{countryCode}</Text>
                </View>
              }
            />
            <UploadDocument
              label="Upload  Driver's ID*"
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
  injuryToggleContainer: {
    marginBottom: 24,
  },
  injuryFieldsContainer: {
    marginTop: 24,
  },
  yesNoQuestionContainer: {
    marginBottom: 24, // Additional space at the bottom
  },
});
