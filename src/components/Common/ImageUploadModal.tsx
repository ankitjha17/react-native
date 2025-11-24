import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";

type ImageUploadOption = {
  id: string;
  label: string;
  iconName: string;
  onPress: () => void;
};

type ImageUploadModalProps = {
  visible: boolean;
  onClose: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onFilesPress: () => void;
};

export default function ImageUploadModal({
  visible,
  onClose,
  onCameraPress,
  onGalleryPress,
  onFilesPress,
}: ImageUploadModalProps) {
  const { width } = useWindowDimensions();
  const modalWidth = width;
  const contentWidth = width - 40; // 20px padding on each side

  const options: ImageUploadOption[] = [
    {
      id: "camera",
      label: "Camera",
      iconName: "camera-outline",
      onPress: onCameraPress,
    },
    {
      id: "gallery",
      label: "Gallery",
      iconName: "images-outline",
      onPress: onGalleryPress,
    },
    {
      id: "files",
      label: "Files",
      iconName: "document-outline",
      onPress: onFilesPress,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.modalContainer,
            {
              width: modalWidth,
            },
          ]}
          onStartShouldSetResponder={() => true}
        >
          {/* Header - Close Button & Title */}
          <View style={[styles.headerContainer, { width: contentWidth }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={colors.black} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Ionicons
                name="image-outline"
                size={24}
                color={colors.black}
                style={styles.titleIcon}
              />
              <Text style={styles.titleText}>Upload Image</Text>
            </View>
          </View>

          {/* Options Container */}
          <View style={[styles.optionsContainer, { width: contentWidth }]}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.option}
                onPress={() => {
                  option.onPress();
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.iconName as any}
                  size={24}
                  color={colors.black}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 24,
    paddingBottom: Platform.select({ ios: 28, android: 48, default: 36 }),
    paddingLeft: 20,
    paddingRight: 20,
    gap: 32,
    minHeight: 187,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
    gap: 10,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  titleIcon: {
    width: 24,
    height: 24,
  },
  titleText: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: 20,
    lineHeight: Math.round(20 * 1.2), // 120% line height
    letterSpacing: 0,
    textAlign: "center",
    color: colors.darkBlack, // #161515
  },
  optionsContainer: {
    flexDirection: "row",
    height: 83,
    gap: 16,
  },
  option: {
    flex: 1,
    height: 83,
    borderWidth: 1,
    borderColor: "#99999933",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  optionIcon: {
    width: 24,
    height: 24,
  },
  optionText: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 16,
    lineHeight: Math.round(16 * 1.2), // 120% line height
    letterSpacing: 0,
    textAlign: "center",
    color: colors.black,
  },
});
