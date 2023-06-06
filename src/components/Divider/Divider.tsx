import { Fragment } from "react";
import { theme } from "@exploriana/config";
import { Box } from "@exploriana/components/Box";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface DividerProps {
  caption?: string;
  color?: string;
  width?: number;
  type?: "solid" | "dotted" | "dashed";
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.font.regular,
    fontSize: 14,
    color: theme.colors.placeholder,
    marginHorizontal: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export function Divider({ caption, width = StyleSheet.hairlineWidth, style, type = "solid", color = theme.colors.divider }: DividerProps) {
  return (
    <View style={[styles.container, style]}>
      <Box flex={1} borderTopWidth={width} borderStyle={type} borderTopColor={color}></Box>
      {Boolean(caption) && (
        <Fragment>
          <Text style={styles.text}>{caption}</Text>
          <Box flex={1} borderTopWidth={width} borderStyle={type} borderTopColor={color}></Box>
        </Fragment>
      )}
    </View>
  );
}
