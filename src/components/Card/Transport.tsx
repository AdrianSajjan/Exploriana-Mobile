import { Box } from "@exploriana/components/Box";
import { Connector, Divider } from "@exploriana/components/Divider";
import { Body, Caption, Heading } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config";
import { formatToIndianCurrency } from "@exploriana/lib/format";
import { sharedStyles } from "@exploriana/styles/shared";
import { Image, ImageSourcePropType, Pressable, PressableProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface TransportCardProps extends PressableProps {
  name?: string;
  icon?: React.ReactNode;
  timeOfArrival?: string;
  placeOfArrival?: string;
  timeOfDeparture?: string;
  placeOfDeparture?: string;
  price?: string | number;
  cover?: ImageSourcePropType;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TransportCard({ cover, icon, name, placeOfArrival, placeOfDeparture, price, timeOfArrival, timeOfDeparture, style, ...props }: TransportCardProps) {
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
          <Image source={cover} style={{ height: 32, width: 32, resizeMode: "contain" }} />
          <Body color={theme.colors.secondary} size="md" fontWeight="medium" style={{ marginLeft: 8 }}>
            {name}
          </Body>
        </Box>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={16}>
          <Body fontWeight="bold" color={theme.colors.secondary}>
            {timeOfDeparture}
          </Body>
          <Connector icon={icon} />
          <Body fontWeight="bold" color={theme.colors.secondary}>
            {timeOfArrival}
          </Body>
        </Box>
        <Box flexDirection="row" alignItems="center" marginTop={4}>
          <Caption fontWeight="medium" color={theme.colors.text} style={[sharedStyles.fullHeight]} textAlign="left">
            {placeOfDeparture}
          </Caption>
          <Caption textAlign="center">7h 50m</Caption>
          <Caption fontWeight="medium" color={theme.colors.text} style={[sharedStyles.fullHeight]} textAlign="right">
            {placeOfArrival}
          </Caption>
        </Box>
        <Divider width={1} type="dashed" style={{ marginTop: 20 }} />
        <Box flexDirection="row" alignItems="center" justifyContent="flex-end" marginTop={12}>
          <Heading size="sm">{formatToIndianCurrency(price ?? "0")}</Heading>
        </Box>
      </Box>
    </AnimatedPressable>
  );
}
