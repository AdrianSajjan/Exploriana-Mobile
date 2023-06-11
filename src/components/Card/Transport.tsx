import { Box } from "@exploriana/components/Box";
import { Connector, Divider } from "@exploriana/components/Divider";
import { Body, Caption, Heading } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config/theme";
import { Transport } from "@exploriana/interface/core";
import { initializeDate } from "@exploriana/lib/core";
import { formatTimeInterval, formatToIndianCurrency, formatToIndianLocale } from "@exploriana/lib/format";
import { sharedStyles } from "@exploriana/styles/shared";
import { format, intervalToDuration, parse } from "date-fns";
import { Image, ImageSourcePropType, Pressable, PressableProps, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface TransportCardProps extends PressableProps {
  data: Transport;
  icon: React.ReactNode;
  cover: ImageSourcePropType;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
  brand: {
    height: 32,
    width: 32,
    resizeMode: "contain",
  },
  divider: {
    marginTop: 20,
  },
  name: {
    marginLeft: 8,
  },
});

export function TransportCard({ cover, icon, data, style, ...props }: TransportCardProps) {
  const scale = useSharedValue(1);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, { duration: 100 }) }],
    };
  });

  const onPressIn = () => {
    scale.value = 0.98;
  };

  const onPressOut = () => {
    scale.value = 1;
  };

  return (
    <AnimatedPressable style={[style, rStyle]} onPressIn={onPressIn} onPressOut={onPressOut} {...props}>
      <Box backgroundColor={theme.colors.surface} borderRadius={theme.shapes.rounded.lg} paddingVertical={16} paddingHorizontal={24}>
        <Box flexDirection="row" alignItems="center">
          <Image source={cover} style={styles.brand} />
          <Body color={theme.colors.secondary} size="md" fontWeight="medium" style={styles.name}>
            {data.name}
          </Body>
        </Box>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={16}>
          <Body fontWeight="bold" color={theme.colors.secondary}>
            {format(initializeDate(data.timeOfDeparture), "HH:mm")}
          </Body>
          <Connector icon={icon} />
          <Body fontWeight="bold" color={theme.colors.secondary}>
            {format(initializeDate(data.timeOfArrival), "HH:mm")}
          </Body>
        </Box>
        <Box flexDirection="row" alignItems="center" marginTop={4}>
          <Caption color={theme.colors.text} style={[sharedStyles.fullHeight]} textAlign="left">
            {data.placeOfDeparture}
          </Caption>
          <Caption textAlign="center">{formatTimeInterval(intervalToDuration({ start: initializeDate(data.timeOfDeparture), end: initializeDate(data.timeOfArrival) }))}</Caption>
          <Caption color={theme.colors.text} style={[sharedStyles.fullHeight]} textAlign="right">
            {data.placeOfArrival}
          </Caption>
        </Box>
        <Divider width={1} type="dashed" style={styles.divider} />
        <Box flexDirection="row" alignItems="center" justifyContent="flex-end" marginTop={14}>
          <Heading size="sm">
            <Body color={theme.colors.heading} size="md">
              ₹{" "}
            </Body>
            {formatToIndianLocale(data.price)}
          </Heading>
        </Box>
      </Box>
    </AnimatedPressable>
  );
}
