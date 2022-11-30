import { theme } from "@exploriana/config";
import { CarouselProps, ListImageItem } from "@exploriana/interface";
import { useCallback } from "react";
import { FlatList, Image, ListRenderItem, StyleSheet, useWindowDimensions } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { Box } from "@exploriana/components/Box";
import { Dots } from "./Dots";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<ListImageItem>);

export function OnboardCarousel({ images }: CarouselProps) {
  const { width } = useWindowDimensions();

  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(({ contentOffset: { x } }) => {
    scrollX.value = x;
  });

  const renderItem: ListRenderItem<ListImageItem> = useCallback(
    ({ item }) => {
      const source = { uri: item.uri, width: width - 64 };
      return (
        <Box width={width} alignItems="center">
          <Box width={width - 64} backgroundColor="white" borderRadius={theme.shapes.rounded.lg} elevation={5}>
            <Image source={source} style={styles.image} />
          </Box>
        </Box>
      );
    },
    [images, width]
  );

  return (
    <Box>
      <AnimatedFlatList
        pagingEnabled
        overScrollMode="never"
        onScroll={scrollHandler}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        horizontal
        data={images}
        renderItem={renderItem}
      />
      <Box flexDirection="row" alignItems="center" justifyContent="center" marginTop={12}>
        {images.map((_, index) => (
          <Dots key={index} index={index} length={images.length} scrollX={scrollX} />
        ))}
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: theme.shapes.rounded.lg,
    aspectRatio: 1,
  },
  content: {
    flexGrow: 0,
    overflow: "visible",
    paddingVertical: 8,
  },
});
