import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, TouchableOpacity, useWindowDimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { theme } from "@exploriana/config";
import { Box } from "@exploriana/components/Box";
import { SearchBar } from "@exploriana/components/Input";
import { sharedStyles } from "@exploriana/styles/shared";
import { PageHeader } from "@exploriana/components/Layout";
import { SafeAreaView } from "react-native-safe-area-context";
import { ServiceCard } from "@exploriana/components/Card";
import { Restro } from "@exploriana/components/Icons";

const initialRegion = { latitude: 22.5726, longitude: 88.3639, latitudeDelta: 0.2, longitudeDelta: 0 };

export function PlacesScreen() {
  const bottomSheet = React.useRef<BottomSheet | null>(null);

  const dimensions = useWindowDimensions();

  const snapPoints = React.useMemo(() => {
    return ["30%", "50%", dimensions.height - 92];
  }, [dimensions]);

  return (
    <SafeAreaView style={[sharedStyles.fullHeight]}>
      <StatusBar backgroundColor={theme.colors.surface} />
      <Box backgroundColor={theme.colors.surface} paddingHorizontal={16} paddingTop={12} paddingBottom={16} zIndex={10} elevation={2}>
        <PageHeader title="Search Places" />
        <Box flexDirection="row" alignItems="center" marginTop={12}>
          <SearchBar placeholder="Search for places..." style={styles.searchBar} />
          <Box height={56} width={56} backgroundColor={theme.colors.background} borderTopRightRadius={theme.shapes.rounded.lg} borderBottomRightRadius={theme.shapes.rounded.lg}>
            <TouchableOpacity style={styles.userLocation} activeOpacity={0.6}>
              <Ionicons name="location" color={theme.colors.secondary} size={18} />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
      <MapView style={styles.map} mapType="standard" provider={PROVIDER_GOOGLE} initialRegion={initialRegion} />
      <BottomSheet ref={bottomSheet} snapPoints={snapPoints} index={0} style={styles.container} handleIndicatorStyle={styles.indicator}>
        <BottomSheetView>
          <Box flexWrap="wrap" flexDirection="row" paddingHorizontal={12}>
            <ServiceCard caption="Restros" icon={<Restro height={36} />} style={styles.services} />
            <ServiceCard caption="Cafes" icon={<Restro height={36} />} style={styles.services} />
            <ServiceCard caption="Parks" icon={<Restro height={36} />} style={styles.services} />
            <ServiceCard caption="Tourist Spots" icon={<Restro height={36} />} style={styles.services} />
          </Box>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
  },
  container: {
    zIndex: 5,
    elevation: 2,
  },
  indicator: {
    width: 48,
    backgroundColor: theme.colors.tint,
  },
  searchBar: {
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: theme.colors.background,
  },
  userLocation: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  services: {
    minWidth: 120,
    backgroundColor: theme.colors.background,
  },
});
