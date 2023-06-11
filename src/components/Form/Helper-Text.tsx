import { theme } from "@exploriana/config/theme";
import { StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
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

export function HelperText({ children, isInvalid }: { children: React.ReactNode; isInvalid?: boolean; dense?: boolean }) {
  return <Text style={[styles.helperText, isInvalid && styles.errorText]}>{children}</Text>;
}
