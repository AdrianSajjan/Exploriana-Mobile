import { Box } from "@exploriana/components/Box";
import { theme } from "@exploriana/config";
import { Octicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from "react-native";

interface ArrivalDepartureInputProps {
  isInvalid?: boolean;

  errorText?: string;
  helperText?: string;

  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;

  arrival?: Omit<TextInputProps, "style">;
  departure?: Omit<TextInputProps, "style">;

  onSwitch?: () => void;
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shapes.rounded.lg,
  },
  invalid: {
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  switcher: {
    width: 28,
    height: 28,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.secondary,
  },
  input: {
    height: 40,
    flex: 1,
    fontFamily: theme.font.regular,
    fontSize: 15,
    borderRadius: theme.shapes.rounded.sm,
  },
  icon: {
    paddingHorizontal: 18,
    height: 40,
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

export function ArrivalDepartureInput({ icon, isInvalid, helperText, errorText, style, arrival, departure, onSwitch }: ArrivalDepartureInputProps) {
  return (
    <View style={style}>
      <View style={[styles.wrapper, isInvalid && styles.invalid]}>
        <Box flexDirection="row" paddingLeft={16} paddingTop={10}>
          <TextInput placeholderTextColor={theme.colors.placeholder} style={styles.input} {...departure}></TextInput>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
        </Box>
        <Box flexDirection="row" alignItems="center">
          <Box flex={1} height={StyleSheet.hairlineWidth} backgroundColor={theme.colors.divider} />
          <TouchableOpacity activeOpacity={0.6} style={styles.switcher} onPress={onSwitch}>
            <Octicons name="arrow-switch" size={14} color={theme.colors.surface} style={{ transform: [{ rotateZ: "90deg" }] }} />
          </TouchableOpacity>
          <Box flex={1} height={StyleSheet.hairlineWidth} backgroundColor={theme.colors.divider} />
        </Box>
        <Box flexDirection="row" paddingLeft={16} paddingBottom={10}>
          <TextInput placeholderTextColor={theme.colors.placeholder} style={styles.input} {...arrival}></TextInput>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
        </Box>
      </View>
      <Text style={[styles.helperText, isInvalid && styles.errorText]}>{isInvalid ? errorText || helperText || "" : helperText || ""}</Text>
    </View>
  );
}
