import * as React from "react";
import { Box } from "@exploriana/components/Box";
import { theme } from "@exploriana/config/theme";
import { sharedStyles } from "@exploriana/styles/shared";
import { Octicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle, TouchableOpacityProps } from "react-native";
import { SelectCityModal } from "@exploriana/components/Modal";

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
    borderWidth: StyleSheet.hairlineWidth,
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
    color: theme.colors.secondary,
    fontFamily: theme.font.regular,
    fontSize: 15,
    borderRadius: theme.shapes.rounded.sm,
  },
  switch: {
    transform: [{ rotateZ: "90deg" }],
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
        <DepartureInput icon={icon} {...departure} />
        <Box flexDirection="row" alignItems="center">
          <Box flex={1} height={StyleSheet.hairlineWidth} backgroundColor={theme.colors.divider} />
          <TouchableOpacity activeOpacity={0.6} style={styles.switcher} onPress={onSwitch}>
            <Octicons name="arrow-switch" size={14} color={theme.colors.surface} style={styles.switch} />
          </TouchableOpacity>
          <Box flex={1} height={StyleSheet.hairlineWidth} backgroundColor={theme.colors.divider} />
        </Box>
        <ArrivalInput icon={icon} {...arrival} />
      </View>
      <Text style={[styles.helperText, isInvalid && styles.errorText]}>{isInvalid ? errorText || helperText || "" : helperText || ""}</Text>
    </View>
  );
}

function DepartureInput({ icon, value, onChangeText, ...props }: TextInputProps & { icon?: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);

  function onSelect(text: string) {
    onChangeText?.(text);
    setVisible(false);
  }

  return (
    <React.Fragment>
      <Box flexDirection="row" paddingLeft={16} paddingTop={10}>
        <TouchableOpacity activeOpacity={0.7} style={sharedStyles.fullHeight} onPress={() => setVisible(true)}>
          <TextInput value={value} placeholderTextColor={theme.colors.placeholder} pointerEvents="none" editable={false} style={styles.input} {...props} />
        </TouchableOpacity>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
      </Box>
      <SelectCityModal onSelect={onSelect} visible={visible} onRequestClose={() => setVisible(false)} />
    </React.Fragment>
  );
}

function ArrivalInput({ icon, value, onChangeText, ...props }: TextInputProps & { icon?: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);

  function onSelect(text: string) {
    onChangeText?.(text);
    setVisible(false);
  }

  return (
    <React.Fragment>
      <Box flexDirection="row" paddingLeft={16} paddingBottom={10}>
        <TouchableOpacity activeOpacity={0.7} style={sharedStyles.fullHeight} onPress={() => setVisible(true)}>
          <TextInput value={value} placeholderTextColor={theme.colors.placeholder} pointerEvents="none" editable={false} style={styles.input} {...props} />
        </TouchableOpacity>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
      </Box>
      <SelectCityModal onSelect={onSelect} visible={visible} onRequestClose={() => setVisible(false)} />
    </React.Fragment>
  );
}
