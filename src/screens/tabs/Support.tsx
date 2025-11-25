import React from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButtonGroup from "../../components/Common/ActionButtonGroup";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";
import Button from "@/src/components/Common/Button";

export default function Support() {
  const { width } = useWindowDimensions();
  const handleCall = () => Linking.openURL("tel:02188888888");
  const handleMail = () =>
    Linking.openURL("mailto:applications.support@gmail.com");
  const handleChat = () => console.log("Chat now pressed");

  const horizontalPadding = 20;
  const contentWidth = width - horizontalPadding * 2;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header} allowFontScaling maxFontSizeMultiplier={1.3}>
        Help Center
      </Text>

      {/* Illustration */}
      <Image
        source={require("../../assets/images/support_screen.png")}
        style={[styles.image, { width: Math.min(contentWidth, 250) }]}
        resizeMode="contain"
      />

      {/* Support Text */}
      <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
        Need our Support ?
      </Text>
      <Text
        style={styles.subtitle}
        allowFontScaling
        maxFontSizeMultiplier={1.2}
      >
        Alternatively, call us on (021) 8888888888 or email{"\n"} us at{" "}
        <Text style={styles.email}>applications.support@gmail.com</Text> for
        further{"\n"}
        assistance.
      </Text>

      {/* Call Button (using your Button component) */}
      <View style={styles.fullWidth}>
        <Button
          text="Call Us"
          leftIconName="call-outline"
          onPress={handleCall}
        />
      </View>

      {/* Mail and Chat Buttons */}
      <View style={styles.buttonRow}>
        <ActionButtonGroup
          leftButton={{
            text: "Send Mail",
            onPress: handleMail,
            variant: "outlined",
            icon: "mail-outline",
            iconPosition: "left",
            iconColor: "#1E4D92",
            backgroundColor: "#1E4D92",
            borderColor: "#1E4D92",
            textColor: "#1E4D92",
          }}
          rightButton={{
            text: "Chat Now",
            onPress: handleChat,
            variant: "outlined",
            icon: "chatbubble-ellipses-outline",
            iconPosition: "left",
            iconColor: "#1E4D92",
            backgroundColor: "#1E4D92",
            borderColor: "#1E4D92",
            textColor: "#1E4D92",
          }}
          gap={12}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: typography.tabText,
    fontWeight: fonts.weight.medium,
    marginVertical: 16,
  },
  image: {
    minHeight: 200,
    marginVertical: 4,
    aspectRatio: 1.25, // Maintains image proportions
  },
  title: {
    fontSize: typography.greetingText,
    fontWeight: fonts.weight.bold,
    marginTop: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.deeptealColor,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  email: {
    color: colors.deeptealColor,
  },
  fullWidth: {
    width: "100%",
    marginVertical: 10,
  },
  buttonRow: {
    width: "100%",
    marginTop: 10,
  },
});
