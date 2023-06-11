import { theme } from "@exploriana/config/theme";
import { Feather } from "@expo/vector-icons";
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from "react-native";

interface SearchBarProps extends Omit<TextInputProps, "style"> {
  style?: StyleProp<ViewStyle>;
  Input?: typeof TextInput;
}

const styles = StyleSheet.create({
  wrapper: {
    height: 56,
    paddingLeft: 18,
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
    marginLeft: 18,
    paddingRight: 16,
    fontFamily: theme.font.regular,
    fontSize: 16,
    color: theme.colors.secondary,
    borderRadius: theme.shapes.rounded.lg,
  },
  icon: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
});

export function SearchBar({ style, Input = TextInput, ...props }: SearchBarProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.icon}>
        <Feather name="search" size={18} color={theme.colors.placeholder} />
      </View>
      <Input returnKeyType="search" placeholderTextColor={theme.colors.placeholder} style={styles.input} {...props} />
    </View>
  );
}
