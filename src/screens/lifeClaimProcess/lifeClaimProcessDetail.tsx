import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DetailHeader from "../../components/Common/DetailHeader";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import Button from "@/src/components/Common/Button";

interface RequirementItem {
  id: string;
  description: string;
  number: string;
}

const REQUIREMENTS: RequirementItem[] = [
  {
    id: "1",
    description: "Death certificate (official from Ministry of Interior)",
    number: "01",
  },
  {
    id: "2",
    description: "Copy of insured's ID",
    number: "02",
  },
  {
    id: "3",
    description: "Copy of the beneficiary's ID card",
    number: "03",
  },
  {
    id: "4",
    description: "Policy number or certificate of insurance",
    number: "04",
  },
  {
    id: "5",
    description:
      "Bank confirmation (cheque or bank letter with account number)",
    number: "05",
  },
  {
    id: "6",
    description: "Completed & signed claim form",
    number: "06",
  },
  {
    id: "7",
    description: "Medical documents (if death was due to illness)",
    number: "07",
  },
  {
    id: "8",
    description: "Police report (if death occurred as a result of an accident)",
    number: "08",
  },
];

export default function LifeClaimProcess() {
  const { navigateToHealthClaimProcess, goBack, navigateToSupport } =
    useAppNavigation();
  const { width } = useWindowDimensions();
  const horizontalPadding = 20;
  const containerWidth = width - horizontalPadding * 2;

  const handleNext = () => {
    navigateToHealthClaimProcess();
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.maincontainer}>
      <DetailHeader
        title="Life Claim Process"
        subtitle="A12735484937"
        onBackPress={goBack}
        rightIcon="headset-outline"
        onRightPress={navigateToSupport}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Container */}
        <View style={[styles.mainContainer, { width: containerWidth }]}>
          {/* Title Section with Icon */}
          <View style={[styles.titleSection, { width: containerWidth - 32 }]}>
            <Text style={styles.titleText}>Claim Requirement Check list</Text>
            <View style={styles.checkIconContainer}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.orange}
              />
            </View>
          </View>

          {/* Requirements List */}
          <View style={styles.requirementsList}>
            {REQUIREMENTS.map((requirement) => (
              <View
                key={requirement.id}
                style={[styles.requirementItem, { width: containerWidth - 32 }]}
              >
                <Text style={styles.requirementText}>
                  {requirement.description}
                </Text>
                <View style={styles.numberContainer}>
                  <Text style={styles.numberText}>{requirement.number}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <Button
            text="Next"
            onPress={handleNext}
            variant="filled"
            backgroundColor={colors.button}
            textColor={colors.white}
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
    paddingBottom: 40,
  },
  mainContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#99999914",
    paddingTop: 20,
    paddingRight: 16,
    paddingBottom: 20,
    paddingLeft: 16,
    gap: 32,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 24,
    gap: 12,
  },
  titleText: {
    fontFamily: fonts.family.semiBold,
    fontWeight: fonts.weight.semiBold,
    fontSize: typography.cardHeadText2,
    color: colors.darkBlack,
    flex: 1,
    textAlign: "right",
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 72,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.blackOpacityeight,
    padding: 16,
    gap: 12,
    backgroundColor: colors.white,
  },
  requirementText: {
    flex: 1,
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: typography.headingText1,
    color: colors.darkBlack,
    lineHeight: Math.round(typography.headingText1 * 1.4),
    textAlign: "right",
  },
  numberContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: typography.cardHeadText2,
    color: colors.primaryColor,
  },
  buttonContainer: {
    marginTop: 24,
    width: "100%",
  },
});
