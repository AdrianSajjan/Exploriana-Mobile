import { theme } from "@exploriana/config";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, { interpolate, interpolateColor, useAnimatedStyle } from "react-native-reanimated";

interface DotProps {
  index: number;
  scrollX: Animated.SharedValue<number>;
  length: number;
}

export function Dots({ index, scrollX, length }: DotProps) {
  const { width } = useWindowDimensions();

  const activeColor = theme.colors.primary;
  const inactiveColor = theme.colors.tint;

  const input = Array(length)
    .fill(0)
    .map((_, i) => i * width);

  const backgroundOutput = Array(length)
    .fill(0)
    .map((_, i) => (i === index ? activeColor : inactiveColor));

  const widthOutput = Array(length)
    .fill(0)
    .map((_, i) => (i === index ? 30 : 5));

  const style = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(scrollX.value, input, backgroundOutput, "RGB") as string;
    const width = interpolate(scrollX.value, input, widthOutput);
    return {
      backgroundColor,
      width,
    };
  });

  return <Animated.View style={[styles.dots, style]} />;
}

const styles = StyleSheet.create({
  dots: {
    width: 5,
    height: 5,
    borderRadius: 12,
    marginHorizontal: 4,
  },
});
