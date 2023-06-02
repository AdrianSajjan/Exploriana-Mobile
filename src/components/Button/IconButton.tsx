import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface IconButton {
  children: React.ReactNode;
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
});

export function IconButton({ children }: IconButton) {
  return (
    <TouchableOpacity activeOpacity={0.6} style={styles.button}>
      {children}
    </TouchableOpacity>
  );
}
