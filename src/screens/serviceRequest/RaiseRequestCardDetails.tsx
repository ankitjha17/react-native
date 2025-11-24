import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryDropdown, {
  CategoryOption,
} from "../../components/Common/CategoryDropdown";
import DetailHeader from "../../components/Common/DetailHeader";
import RequestCard from "../../components/RequestCard";
import UploadDocument from "../../components/UploadDocument";
import colors from "../../constants/colors";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { AppStackParamList } from "../../navigation/AppStack";
import ConcernTextInput from "@/src/components/Common/ConcernTextInput";
import Button from "@/src/components/Common/Button";

type RaiseRequestCardDetailsRouteProp = RouteProp<
  AppStackParamList,
  "RaiseRequestCardDetails"
>;

export default function RaiseRequestCardDetails() {
  const { goBack, navigateToSupport } = useAppNavigation();
  const route = useRoute<RaiseRequestCardDetailsRouteProp>();
  const { width } = useWindowDimensions();
  const horizontalPadding = 20;
  const cardWidth = width - horizontalPadding * 2;

  const { request } = route.params;

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined);
  const [concernText, setConcernText] = useState<string>("");

  const categoryOptions: CategoryOption[] = [
    { id: "1", label: "Rejected/Delayed" },
    { id: "2", label: "Uploading Documents" },
    { id: "3", label: "Payment Issue" },
    { id: "4", label: "Cashless Problem" },
  ];

  return (
    <SafeAreaView edges={["bottom"]} style={styles.maincontainer}>
      <DetailHeader
        title="Raise a Request"
        onBackPress={goBack}
        rightIcon="headset-outline"
        onRightPress={navigateToSupport}
      />

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={150}
        extraHeight={150}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Selected Card */}
        <View style={styles.cardContainer}>
          <RequestCard
            width={cardWidth}
            status={request.status}
            requestId={request.requestId}
            requestType={request.requestType}
            startDate={request.startDate}
            validTill={request.validTill}
            premiumPerMonth={request.premiumPerMonth}
            companyName={request.companyName}
            selected={true}
          />
        </View>

        {/* Category Dropdown */}
        <View style={styles.formContainer}>
          <CategoryDropdown
            options={categoryOptions}
            value={selectedCategoryId}
            placeholder="Select a Category"
            onSelect={(option) => setSelectedCategoryId(option.id)}
          />
        </View>

        {/* Concern Text Input */}
        <View style={styles.formContainer}>
          <ConcernTextInput
            title="Write Your Concern"
            iconName="document-text-outline"
            placeholder="Enter your concern here"
            value={concernText}
            onChangeText={setConcernText}
          />
        </View>

        {/* Upload Document */}
        <View style={styles.formContainer}>
          <UploadDocument
            title="Upload Document"
            subtitle="You can add additional files (<6MB)."
            iconName="add-circle-outline"
            onCameraPress={() => {
              console.log("Camera selected");
              // TODO: Implement camera functionality
            }}
            onGalleryPress={() => {
              console.log("Gallery selected");
              // TODO: Implement gallery functionality
            }}
            onFilesPress={() => {
              console.log("Files selected");
              // TODO: Implement files functionality
            }}
          />
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            text="Submit Request"
            onPress={() => console.log("Submit Request")}
            variant="filled"
            backgroundColor={colors.button}
            textColor={colors.white}
          />
          <View style={styles.buttonSpacing} />
          <Button
            text="Schedule a Callback"
            onPress={() => console.log("Schedule a Callback")}
            variant="outlined"
            backgroundColor={colors.button}
            textColor={colors.deeptealColor}
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
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  cardContainer: {
    width: "100%",
    marginTop: 24,
  },
  formContainer: {
    width: "100%",
    marginTop: 20,
  },
  buttonsContainer: {
    width: "100%",
    paddingTop: 16,
    paddingBottom: 24,
  },
  buttonSpacing: {
    height: 12,
  },
});
