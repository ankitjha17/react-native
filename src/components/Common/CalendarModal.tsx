import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/src/constants/colors";
import fonts from "@/src/constants/fonts";

type CalendarPosition = {
  x: number;
  y: number;
  width: number;
};

type CalendarModalProps = {
  visible: boolean;
  position: CalendarPosition;
  onClose: () => void;
  onDateSelect: (date: string) => void; // Returns formatted date string (DD/MM/YYYY)
  minDate?: string; // ISO format date string (YYYY-MM-DD)
  initialMonth?: number; // 1-12
  initialYear?: number;
  allowPastDates?: boolean;
  minYear?: number;
  maxYear?: number;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarModal({
  visible,
  position,
  onClose,
  onDateSelect,
  minDate,
  initialMonth,
  initialYear,
}: CalendarModalProps) {
  const [visibleMonth, setVisibleMonth] = useState<number>(
    initialMonth || new Date().getMonth() + 1
  );
  const [visibleYear, setVisibleYear] = useState<number>(
    initialYear || new Date().getFullYear()
  );
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [yearPickerOpen, setYearPickerOpen] = useState(false);

  // Reset to current month/year when modal opens
  useEffect(() => {
    if (visible) {
      const today = new Date();
      setVisibleMonth(initialMonth || today.getMonth() + 1);
      setVisibleYear(initialYear || today.getFullYear());
      setMonthPickerOpen(false);
      setYearPickerOpen(false);
    }
  }, [visible, initialMonth, initialYear]);

  const formatDisplayDate = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  const getCurrentDateISO = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const monthOptions = monthNames.map((name, index) => ({
    id: String(index + 1),
    label: name,
  }));

  const yearOptions = Array.from({ length: 50 }, (_, i) => {
    const year = new Date().getFullYear() - 10 + i;
    return { id: String(year), label: String(year) };
  });

  const currentForCalendar = `${visibleYear}-${String(visibleMonth).padStart(
    2,
    "0"
  )}-01`;

  const handleDayPress = (day: any) => {
    const iso = day?.dateString;
    if (iso) {
      // Check if date is in the past
      const selectedDate = new Date(iso);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return; // Don't allow selecting past dates
      }

      const display = formatDisplayDate(iso);
      onDateSelect(display);
      onClose();
    }
  };

  const handleClose = () => {
    setMonthPickerOpen(false);
    setYearPickerOpen(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <View
          style={[
            styles.calendarContainer,
            {
              position: "absolute",
              left: position.x || 0,
              top: position.y || 0,
              width: position.width || 335,
            },
          ]}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
        >
          {/* Custom Header with Month/Year Dropdowns */}
          <View style={styles.calendarHeader}>
            <View style={styles.monthYearButtonContainer}>
              <TouchableOpacity
                style={styles.monthYearButton}
                onPress={() => {
                  setMonthPickerOpen(!monthPickerOpen);
                  setYearPickerOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.monthYearText}>
                  {monthNames[visibleMonth - 1]}
                </Text>
                <Ionicons
                  name={monthPickerOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.black60}
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>
              {monthPickerOpen && (
                <View style={[styles.inlineDropdown, styles.monthDropdown]}>
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                    bounces={false}
                    style={styles.dropdownScrollView}
                    contentContainerStyle={styles.dropdownContentContainer}
                  >
                    {monthOptions.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.dropdownOption,
                          visibleMonth === parseInt(item.id, 10) &&
                            styles.dropdownOptionSelected,
                        ]}
                        onPress={() => {
                          setVisibleMonth(parseInt(item.id, 10));
                          setMonthPickerOpen(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            visibleMonth === parseInt(item.id, 10) &&
                              styles.dropdownOptionTextSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <View style={styles.monthYearButtonContainer}>
              <TouchableOpacity
                style={styles.monthYearButton}
                onPress={() => {
                  setYearPickerOpen(!yearPickerOpen);
                  setMonthPickerOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.monthYearText}>{visibleYear}</Text>
                <Ionicons
                  name={yearPickerOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.black60}
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>
              {yearPickerOpen && (
                <View style={[styles.inlineDropdown, styles.yearDropdown]}>
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                    bounces={false}
                    style={styles.dropdownScrollView}
                    contentContainerStyle={styles.dropdownContentContainer}
                  >
                    {yearOptions.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.dropdownOption,
                          visibleYear === parseInt(item.id, 10) &&
                            styles.dropdownOptionSelected,
                        ]}
                        onPress={() => {
                          setVisibleYear(parseInt(item.id, 10));
                          setYearPickerOpen(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            visibleYear === parseInt(item.id, 10) &&
                              styles.dropdownOptionTextSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
          <Calendar
            current={currentForCalendar}
            enableSwipeMonths
            hideArrows
            minDate={minDate || getCurrentDateISO()}
            renderHeader={() => null}
            onMonthChange={(date: any) => {
              if (date?.month) setVisibleMonth(date.month);
              if (date?.year) setVisibleYear(date.year);
            }}
            onDayPress={handleDayPress}
            theme={{
              ...({
                "stylesheet.calendar.header": {
                  week: {
                    marginTop: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
                },
              } as any),
              textDayFontFamily: fonts.family.regular,
              textMonthFontFamily: fonts.family.regular,
              textDayHeaderFontFamily: fonts.family.medium,
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
              selectedDayBackgroundColor: colors.orange || "#FF6B35",
              selectedDayTextColor: colors.white,
              todayTextColor: colors.orange || "#FF6B35",
              disabledTextColor: colors.black60,
            }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  calendarContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.boxBorder,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    maxHeight: 400,
    overflow: "visible",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingHorizontal: 8,
    position: "relative",
    zIndex: 100,
  },
  monthYearButtonContainer: {
    position: "relative",
    zIndex: 200,
  },
  monthYearButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  monthYearText: {
    fontFamily: fonts.family.medium,
    fontWeight: fonts.weight.medium,
    fontSize: 16,
    color: colors.black,
  },
  chevronIcon: {
    marginLeft: 6,
  },
  inlineDropdown: {
    position: "absolute",
    top: "100%",
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.boxBorder,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    height: 216,
    minWidth: 140,
    width: 140,
    zIndex: 10000,
    marginTop: 4,
  },
  monthDropdown: {
    left: 0,
  },
  yearDropdown: {
    right: 0,
  },
  dropdownScrollView: {
    flex: 1,
  },
  dropdownContentContainer: {
    flexGrow: 1,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    justifyContent: "center",
  },
  dropdownOptionSelected: {
    backgroundColor: "#F5F5F5",
  },
  dropdownOptionText: {
    fontFamily: fonts.family.medium,
    fontSize: 14,
    color: colors.black,
    textAlign: "right",
    lineHeight: 20,
  },
  dropdownOptionTextSelected: {
    color: colors.black,
    fontWeight: fonts.weight.medium,
  },
});
