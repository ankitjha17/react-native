import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DetailHeader from "../components/Common/DetailHeader";
import EnhancedPolicyCard from "../components/EnhancedPolicyCard";
import UploadDocument from "../components/UploadDocument";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import typography from "../constants/typography";
import { useAppNavigation } from "../hooks/useAppNavigation";
import Button from "../components/Common/Button";

export default function FiledClaimDetail() {
  const { goBack, navigateToTabs } = useAppNavigation();
  const { width } = useWindowDimensions();
  const horizontalPadding = 20;
  const cardWidth = width - horizontalPadding * 2;

  const claimToken = "#P1278292728";

  return (
    <SafeAreaView edges={["bottom"]} style={styles.maincontainer}>
      <DetailHeader onBackPress={goBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: horizontalPadding },
        ]}
      >
        <View style={styles.content}>
          <Image
            source={require("../assets/images/success.png")}
            style={styles.successImage}
            resizeMode="contain"
            accessibilityLabel="Success"
          />
        </View>

        <View style={styles.topStatus}>
          <Text
            style={styles.statusText}
            allowFontScaling
            maxFontSizeMultiplier={1.3}
          >
            Your Claim has been registered.
          </Text>
          <Text
            style={styles.claimTokenText}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            {claimToken}
          </Text>
        </View>

        <View style={styles.titleRow}>
          <Text
            style={styles.sectionTitle}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            Policy Details
          </Text>
          <Feather
            name="alert-triangle"
            size={20}
            color={colors.primaryColor}
          />
        </View>

        <EnhancedPolicyCard
          width={cardWidth}
          title="Travel Insurance"
          badgeText="Open"
          badgeColor={colors.openColor}
          badgeTextColor={colors.openTextColor}
          showBackButton={false}
          showClaimNumber
          claimNumber={claimToken}
          showPolicyNumber
          policyNumber="A12735484937"
          startDate="15 Aug ’25"
          validTill="15 Aug ’26"
          premiumPerMonth="₪ 2,40,000"
          backgroundColor={colors.cardOverViewBackground}
        />

        <View style={styles.titleRow}>
          <Text
            style={styles.sectionTitle}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            Incident Description
          </Text>
          <Feather
            name="alert-triangle"
            size={20}
            color={colors.primaryColor}
          />
        </View>

        <View style={styles.descriptionContainer}>
          <Text
            style={styles.descriptionText}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            On [date], while driving my car (registration no. XXXX) on
            [road/location] at around [time], an unfortunate incident occurred.
            The weather and road conditions were [clear/rainy/heavy traffic,
            etc.], and a [vehicle/ object/animal] suddenly [describe action,
            e.g., braked abruptly, swerved, collided].
          </Text>
        </View>

        <View style={styles.titleRow}>
          <Text
            style={styles.sectionTitle}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            Attachments
          </Text>
          <Feather name="folder" size={20} color={colors.primaryColor} />
        </View>
        <UploadDocument
          title="View documents"
          subtitle="Supported Format: PDF"
          iconName="chevron-back"
          iconPosition="left"
          containerStyle={styles.attachmentItem}
          wrapperStyle={{ marginBottom: 12 }}
          onCameraPress={() => {
            console.log("Camera selected for documents");
            // TODO: Implement camera functionality
          }}
          onGalleryPress={() => {
            console.log("Gallery selected for documents");
            // TODO: Implement gallery functionality
          }}
          onFilesPress={() => {
            console.log("Files selected for documents");
            // TODO: Implement files functionality
          }}
        />
        <UploadDocument
          title="View Images"
          subtitle="Supported Format: JPEG, PNG"
          iconName="chevron-back"
          iconPosition="left"
          containerStyle={styles.attachmentItem}
          wrapperStyle={{ marginBottom: 12 }}
          onCameraPress={() => {
            console.log("Camera selected for images");
            // TODO: Implement camera functionality
          }}
          onGalleryPress={() => {
            console.log("Gallery selected for images");
            // TODO: Implement gallery functionality
          }}
          onFilesPress={() => {
            console.log("Files selected for images");
            // TODO: Implement files functionality
          }}
        />

        <View style={styles.buttonContainer}>
          <Button
            text="Home"
            onPress={navigateToTabs}
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 24,
  },
  successImage: {
    width: 90,
    height: 90,
    minHeight: 90,
    aspectRatio: 1, // Maintains square proportions
  },
  claimTokenText: {
    fontFamily: fonts.family.semiBold,
    fontWeight: fonts.weight.semiBold,
    fontSize: typography.tabText,
    color: colors.primaryColor,
    textAlign: "center",
    marginBottom: 24,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  topStatus: {
    alignItems: "center",
  },
  statusText: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: typography.tabText,
    color: colors.primaryColor,
    textAlign: "center",
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 24,
    minHeight: 24,
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: typography.cardHeadText2,
    color: colors.darkBlack,
    flex: 1,
    textAlign: "right",
  },
  descriptionContainer: {
    borderWidth: 1,
    borderColor: colors.blackOpacityeight,
    borderRadius: 8,
    backgroundColor: colors.cardOverViewBackground,
    padding: 12,
  },
  descriptionText: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: typography.serviceText,
    color: colors.black,
    lineHeight: Math.round(typography.serviceText * 1.6),
    textAlign: "right",
  },
  attachmentItem: {
    borderStyle: "solid",
  },
  buttonContainer: {
    marginTop: 12,
    width: "100%",
  },
});
