import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";
import typography from "@/src/constants/typography";

type PolicyActionsProps = {
  onContactSupport?: () => void;
  onRaiseClaim?: () => void;
};

export default function PolicyActions({
  onContactSupport,
  onRaiseClaim,
}: PolicyActionsProps) {
  return (
    <View style={styles.actionRow}>
      <TouchableOpacity
        style={[styles.actionButton, styles.supportButton]}
        onPress={onContactSupport}
        accessibilityRole="button"
        accessibilityLabel="Contact Support"
      >
        <Ionicons name="call-outline" size={18} color={colors.white} />
        <Text style={styles.actionText}>Contact Support</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.claimButton]}
        onPress={onRaiseClaim}
        accessibilityRole="button"
        accessibilityLabel="Raise a Claim"
      >
        <Ionicons name="hammer-outline" size={18} color={colors.white} />
        <Text style={styles.actionText}>Raise a Claim</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "stretch",
    marginTop: 0,
    overflow: "hidden",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 6,
  },
  supportButton: {
    backgroundColor: colors.button,
    borderBottomLeftRadius: 8,
  },
  claimButton: {
    backgroundColor: colors.primaryColor,
    borderBottomRightRadius: 8,
  },
  actionText: {
    color: colors.white,
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: typography.serviceText,
  },
});
