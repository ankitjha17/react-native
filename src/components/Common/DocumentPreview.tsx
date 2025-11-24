import colors from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButtonGroup from "./ActionButtonGroup";
import fonts from "@/src/constants/fonts";

type DocumentPreviewProps = {
  visible: boolean;
  fileName: string;
  fileSize: string;
  fileUri: string; // URI/path to the file
  fileType: "pdf" | "image"; // Type of file
  onClose: () => void;
  onDelete: () => void;
  onUploadMore: () => void; // Opens ImageUploadModal again
};

export default function DocumentPreview({
  visible,
  fileName,
  fileSize,
  fileUri,
  fileType,
  onClose,
  onDelete,
  onUploadMore,
}: DocumentPreviewProps) {
  const { width, height } = useWindowDimensions();
  const horizontalPadding = 20;
  const contentWidth = width - horizontalPadding * 2;
  const modalHeight = height * 0.7; // 70% of screen height

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const handleUploadMore = () => {
    onClose();
    onUploadMore();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View
            style={[
              styles.modalContainer,
              {
                width: width,
                height: modalHeight,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            {/* Header - Close Icon & Title */}
            <View style={[styles.headerContainer, { width: contentWidth }]}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={colors.black} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Document Preview</Text>
            </View>

            {/* Document Preview Area */}
            <View style={[styles.previewArea, { width: contentWidth }]}>
              {/* File Info - Name & Size */}
              <View style={[styles.fileInfoContainer, { width: contentWidth }]}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {fileName}
                </Text>
                <Text style={styles.fileSize}>{fileSize}</Text>
              </View>

              {/* Document Preview Container */}
              <View style={[styles.documentContainer, { width: contentWidth }]}>
                {fileType === "image" ? (
                  <ScrollView
                    contentContainerStyle={styles.imageScrollContent}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={true}
                  >
                    <Image
                      source={{ uri: fileUri }}
                      style={styles.imagePreview}
                      resizeMode="contain"
                    />
                  </ScrollView>
                ) : (
                  <View style={styles.pdfContainer}>
                    <Text style={styles.pdfPlaceholder}>
                      PDF Preview{"\n"}
                      (PDF viewer integration needed)
                    </Text>
                    {/* TODO: Integrate PDF viewer library like react-native-pdf */}
                  </View>
                )}
              </View>
            </View>

            {/* Gap */}
            <View style={styles.gap} />

            {/* Action Buttons */}
            <View style={[styles.buttonsContainer, { width: contentWidth }]}>
              <ActionButtonGroup
                leftButton={{
                  text: "Delete",
                  onPress: handleDelete,
                  variant: "outlined",
                  backgroundColor: colors.button,
                  borderColor: colors.button,
                  textColor: colors.button,
                }}
                rightButton={{
                  text: "Upload More",
                  onPress: handleUploadMore,
                  variant: "outlined",
                  backgroundColor: colors.button,
                  borderColor: colors.button,
                  textColor: colors.button,
                }}
                gap={16}
                buttonHeight={54}
              />
            </View>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
    paddingBottom: 24,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 24,
    marginBottom: 16,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: 20,
    lineHeight: Math.round(20 * 1.2),
    letterSpacing: 0,
    textAlign: "center",
    color: colors.black,
    flex: 1,
  },
  previewArea: {
    height: 488,
    gap: 16,
  },
  fileInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 17,
  },
  fileName: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 16,
    lineHeight: Math.round(16 * 1.2), // 120% line height
    letterSpacing: 0,
    textAlign: "left",
    color: colors.black, // #000000
    flex: 1,
    marginRight: 8,
  },
  fileSize: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.2), // 120% line height
    letterSpacing: 0,
    textAlign: "right",
    color: "#16151599",
  },
  documentContainer: {
    width: 335,
    height: 455,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  imageScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    minHeight: 455,
  },
  pdfContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pdfPlaceholder: {
    fontFamily: fonts.family.regular,
    fontSize: 14,
    color: colors.black60,
    textAlign: "center",
  },
  gap: {
    height: 32,
  },
  buttonsContainer: {
    height: 54,
  },
});
