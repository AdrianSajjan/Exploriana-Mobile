import * as React from "react";
import { ButtonProps, PressableProps, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface IconButton extends PressableProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
});

export function IconButton({ style, children }: IconButton) {
  return (
    <TouchableOpacity activeOpacity={0.6} style={[style, styles.button]}>
      {children}
    </TouchableOpacity>
  );
}
