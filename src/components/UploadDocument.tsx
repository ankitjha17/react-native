import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import ImageUploadModal from "./Common/ImageUploadModal";

type UploadDocumentProps = {
  label?: string;
  title?: string;
  subtitle: string;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  onPress?: () => void;
  onCameraPress?: () => void;
  onGalleryPress?: () => void;
  onFilesPress?: () => void;
  containerStyle?: any;
  iconPosition?: "left" | "right";
  wrapperStyle?: any;
};

export default function UploadDocument({
  label,
  title,
  subtitle,
  iconName = "add-circle-outline",
  iconSize = 24,
  iconColor = colors.black60,
  onPress,
  onCameraPress,
  onGalleryPress,
  onFilesPress,
  containerStyle,
  iconPosition = "right",
  wrapperStyle,
}: UploadDocumentProps) {
  const hasTitle = !!title;
  const [modalVisible, setModalVisible] = useState(false);
  const hasUploadHandlers = !!(onCameraPress || onGalleryPress || onFilesPress);
  const handlePress = () => {
    if (hasUploadHandlers) {
      // Open image upload modal
      setModalVisible(true);
    } else if (onPress) {
      // Use custom onPress handler
      onPress();
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      {label && <View style={styles.gap} />}
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={!onPress && !hasUploadHandlers}
      >
        {/* Internal View - Title, Subtitle & Icon */}
        <View
          style={[
            styles.innerContainer,
            iconPosition === "left"
              ? styles.innerContainerLeft
              : styles.innerContainerRight,
          ]}
        >
          {/* Icon View */}
          <View style={styles.iconContainer}>
            <Ionicons
              name={iconName as any}
              size={iconSize}
              color={iconColor}
            />
          </View>

          {/* Title & Subtitle View */}
          <View style={styles.textContainer}>
            {hasTitle && (
              <Text style={styles.titleText} numberOfLines={1}>
                {title}
              </Text>
            )}
            <Text
              style={[
                styles.subtitleText,
                !hasTitle && styles.subtitleTextNoTitle,
              ]}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Image Upload Modal */}
      {hasUploadHandlers && (
        <ImageUploadModal
          visible={modalVisible}
          onClose={handleCloseModal}
          onCameraPress={onCameraPress || (() => {})}
          onGalleryPress={onGalleryPress || (() => {})}
          onFilesPress={onFilesPress || (() => {})}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: Platform.select({
      ios: 30,
      android: 24,
      default: 24,
    }),
  },
  label: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.4), // 140% line height
    letterSpacing: 0,
    color: colors.deeptealColor, // #1E4646
    textAlign: "right",
    writingDirection: "rtl",
  },
  gap: {
    height: 14,
  },
  container: {
    width: "100%",
    height: 54,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.boxBorder,
    borderStyle: "dashed",
    paddingTop: 12,
    paddingRight: 16,
    paddingBottom: 12,
    paddingLeft: 16,
    backgroundColor: colors.white,
  },
  innerContainer: {
    width: "100%",
    height: 34,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  innerContainerLeft: {
    flexDirection: "row",
  },
  innerContainerRight: {
    flexDirection: "row-reverse",
  },
  textContainer: {
    width: "100%",
    height: 34,
    justifyContent: "center",
    flex: 1,
    marginBottom: 10,
  },
  titleText: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.4), // 140% line height
    letterSpacing: 0,
    color: colors.black,
    marginBottom: 2,
    textAlign: "right",
  },
  subtitleText: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 12,
    lineHeight: Math.round(12 * 1.0), // 100% line height
    letterSpacing: 0,
    textAlign: "right",
    color: colors.black60,
  },
  subtitleTextNoTitle: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 12,
    lineHeight: Math.round(12 * 1.0), // 100% line height
    letterSpacing: 0,
    textAlign: "right",
    color: colors.black60,
  },
  iconContainer: {
    marginBottom: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
