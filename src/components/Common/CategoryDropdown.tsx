import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import typography from "../../constants/typography";

export type CategoryOption = {
  id: string;
  label: string;
};

type CategoryDropdownProps = {
  options: CategoryOption[];
  value?: string;
  placeholder?: string;
  onSelect: (option: CategoryOption) => void;
  containerStyle?: any;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  containerHeight?: number;
  optionHeight?: number;
  maxDropdownHeight?: number;
  overlayBackgroundColor?: string;
  useClaimProcessStyle?: boolean; // When true, applies ClaimProcessInput placeholder styling
};

export default function CategoryDropdown({
  options,
  value,
  placeholder = "Select a Category",
  onSelect,
  containerStyle,
  iconName = "chevron-down",
  iconColor = colors.black60,
  iconSize = 18,
  containerHeight = 54,
  optionHeight = 54,
  maxDropdownHeight = 300,
  useClaimProcessStyle = false,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
  });
  const containerRef = useRef<View>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  const handleOpen = () => {
    if (containerRef.current) {
      // Use measureInWindow for accurate screen coordinates
      containerRef.current.measureInWindow((x, y, width, height) => {
        // Position dropdown below input with a gap, aligned to left edge
        const gap = 2; // Gap between input and dropdown (similar to image)
        setDropdownPosition({
          x: x, // Left position - aligns with input left edge
          y: y + height + gap, // Top position - below input with gap
          width: width, // Same width as input
        });
        // Use setTimeout to ensure position is set before opening
        setTimeout(() => {
          setIsOpen(true);
        }, 10);
      });
    } else {
      setIsOpen(true);
    }
  };

  const handleSelect = (option: CategoryOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <>
      <View
        ref={containerRef}
        style={[styles.container, { height: containerHeight }, containerStyle]}
        collapsable={false}
      >
        <TouchableOpacity
          style={[styles.touchable, { height: containerHeight }]}
          onPress={handleOpen}
          activeOpacity={0.7}
        >
          {/* Left Section - Icon (20%) */}
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={iconSize} color={iconColor} />
          </View>

          {/* Right Section - Placeholder/Value (80%) */}
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.text,
                !selectedOption &&
                  (useClaimProcessStyle
                    ? styles.placeholderTextClaimProcess
                    : styles.placeholderText),
              ]}
              numberOfLines={1}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Dropdown Overlay */}
      {/* Dropdown - Modal with transparent overlay */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          // style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={[
              styles.dropdownContainer,
              {
                position: "absolute",
                left: dropdownPosition.x || 0,
                top: dropdownPosition.y || 0,
                width: dropdownPosition.width || 335,
                maxHeight: maxDropdownHeight,
              },
            ]}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    {
                      width: dropdownPosition.width || 335,
                      height: optionHeight,
                    },
                    selectedOption?.id === item.id && styles.optionItemSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  {selectedOption?.id === item.id && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.black60}
                      style={styles.checkmarkIcon}
                    />
                  )}
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  touchable: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.boxBorder,
    borderRadius: 12,
    backgroundColor: colors.white,
    width: "100%",
    alignItems: "center",
    overflow: "hidden",
  },
  iconContainer: {
    width: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    width: "80%",
    height: "100%",
    justifyContent: "center",
    paddingRight: 16,
  },
  text: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.4), // 140% line height
    color: "#161515",
    textAlign: "right",
    letterSpacing: 0,
  },
  placeholderText: {
    color: colors.black60,
    // color: colors.toggleInactiveText,
  },
  placeholderTextClaimProcess: {
    fontFamily: fonts.family.regular,
    fontWeight: fonts.weight.regular,
    fontSize: 14,
    lineHeight: Math.round(14 * 1.4), // 140% line height
    letterSpacing: 0,
    textAlign: "right",
    color: "#999999",
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  dropdownContainer: {
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.boxBorder,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  optionItemSelected: {
    backgroundColor: "#F5F5F5",
  },
  checkmarkIcon: {
    marginRight: 8,
  },
  optionText: {
    fontFamily: fonts.family.medium,
    fontSize: typography.cardHeadText2,
    color: colors.black,
    flex: 1,
    textAlign: "right",
  },
});
