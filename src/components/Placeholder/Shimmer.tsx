import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { LayoutChangeEvent, StyleSheet, View, ViewProps, useWindowDimensions } from "react-native";
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

interface ShimmerPlaceholderProps extends ViewProps {
  width: number | string;
  height: number | string;
  borderRadius?: number;
}

const styles = StyleSheet.create({
  shimmer: {
    overflow: "hidden",
    backgroundColor: "#EEEEEE",
  },
  full: {
    flex: 1,
  },
});

const START = -1;
const END = 1;

export function ShimmerPlaceholder({ width, height, borderRadius, style, ...props }: ShimmerPlaceholderProps) {
  const [positionX, setPositionX] = useState<number | null>(null);

  const offset = useSharedValue(START);
  const dimensions = useWindowDimensions();

  const start = { x: 0, y: 0 };
  const end = { x: 1, y: 0 };
  const locations = [0.2, 0.5, 0.7];
  const colors = ["#EEEEEE", "#DDDDDD", "#EEEEEE"];

  useEffect(() => {
    offset.value = withRepeat(withTiming(END, { duration: 500, easing: Easing.linear }), -1, true);
  }, []);

  function onLayout(event: LayoutChangeEvent) {
    event.target.measure((_x, _y, _width, _height, pageX, _pageY) => {
      setPositionX(pageX);
    });
  }

  const rStyle = useAnimatedStyle(() => {
    const linear = interpolate(offset.value, [START, END], [-dimensions.width, dimensions.width]);
    return {
      transform: [{ translateX: linear }],
    };
  });

  return (
    <View style={[styles.shimmer, style, { width, height, borderRadius }]} onLayout={onLayout}>
      {positionX !== null && (
        <Animated.View style={[styles.full, rStyle, { left: -positionX }]}>
          <LinearGradient style={[styles.full, { width: dimensions.width }]} start={start} end={end} locations={locations} colors={colors} />
        </Animated.View>
      )}
    </View>
  );
}
