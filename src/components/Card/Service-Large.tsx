import { theme } from "@exploriana/config/theme";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Box } from "@exploriana/components/Box";
import { Body } from "@exploriana/components/Typography";

interface ServiceCardProp extends PressableProps {
  icon: React.ReactNode;
  title: string;
  caption: string;
  color?: string;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 90,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shapes.rounded.lg,
  },
});

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ServiceCardLarge({ caption, title, icon, style, color = theme.colors.text, ...props }: ServiceCardProp) {
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
      <Box>{icon}</Box>
      <Box marginLeft={8}>
        <Body size="md" fontWeight="medium" color={color}>
          {title}
        </Body>
        <Body size="sm" color={color} style={{ marginTop: 2 }}>
          {caption}
        </Body>
      </Box>
    </AnimatedPressable>
  );
}
