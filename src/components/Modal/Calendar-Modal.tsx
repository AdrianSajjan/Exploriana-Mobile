import { Box } from "@exploriana/components/Box";
import { IconButton, PrimaryButton } from "@exploriana/components/Button";
import { Divider } from "@exploriana/components/Divider";
import { Text } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config";
import * as React from "react";
import { Modal, ModalProps, StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { Calendar, CalendarProps } from "@exploriana/components/Calendar";
import { format } from "date-fns";
import { initializeDate } from "@exploriana/lib/core";

interface CalendarModalProps extends ModalProps, Omit<CalendarProps, "style"> {
  title?: string;
  dateFormat?: string;
}

const HEIGHT = 500;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: theme.colors.backdrop,
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-end",
  },
  sheet: {
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderTopRightRadius: theme.shapes.rounded.lg,
    borderTopLeftRadius: theme.shapes.rounded.lg,
  },
});

export function CalendarModal({ width, date, visible, title, dateFormat = "do LLLL yyyy", onChange, onRequestClose, ...props }: CalendarModalProps) {
  const translateY = useSharedValue(HEIGHT);

  React.useEffect(() => {
    if (visible) translateY.value = withDelay(150, withTiming(0, { duration: 250 }));
    else translateY.value = withDelay(150, withTiming(HEIGHT, { duration: 0 }));
  }, [visible]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const selected = format(initializeDate(date), dateFormat);
  const label = `Select ${selected}`;

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={onRequestClose} {...props}>
      <View style={styles.backdrop} />
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Animated.View style={[styles.sheet, rStyle]}>
          <Box alignItems="center" flexDirection="row" justifyContent="space-between">
            <Text size={18} fontWeight="bold" color={theme.colors.heading}>
              {title ?? "Select Date"}
            </Text>
            <IconButton onPress={onRequestClose}>
              <Ionicons name="close" size={20} />
            </IconButton>
          </Box>
          <Box marginTop={16} marginBottom={20} marginHorizontal={-20}>
            <Divider />
          </Box>
          <Calendar {...{ width, date, onChange }} />
          <Box marginTop={24}>
            <PrimaryButton label={label} background={theme.colors.secondary} onPress={onRequestClose} />
          </Box>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
