import { useState } from "react";
import { Box } from "@exploriana/components/Box";
import { theme } from "@exploriana/config";
import { initializeDate } from "@exploriana/lib/core";
import { Body, Text } from "@exploriana/components/Typography";
import { Ionicons } from "@expo/vector-icons";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isEqual, isSameMonth, isToday, parse, startOfDay, startOfWeek, subMonths } from "date-fns";
import { StyleProp, StyleSheet, TouchableOpacity, TouchableOpacityProps, View, ViewStyle, useWindowDimensions } from "react-native";

export interface CalendarProps {
  width?: number;
  style?: StyleProp<ViewStyle>;
  date?: string | Date | number;
  onChange?: (dateString: string, date: Date) => void;
}

const noOfColumns = 7;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    alignItems: "center",
  },
  iconButton: {
    padding: 6,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  cell: {
    paddingTop: 2.5,
  },
});

const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function Calendar(props: CalendarProps) {
  const dimensions = useWindowDimensions();

  const width = props.width ? props.width : dimensions.width - 48;
  const containerWidth = width + 1;
  const cellSize = width / noOfColumns;
  const buttonSize = cellSize - 12;

  const date = initializeDate(props.date);
  const selectedDay = startOfDay(date);

  const [currentMonth, setCurrentMonth] = useState(format(selectedDay, "MMMM-yyyy"));

  const firstDayCurrentMonth = parse(currentMonth, "MMMM-yyyy", initializeDate());
  const days = eachDayOfInterval({ start: startOfWeek(firstDayCurrentMonth), end: endOfWeek(endOfMonth(firstDayCurrentMonth)) });

  function handleNextMonth() {
    const firstDayNextMonth = addMonths(firstDayCurrentMonth, 1);
    setCurrentMonth(format(firstDayNextMonth, "MMMM-yyyy"));
  }

  function handlePreviousMonth() {
    const firstDayPrevMonth = subMonths(firstDayCurrentMonth, 1);
    setCurrentMonth(format(firstDayPrevMonth, "MMMM-yyyy"));
  }

  function handleSelectDay(day: Date) {
    return () => {
      const dateString = day.toISOString();
      props.onChange?.(dateString, day);
    };
  }

  function color(date: Date) {
    const today = isToday(date);
    const selected = isEqual(date, selectedDay);
    const sameMonth = isSameMonth(date, firstDayCurrentMonth);
    if (selected) return theme.colors.surface;
    if (!selected && today) return theme.colors.primary;
    if (!selected && !today && sameMonth) return theme.colors.secondary;
    if (!selected && !today && !sameMonth) return theme.colors.divider;
  }

  function borderTop(index: number) {
    return index > 6 ? StyleSheet.hairlineWidth : 0;
  }

  function backgroundColor(date: Date) {
    const today = isToday(date);
    const selected = isEqual(date, selectedDay);
    if (selected && today) return theme.colors.primary;
    if (selected && !today) return theme.colors.secondary;
    return theme.colors.surface;
  }

  function fontWeight(date: Date) {
    const selected = isEqual(date, selectedDay);
    if (selected) return "bold";
    return "regular";
  }

  function key(date: Date, index: number) {
    return date.toString() + index;
  }

  return (
    <View style={[styles.container, props.style]}>
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" width={containerWidth}>
        <Text size={16} fontWeight="medium" color={theme.colors.secondary}>
          {format(firstDayCurrentMonth, "MMMM yyyy")}
        </Text>
        <Box flexDirection="row" alignItems="center" justifyContent="center" marginRight={-12}>
          <TouchableOpacity style={styles.iconButton} onPress={handlePreviousMonth}>
            <Ionicons name="chevron-back" size={18} color={theme.colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { marginLeft: 4 }]} onPress={handleNextMonth}>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.secondary} />
          </TouchableOpacity>
        </Box>
      </Box>
      <Box flexDirection="row" width={containerWidth} marginTop={4}>
        {week.map((day) => (
          <Box key={day} width={cellSize} height={cellSize} alignItems="center" justifyContent="center">
            <Body fontWeight="medium" textAlign="center">
              {day.charAt(0)}
            </Body>
          </Box>
        ))}
      </Box>
      <Box flexDirection="row" flexWrap="wrap" width={containerWidth}>
        {days.map((day, idx) => (
          <Box width={cellSize} height={cellSize} alignItems="center" justifyContent="center" borderTopWidth={borderTop(idx)} borderTopColor={theme.colors.tint} key={key(date, idx)}>
            <CellButton size={buttonSize} onPress={handleSelectDay(day)} style={[styles.button, { backgroundColor: backgroundColor(day) }]}>
              <Body textAlign="center" style={styles.cell} color={color(day)} fontWeight={fontWeight(day)}>
                {format(day, "d")}
              </Body>
            </CellButton>
          </Box>
        ))}
      </Box>
    </View>
  );
}

function CellButton({ size, style, ...props }: TouchableOpacityProps & { size: number }) {
  return <TouchableOpacity activeOpacity={0.5} style={[style, { height: size, width: size, borderRadius: size }]} {...props} />;
}
