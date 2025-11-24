import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../../../constants/colors";
import fonts from "../../../constants/fonts";
import typography from "../../../constants/typography";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAppNavigation } from "../../../hooks/useAppNavigation";
import Button from "@/src/components/Common/Button";
import CalendarModal from "@/src/components/Common/CalendarModal";
import TextField from "@/src/components/TextField";

const EditProfile = () => {
  const { goBack } = useAppNavigation();

  const [firstName, setFirstName] = useState("Sebastian");
  const [lastName, setLastName] = useState("Reed");
  const [dob, setDob] = useState("24/04/2020");

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({
    x: 0,
    y: 0,
    width: 335,
  });

  const [initialMonth, setInitialMonth] = useState<number>(() =>
    parseInt(dob.split("/")[1], 10)
  );
  const [initialYear, setInitialYear] = useState<number>(() =>
    parseInt(dob.split("/")[2], 10)
  );

  const dobFieldRef = useRef<View | null>(null);

  const [country] = useState("Indonesia");
  const [state] = useState("DKI Jakarta");
  const [city] = useState("Selatan");
  const [address, setAddress] = useState(
    "Jl Mampang Prapatan XIV No 7A, Jakarta Selatan 12790"
  );

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="chevron-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image
            source={require("../../../assets/images/profileImage.jpg")}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="pencil" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.uploadLabel}>Upload photo</Text>
        <Text style={styles.uploadHint}>
          {`Format should be .jpeg .png atleast\n800x800px and less than 5MB`}
        </Text>

        {/* First Name */}
        <TextField
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
        />

        {/* Last Name */}
        <TextField
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
        />

        {/* DOB */}
        <View ref={dobFieldRef} collapsable={false}>
          <TextField
            label="Date of Birth"
            value={dob}
            editable={false}
            onPress={() => {
              if (dobFieldRef.current) {
                dobFieldRef.current.measureInWindow((x, y, width, height) => {
                  const gap = 4;
                  setCalendarPosition({ x, y: y + height + gap, width });
                });
              }

              const [d, m, y] = dob.split("/");
              setInitialMonth(parseInt(m, 10));
              setInitialYear(parseInt(y, 10));

              setTimeout(() => setCalendarOpen(true), 10);
            }}
            leftIcon={
              <Feather name="calendar" size={20} color={colors.black60} />
            }
          />
        </View>

        {/* Address Title */}
        <Text style={styles.sectionTitle}>Address</Text>
        <Text style={styles.sectionSub}>Your current domicile</Text>

        {/* Country */}
        <TextField
          label="Country"
          value={country}
          editable={false}
          onPress={() => {}}
          rightIconName="chevron-down"
        />

        {/* State */}
        <TextField
          label="State"
          value={state}
          editable={false}
          onPress={() => {}}
          rightIconName="chevron-down"
        />

        {/* City */}
        <TextField
          label="City"
          value={city}
          editable={false}
          onPress={() => {}}
          rightIconName="chevron-down"
        />

        {/* Address */}
        <TextField
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
          multiline
          height={182}
          isLast
        />

        <Button text="Update" onPress={goBack} />
      </KeyboardAwareScrollView>

      {/* Calendar Modal */}
      <CalendarModal
        visible={calendarOpen}
        position={calendarPosition}
        onClose={() => setCalendarOpen(false)}
        onDateSelect={(date) => setDob(date)}
        initialMonth={initialMonth}
        initialYear={initialYear}
        allowPastDates
        minYear={1900}
        maxYear={new Date().getFullYear()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    fontFamily: fonts.family.medium,
    fontSize: typography.tabText,
    color: colors.black,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  avatarWrapper: {
    alignSelf: "center",
    width: 90,
    height: 90,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  editBadge: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  uploadLabel: {
    marginTop: 12,
    textAlign: "center",
    fontFamily: fonts.family.medium,
    fontSize: typography.headingText1,
    color: colors.black,
  },
  uploadHint: {
    marginTop: 4,
    textAlign: "center",
    fontFamily: fonts.family.regular,
    fontSize: typography.serviceText,
    color: colors.black60,
  },
  sectionTitle: {
    marginTop: 20,
    fontFamily: fonts.family.medium,
    fontSize: typography.cardHeadText2,
    color: colors.black,
    textAlign: "right",
  },
  sectionSub: {
    marginTop: 2,
    fontFamily: fonts.family.regular,
    fontSize: typography.serviceText,
    color: colors.black60,
    textAlign: "right",
  },
});

export default EditProfile;
