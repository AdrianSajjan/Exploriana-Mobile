import { theme } from "@exploriana/config/theme";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Box } from "@exploriana/components/Box";
import { Body } from "@exploriana/components/Typography";

interface ServiceCardProp extends PressableProps {
  icon: React.ReactNode;
  caption: string;
  color?: string;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 90,
    minHeight: 90,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shapes.rounded.lg,
  },
});

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ServiceCard({ caption, icon, style, color = theme.colors.text, ...props }: ServiceCardProp) {
  const scale = useSharedValue(1);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, { duration: 150 }) }],
    };
  });

  const onPressIn = () => (scale.value = 0.95);
  const onPressOut = () => (scale.value = 1);

  return (
    <AnimatedPressable style={[styles.card, rStyle, style]} {...{ onPressIn, onPressOut, ...props }}>
      <Box marginBottom={8}>{icon}</Box>
      <Body size="sm" color={color}>
        {caption}
      </Body>
    </AnimatedPressable>
  );
}
