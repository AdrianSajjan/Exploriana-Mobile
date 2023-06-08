import { CalendarModal } from "@exploriana/components/Modal";
import { theme } from "@exploriana/config";
import { initializeDate } from "@exploriana/lib/core";
import { sharedStyles } from "@exploriana/styles/shared";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Fragment, useState } from "react";
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from "react-native";

interface DatePickerProps extends Omit<TextInputProps, "style" | "value" | "onChange"> {
  isInvalid?: boolean;
  errorText?: string;
  helperText?: string;
  title?: string;
  value?: Date | number | string;
  dateFormat?: string;
  style?: StyleProp<ViewStyle>;
  onChange?: (dateString: string, date: Date) => void;
}

const styles = StyleSheet.create({
  wrapper: {
    height: 56,
    paddingLeft: 16,
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shapes.rounded.lg,
  },
  invalid: {
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  input: {
    height: 56,
    flex: 1,
    color: theme.colors.secondary,
    fontFamily: theme.font.regular,
    fontSize: 15,
    borderRadius: theme.shapes.rounded.lg,
  },
  icon: {
    paddingHorizontal: 18,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  helperText: {
    marginTop: 4,
    marginLeft: 12,
    color: theme.colors.placeholder,
    fontFamily: theme.font.regular,
    fontSize: 13,
  },
  errorText: {
    color: theme.colors.error,
  },
});

export function DatePicker({ value, title, dateFormat = "do LLLL yyyy", isInvalid, helperText, errorText, style, onChange, ...props }: DatePickerProps) {
  const [isModalVisible, setModalVisible] = useState(false);

  function handleModalOpen() {
    setModalVisible(true);
  }

  function handleModalClose() {
    setModalVisible(false);
  }

  const date = format(initializeDate(value), dateFormat);

  return (
    <Fragment>
      <View style={style}>
        <View style={[styles.wrapper, isInvalid && styles.invalid]}>
          <TouchableOpacity activeOpacity={0.7} style={sharedStyles.fullHeight} onPress={handleModalOpen}>
            <TextInput value={date} placeholderTextColor={theme.colors.placeholder} pointerEvents="none" editable={false} style={styles.input} {...props} />
          </TouchableOpacity>
          <View style={styles.icon}>
            <Ionicons name="calendar" size={16} color={theme.colors.text} />
          </View>
        </View>
        <Text style={[styles.helperText, isInvalid && styles.errorText]}>{isInvalid ? errorText || helperText || "" : helperText || ""}</Text>
      </View>
      <CalendarModal title={title} date={value} onChange={onChange} visible={isModalVisible} onRequestClose={handleModalClose} />
    </Fragment>
  );
}
