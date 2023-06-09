import { Box } from "@exploriana/components/Box";
import { IconButton } from "@exploriana/components/Button";
import { Divider } from "@exploriana/components/Divider";
import { SearchBar } from "@exploriana/components/Input";
import { ShimmerPlaceholder } from "@exploriana/components/Placeholder";
import { Body } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config";
import { useSQLiteDatabase } from "@exploriana/hooks/use-database";
import { Location } from "@exploriana/interface/core";
import { createFactory } from "@exploriana/lib/core";
import { sharedStyles } from "@exploriana/styles/shared";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as SQLite from "expo-sqlite";
import * as React from "react";
import { ListRenderItem, Modal, ModalProps, StyleSheet, View, TouchableOpacity, FlatList, KeyboardAvoidingView } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

interface SelectCityModalProps extends ModalProps {
  onSelect?: (value: string) => void;
}

const HEIGHT = 525;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: theme.colors.backdrop,
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-end",
  },
  sheet: {
    height: HEIGHT,
    backgroundColor: theme.colors.surface,
    borderTopRightRadius: theme.shapes.rounded.lg,
    borderTopLeftRadius: theme.shapes.rounded.lg,
  },
  list: {
    paddingTop: 12,
  },
  shimmer: {
    marginTop: 16,
  },
});

export function SelectCityModal({ visible, onSelect, onRequestClose, ...props }: SelectCityModalProps) {
  const translateY = useSharedValue(HEIGHT);

  const [query, setQuery] = React.useState("");

  const [database] = useSQLiteDatabase();

  React.useEffect(() => {
    if (visible) translateY.value = withDelay(150, withTiming(0, { duration: 300 }));
    else translateY.value = withDelay(150, withTiming(HEIGHT, { duration: 0 }));
  }, [visible]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const cities = useQuery(
    ["cities", { query }],
    async () => {
      const sql = await createFactory(Promise<SQLite.SQLTransaction>, (resolve) => database!.transaction(resolve));
      const results = await createFactory(Promise<Location[]>, (resolve, reject) =>
        sql.executeSql(
          `SELECT * FROM cities WHERE cities.city LIKE ?;`,
          ["%" + query + "%"],
          (_, result) => {
            resolve(result.rows._array);
          },
          (_, error) => {
            reject(error.message);
            return false;
          }
        )
      );
      return results;
    },
    {
      initialData: [],
      enabled: Boolean(database),
      retry: false,
    }
  );

  const renderItem: ListRenderItem<Location> = React.useCallback(({ item }) => {
    const handleSelect = () => onSelect?.([item.city, item.state].join(", "));
    return (
      <TouchableOpacity style={[sharedStyles.ph, { paddingVertical: 14 }]} onPress={handleSelect}>
        <Body fontWeight="medium" color={theme.colors.secondary}>
          {item.city}
          <Body size="md">, {[item.district, item.state].join(", ")}</Body>
        </Body>
      </TouchableOpacity>
    );
  }, []);

  const renderEmptyList = React.useCallback(() => {
    return (
      <Box paddingHorizontal={20} paddingTop={16}>
        <ShimmerPlaceholder height={36} width="100%" borderRadius={theme.shapes.rounded.md} />
        <ShimmerPlaceholder height={36} width="100%" borderRadius={theme.shapes.rounded.md} style={styles.shimmer} />
        <ShimmerPlaceholder height={36} width="100%" borderRadius={theme.shapes.rounded.md} style={styles.shimmer} />
      </Box>
    );
  }, []);

  function keyExtractor(item: Location) {
    return [item.city, item.district, item.state].join("-");
  }

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={onRequestClose} {...props}>
      <View style={styles.backdrop} />
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Animated.View style={[styles.sheet, rStyle]}>
          <Box alignItems="center" justifyContent="center" paddingTop={12} paddingBottom={8}>
            <Box height={2} width={36} borderRadius={36} backgroundColor={theme.colors.divider} />
          </Box>
          <Box alignItems="center" flexDirection="row" paddingRight={20}>
            <SearchBar placeholder="Search for cities..." value={query} onChangeText={setQuery} style={sharedStyles.fullHeight} />
            <Box marginLeft={24}>
              <IconButton onPress={onRequestClose}>
                <Ionicons name="close" size={20} />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <FlatList
            data={cities.data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyList}
            initialNumToRender={10}
            maxToRenderPerBatch={20}
            contentContainerStyle={styles.list}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
