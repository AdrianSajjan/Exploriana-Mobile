import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isEqual, isSameMonth, isToday, parse, startOfMonth, startOfToday, startOfWeek, subMonths } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useState } from "react";
import { theme } from "@exploriana/config";
import { createFactory, initializeDate } from "@exploriana/lib/core";

const width = Dimensions.get("window").width - 48;

export default function App() {
  const factor = 7;
  const cellSize = width / factor;

  const today = startOfToday();

  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMMM-yyyy"));

  const firstDayCurrentMonth = parse(currentMonth, "MMMM-yyyy", initializeDate());

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  function nextMonth() {
    const firstDayNextMonth = addMonths(firstDayCurrentMonth, 1);
    setCurrentMonth(format(firstDayNextMonth, "MMMM-yyyy"));
  }

  function prevMonth() {
    const firstDayPrevMonth = subMonths(firstDayCurrentMonth, 1);
    setCurrentMonth(format(firstDayPrevMonth, "MMMM-yyyy"));
  }

  function color(date: Date) {
    const _isSelected = isEqual(date, selectedDay);
    const _isToday = isToday(date);
    const _isSameMonth = isSameMonth(date, firstDayCurrentMonth);
    if (_isSelected) return theme.colors.surface;
    if (!_isSelected && _isToday) return theme.colors.primary;
    if (!_isSelected && !_isToday && _isSameMonth) return theme.colors.secondary;
    if (!_isSelected && !_isToday && !_isSameMonth) return theme.colors.divider;
  }

  function backgroundColor(date: Date) {
    const _isSelected = isEqual(date, selectedDay);
    const _isToday = isToday(date);

    if (_isSelected && _isToday) return theme.colors.primary;
    if (_isSelected && !_isToday) return theme.colors.secondary;
    return theme.colors.surface;
  }

  function fontWeight(date: Date) {
    if (isEqual(date, selectedDay)) return "bold";
    return "normal";
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <View style={{ flexDirection: "row", width: width + 1, alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{format(firstDayCurrentMonth, "MMMM yyyy")}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity style={{ padding: 6 }} onPress={prevMonth}>
              <Ionicons name="chevron-back" size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 6, marginLeft: 4 }} onPress={nextMonth}>
              <Ionicons name="chevron-forward" size={18} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: "row", width: width + 1, marginTop: 12 }}>
          <View style={{ width: cellSize, height: cellSize, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ textAlign: "center", color: theme.colors.text }}>M</Text>
          </View>
          <View style={{ width: cellSize, height: cellSize, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ textAlign: "center", color: theme.colors.text }}>T</Text>
          </View>
          <View style={{ width: cellSize, height: cellSize, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ textAlign: "center", color: theme.colors.text }}>W</Text>
          </View>
          <View style={{ width: cellSize, height: cellSize, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ textAlign: "center", color: theme.colors.text }}>T</Text>
          </View>
          <View style={{ width: cellSize, height: cellSize, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ textAlign: "center", color: theme.colors.text }}>F</Text>
          </View>
          <View style={{ width: cellSize, height: cellSize, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ textAlign: "center", color: theme.colors.text }}>S</Text>
          </View>
          <View style={{ width: cellSize, height: cellSize, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ textAlign: "center", color: theme.colors.text }}>S</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", width: width + 1 }}>
          {days.map((day, idx) => (
            <View
              key={day.toString()}
              style={{
                width: cellSize,
                height: cellSize,
                alignItems: "center",
                justifyContent: "center",
                borderTopWidth: idx > 6 ? StyleSheet.hairlineWidth : 0,
                borderTopColor: theme.colors.tint,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.5}
                style={{ height: cellSize - 12, width: cellSize - 12, borderRadius: cellSize - 12, alignItems: "center", justifyContent: "center", backgroundColor: backgroundColor(day) }}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={{ textAlign: "center", color: color(day), fontWeight: fontWeight(day) }}>{format(day, "d")}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
