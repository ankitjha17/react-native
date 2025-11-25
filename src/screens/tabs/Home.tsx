import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PolicyCard from "../../components/Common/PolicyCard";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import { useAppNavigation } from "../../hooks/useAppNavigation";

type Policy = {
  id: string;
  status: "Active" | "Expired";
  name: string;
  policyNumber: string;
  startDate: string;
  validTill: string;
  premiumPerMonth: string;
};

const MOCK_POLICIES: Policy[] = [
  {
    id: "1",
    status: "Active",
    name: "Health Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
  {
    id: "2",
    status: "Active",
    name: "Travel Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
  {
    id: "3",
    status: "Expired",
    name: "Business Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
  {
    id: "4",
    status: "Expired",
    name: "Vehicle Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
  {
    id: "5",
    status: "Active",
    name: "Health Insurance",
    policyNumber: "A12735484937",
    startDate: "15 Aug '25",
    validTill: "15 Aug '26",
    premiumPerMonth: "₪ 2,40,000",
  },
];

export default function Home() {
  const { width } = useWindowDimensions();
  const horizontalPadding = 20;
  const cardWidth = width - horizontalPadding * 2;
  const { navigateToPolicyDetails, navigateToSupport } = useAppNavigation();

  const renderItem = useCallback(
    ({ item }: { item: Policy }) => (
      <PolicyCard
        width={cardWidth}
        status={item.status}
        name={item.name}
        policyNumber={item.policyNumber}
        startDate={item.startDate}
        validTill={item.validTill}
        premiumPerMonth={item.premiumPerMonth}
        onPress={() => {
          navigateToPolicyDetails({
            policyId: item.id,
            name: item.name,
            policyNumber: item.policyNumber,
            status: item.status,
            startDate: item.startDate,
            validTill: item.validTill,
            premiumPerMonth: item.premiumPerMonth,
            claimNumber: undefined, // Can be added to Policy type later
          });
        }}
      />
    ),
    [cardWidth, navigateToPolicyDetails]
  );

  const keyExtractor = useCallback((item: Policy) => item.id, []);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.maincontainer}>
      <SafeAreaView edges={["top"]}>
        <ImageBackground
          source={require("../../assets/images/background.png")}
          style={[styles.headerContainer, { width }]}
          imageStyle={[styles.headerImage, { width }]}
        >
          {/* --- Top Row (Icons + User Info) --- */}
          <View style={styles.topRow}>
            {/* Left - Icons */}
            <View style={styles.iconRow}>
              <TouchableOpacity
                onPress={navigateToSupport}
                accessibilityRole="button"
                accessibilityLabel="Contact Support"
                style={{ marginRight: 12 }}
              >
                <Ionicons
                  name="headset-outline"
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.white}
                accessibilityRole="button"
                accessibilityLabel="Notifications"
              />
            </View>

            {/* Right - Greeting + Profile */}
            <View style={styles.userRow}>
              <View style={styles.textCol}>
                <Text
                  style={styles.greeting}
                  allowFontScaling
                  maxFontSizeMultiplier={1.3}
                  accessibilityRole="text"
                >
                  Hi, Amir
                </Text>
                <Text
                  style={styles.subtitle}
                  allowFontScaling
                  maxFontSizeMultiplier={1.2}
                  accessibilityRole="text"
                >
                  amirbreda07@gmail.com
                </Text>
              </View>
              <View style={{ marginLeft: 12 }}>
                <Image
                  source={require("../../assets/images/profileImage.jpg")}
                  style={styles.avatar}
                  resizeMode="cover"
                  accessibilityRole="image"
                  accessibilityLabel="User profile picture"
                />
              </View>
            </View>
          </View>

          {/* --- Search Bar --- */}
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search for policies, claims..."
              placeholderTextColor={colors.gray500}
              style={styles.searchInput}
              allowFontScaling
              maxFontSizeMultiplier={1.2}
              accessibilityLabel="Search for policies and claims"
              accessibilityRole="search"
            />
            <View style={{ marginLeft: 10 }}>
              <Ionicons
                name="search-outline"
                size={20}
                color={colors.gray500}
                accessibilityRole="image"
                accessibilityLabel="Search icon"
              />
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
      <LinearGradient
        colors={[
          colors.white,
          colors.gradientLightGray2,
          colors.gradientLightGray,
        ]}
        locations={[0, 0.7024, 1]}
        style={[styles.policiesContainer, { width }]}
      >
        <Text
          style={styles.sectionTitle}
          allowFontScaling
          maxFontSizeMultiplier={1.2}
        >
          My Policies
        </Text>
        <FlatList
          data={MOCK_POLICIES}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
  headerContainer: {
    height: 240,
    minHeight: 240,
    padding: 20,
    justifyContent: "flex-start",
  },
  headerImage: {
    height: "100%",
    resizeMode: "cover",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  iconRow: {
    flexDirection: "row",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  textCol: {
    alignItems: "flex-end",
  },
  greeting: {
    color: colors.white,
    fontSize: typography.greetingText,
    fontFamily: fonts.family.semiBold,
    fontWeight: fonts.weight.semiBold,
    textAlign: "right",
    letterSpacing: 0,
    lineHeight: Math.round(typography.greetingText * 1.2),
  },
  subtitle: {
    color: colors.white,
    fontSize: typography.serviceText,
    fontFamily: fonts.family.light,
    fontWeight: fonts.weight.light,
    textAlign: "right",
    marginTop: 2,
    letterSpacing: 0,
    lineHeight: Math.round(typography.serviceText * 1.2),
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightwhilte,
  },
  searchContainer: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.buttonText,
    textAlign: "right",
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    color: colors.gray500,
  },
  sectionTitle: {
    fontSize: typography.cardHeadText2,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    color: colors.darkBlack,
    textAlign: "right",
    marginBottom: 20,
    paddingRight: 8,
    lineHeight: Math.round(typography.cardHeadText2 * 1.2),
    letterSpacing: 0,
  },
  policiesContainer: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: -64,
    overflow: "hidden",
  },
  listContent: {
    paddingBottom: 100,
  },
});
