import { theme } from "@exploriana/config/theme";
import { StyleSheet } from "react-native";

export const sharedStyles = StyleSheet.create({
  fullHeight: {
    flex: 1,
  },
  fullGrow: {
    flexGrow: 1,
  },
  flexRow: {
    flexDirection: "row",
  },
  minGrow: {
    flexGrow: 0,
  },
  ph: {
    paddingHorizontal: 20,
  },
  pvSmall: {
    paddingVertical: 16,
  },
  pv: {
    paddingVertical: 24,
  },
  pvMedium: {
    paddingVertical: 36,
  },
  pvLarge: {
    paddingVertical: 48,
  },
  alignCenter: {
    alignItems: "center",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  inputIcon: {
    fontSize: 18,
    color: theme.colors.placeholder,
  },
  headerDescription: {
    marginTop: -2,
  },
});
