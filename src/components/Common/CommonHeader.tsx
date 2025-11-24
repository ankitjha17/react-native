import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import fonts from "@/src/constants/fonts";

interface CommonHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  backgroundImage: any;
}

export default function CommonHeader({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  backgroundImage,
}: CommonHeaderProps) {
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView edges={["top"]}>
      <ImageBackground
        source={backgroundImage}
        style={[styles.headerContainer, { width }]}
        imageStyle={[styles.headerImage, { width }]}
      >
        {/* --- Top Row --- */}
        <View style={styles.topRow}>
          {/* Left Icon */}
          {leftIcon ? (
            <TouchableOpacity
              onPress={onLeftPress}
              accessibilityLabel="Left Icon"
            >
              <Ionicons name={leftIcon as any} size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 }} /> // placeholder for alignment
          )}

          {/* Right Icon */}
          {rightIcon ? (
            <TouchableOpacity
              onPress={onRightPress}
              accessibilityLabel="Right Icon"
            >
              <Ionicons name={rightIcon as any} size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 }} />
          )}
        </View>

        {/* --- Heading --- */}
        <View style={styles.headingContainer}>
          <Text
            style={styles.headingText}
            allowFontScaling
            maxFontSizeMultiplier={1.3}
          >
            {title}
          </Text>
          {subtitle ? (
            <View style={styles.subtitleWrapper}>
              <Text
                style={styles.subtitleText}
                allowFontScaling
                maxFontSizeMultiplier={1.2}
              >
                {subtitle}
              </Text>
            </View>
          ) : null}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  headingContainer: {
    alignItems: "flex-end",
    width: "100%",
  },
  headingText: {
    fontFamily: fonts.family.bold,
    fontSize: 16,
    lineHeight: 28,
    color: "#FFFFFF",
    textAlign: "right",
    marginBottom: 4,
  },
  subtitleWrapper: {
    marginLeft: "40%",
    width: "60%",
  },
  subtitleText: {
    fontFamily: fonts.family.regular,
    fontSize: 14,
    lineHeight: 24,
    color: "rgba(255,255,255,0.85)",
    textAlign: "right",
  },
});
