import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { ReusableImage } from "../ReusableImage";
import colors from "@/src/constants/colors";

interface HeaderProps {
  logoUrl?: string | null;
  onBack?: () => void;
}

export default function LoginHeader({ logoUrl, onBack }: HeaderProps) {
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.headerIconButton}
      >
        <Icon name="chevron-back-outline" size={24} color={colors.black} />
      </TouchableOpacity>

      <ReusableImage
        uri={logoUrl}
        fallback={require("../../assets/images/login_screen_logo.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />

      <View style={styles.headerRightPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  headerIconButton: {
    width: 32,
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 100,
    minHeight: 40,
    aspectRatio: 2.5,
  },
  headerRightPlaceholder: {
    width: 32,
    minHeight: 32,
  },
});
