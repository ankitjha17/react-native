import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../auth/AuthContext";
import ActionButtonGroup from "../../../components/Common/ActionButtonGroup";
import ProfileListItem from "../../../components/ProfileListItem";
import colors from "../../../constants/colors";
import fonts from "../../../constants/fonts";
import typography from "../../../constants/typography";
import { useAppNavigation } from "../../../hooks/useAppNavigation";

const profileItems: {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    id: "1",
    title: "Edit Profile",
    subtitle: "Name, email, phone, address",
    icon: "person-outline",
  },
  // { id: '6', title: 'Change Password', subtitle: 'Update your password', icon: 'lock-closed-outline' },
  {
    id: "2",
    title: "Service Request",
    subtitle: "Raise a service request",
    icon: "checkbox-outline",
  },
  {
    id: "3",
    title: "Terms and Conditions",
    subtitle: "Legal Terms",
    icon: "lock-closed-outline",
  },
  {
    id: "4",
    title: "Privacy Policy",
    subtitle: "Terms, privacy",
    icon: "information-circle-outline",
  },
  {
    id: "5",
    title: "Logout",
    subtitle: "Sign out from your account",
    icon: "log-out-outline",
  },
];

const ProfileScreen = () => {
  const { width } = useWindowDimensions();
  const { logout } = useAuth();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const { navigateToProfile, navigateToRaiseRequest } = useAppNavigation();

  const handleConfirmLogout = async () => {
    try {
      await logout();
    } finally {
      setLogoutVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Profile Name and Email */}
        <View style={styles.headerTextContainer}>
          <Text
            style={styles.headerTitle}
            allowFontScaling
            maxFontSizeMultiplier={1.3}
          >
            Sebastian
          </Text>
          <Text
            style={styles.headerSubtitle}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            sebastian007@gmail.com
          </Text>
        </View>

        {/* Profile Image */}
        <Image
          source={require("../../../assets/images/profileImage.jpg")}
          style={styles.avatar}
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel="Profile picture"
        />
      </View>

      {/* Cards */}
      <View style={styles.listContainer}>
        <FlatList
          data={profileItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProfileListItem
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              showLeftChevron={item.id !== "5"}
              onPress={() => {
                if (item.id === "5") {
                  setLogoutVisible(true);
                }
                if (item.id === "1") {
                  navigateToProfile();
                }
                if (item.id === "2") {
                  navigateToRaiseRequest();
                }
              }}
            />
          )}
          ListFooterComponent={
            <View style={styles.footerInfo}>
              <Text
                style={styles.footerText}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              >
                Environment:{" "}
                {Constants.expoConfig?.extra?.APP_ENV ?? "development"}
              </Text>
              <Text
                style={styles.footerText}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              >
                Version: {Constants.expoConfig?.version ?? "0.0.1"}
              </Text>
            </View>
          }
        />
      </View>
      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLogoutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.backdropPressable}
            onPress={() => setLogoutVisible(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderRow}>
              <Text
                style={styles.modalTitle}
                allowFontScaling
                maxFontSizeMultiplier={1.3}
              >
                Are you logging out?
              </Text>
              <TouchableOpacity
                onPress={() => setLogoutVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close logout dialog"
              >
                <Ionicons name="close" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>
            <Text
              style={styles.modalSubtitle}
              allowFontScaling
              maxFontSizeMultiplier={1.2}
            >
              You can always login back at anytime.
            </Text>

            <ActionButtonGroup
              leftButton={{
                text: "Cancel",
                onPress: () => setLogoutVisible(false),
                variant: "outlined",
                backgroundColor: colors.button,
              }}
              rightButton={{
                text: "Logout",
                onPress: handleConfirmLogout,
                variant: "filled",
                backgroundColor: colors.button,
              }}
              gap={12}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradientLightGray2,
  },
  header: {
    width: "100%",
    minHeight: 154,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    backgroundColor: colors.primaryColor,
    overflow: "hidden",
  },
  headerTextContainer: {
    gap: 0,
    alignItems: "flex-end",
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.headingText,
    fontFamily: fonts.family.semiBold,
    color: colors.white,
    textAlign: "right",
    // fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: typography.cardHeadText2,
    fontFamily: fonts.family.regular,
    color: colors.white,
    textAlign: "right",
  },
  avatar: {
    width: 60,
    minHeight: 65,
    borderRadius: 30,
    aspectRatio: 0.92, // Maintains avatar proportions
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -16,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  backdropPressable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.select({ ios: 28, android: 48, default: 36 }),
    gap: 12,
    // marginBottom: Platform.select({
    // ios:10,
    // android:0,
    // default:0
    // }),
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: typography.headingText,
    fontFamily: fonts.family.medium,
    color: colors.black,
  },
  modalSubtitle: {
    fontSize: typography.buttonText,
    fontFamily: fonts.family.regular,
    color: colors.gray600,
  },
  footerInfo: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontFamily: fonts.family.regular,
    color: colors.gray600,
    textAlign: "center",
  },
});

export default ProfileScreen;
