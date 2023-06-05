import * as React from "react";
import { StyleProp, StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from "react-native";

interface IconButton extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
});

export function IconButton({ style, children, ...props }: IconButton) {
  return (
    <TouchableOpacity activeOpacity={0.6} style={[style, styles.button]} {...props}>
      {children}
    </TouchableOpacity>
  );
}
