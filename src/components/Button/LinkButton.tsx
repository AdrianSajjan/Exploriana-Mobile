import { theme } from "@exploriana/config/theme";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { ButtonProps } from "@exploriana/interface";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function LinkButton({ label, fullWidth, style, onPress }: ButtonProps) {
  const scale = useSharedValue(1);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, { duration: 150 }) }],
    };
  });

  const onPressIn = () => (scale.value = 0.95);
  const onPressOut = () => (scale.value = 1);

  const pStyle: ViewStyle = {
    width: fullWidth ? "100%" : "auto",
  };

  return (
    <AnimatedPressable style={[styles.button, rStyle, pStyle, style]} onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    textDecorationLine: "underline",
    fontFamily: theme.font.regular,
  },
});
