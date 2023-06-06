import { Box } from "@exploriana/components/Box";
import { Body } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config";

import { Feather } from "@expo/vector-icons";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

export type TripType = "one-way" | "return-trip";

export interface TripTypeSwitchProps {
  value: TripType;
  style?: StyleProp<ViewStyle>;
  onChange: (value: TripType) => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: 4,
    borderRadius: theme.shapes.rounded.lg,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shapes.rounded.md,
  },
  selected: {
    backgroundColor: theme.colors.secondary,
  },
  oneWay: {
    marginLeft: 4,
  },
  returnTrip: {
    marginLeft: 8,
  },
});

export function TripTypeSwitch({ style, value, onChange }: TripTypeSwitchProps) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity activeOpacity={0.6} style={[styles.button, value === "one-way" && styles.selected]} onPress={() => onChange("one-way")}>
        <Box flexDirection="row" alignItems="center">
          <Feather name="chevrons-right" size={16} color={value === "one-way" ? theme.colors.surface : theme.colors.text} />
          <Body size="md" color={value === "one-way" ? theme.colors.surface : theme.colors.text} style={styles.oneWay}>
            One Way
          </Body>
        </Box>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.6} style={[styles.button, value === "return-trip" && styles.selected]} onPress={() => onChange("return-trip")}>
        <Box flexDirection="row" alignItems="center">
          <Feather name="repeat" size={14} color={value === "return-trip" ? theme.colors.surface : theme.colors.text} />
          <Body size="md" color={value === "return-trip" ? theme.colors.surface : theme.colors.text} style={styles.returnTrip}>
            Return Trip
          </Body>
        </Box>
      </TouchableOpacity>
    </View>
  );
}
