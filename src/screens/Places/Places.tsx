import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetSectionList, BottomSheetView } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Alert, ListRenderItem, SectionList, SectionListData, StyleSheet, ToastAndroid, TouchableOpacity, useWindowDimensions } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { useReverseGeocode, useSearchPlacesByCategoryQuery } from "@exploriana/api/here-sdk";
import { Box } from "@exploriana/components/Box";
import { ServiceCard } from "@exploriana/components/Card";
import { Cafe, Parks, Restro, TouristSpots } from "@exploriana/components/Icons";
import { SearchBar } from "@exploriana/components/Input";
import { PageHeader } from "@exploriana/components/Layout";
import { Body, Heading, Text } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config/theme";
import { useLocationStore } from "@exploriana/store/location";
import { sharedStyles } from "@exploriana/styles/shared";
import * as LocationServices from "expo-location";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShimmerPlaceholder } from "@exploriana/components/Placeholder";
import { PlacesByCategory } from "@exploriana/interface/api";

const initialRegion = { latitude: 22.5726, longitude: 88.3639, latitudeDelta: 0.2, longitudeDelta: 0 };

const mapTypeToCategory = {
  all: "Show places near",
  restaurants: "Show restaurants near",
  cafes: "Show cafes near",
  parks: "Show parks near",
  "tourist-spots": "Show popular tourist spots near",
};

type Category = keyof typeof mapTypeToCategory;

export function PlacesScreen() {
  const bottomSheet = React.useRef<BottomSheet | null>(null);

  const [type, setType] = React.useState<Category>("all");

  const dimensions = useWindowDimensions();
  const locationStore = useLocationStore();

  const location = React.useMemo(() => {
    return locationStore.selected ?? locationStore.current;
  }, [locationStore.selected, locationStore.current]);

  const region = React.useMemo(() => {
    if (!location) return initialRegion;
    return { latitude: location.position.lat, longitude: location.position.lng, latitudeDelta: 0.1, longitudeDelta: 0 };
  }, [location]);

  const markers = React.useMemo(() => {
    if (!location) return [{ key: Date.now(), coordinate: { latitude: initialRegion.latitude, longitude: initialRegion.longitude } }];
    return [{ key: location.id, coordinate: { latitude: location.position.lat, longitude: location.position.lng } }];
  }, [location]);

  const reverseGeocoder = useReverseGeocode();

  const cafes = useSearchPlacesByCategoryQuery({ latitude: region.latitude, longitude: region.longitude, query: "cafe" });
  const parks = useSearchPlacesByCategoryQuery({ latitude: region.latitude, longitude: region.longitude, query: "parks" });
  const tourism = useSearchPlacesByCategoryQuery({ latitude: region.latitude, longitude: region.longitude, query: "tourism" });
  const restaurants = useSearchPlacesByCategoryQuery({ latitude: region.latitude, longitude: region.longitude, query: "restaurant" });

  const places = React.useMemo(() => {
    const array: Array<{ title: string; data: PlacesByCategory[] }> = [];
    switch (type) {
      case "all":
        return array.concat(
          { title: "Restaurants", data: restaurants.data.slice(0, 8) },
          { title: "Cafes", data: cafes.data.slice(0, 8) },
          { title: "Parks", data: parks.data.slice(0, 8) },
          { title: "Tourism", data: tourism.data.slice(0, 8) }
        );
      case "restaurants":
        return array.concat({ title: "Restaurants", data: restaurants.data });
      case "cafes":
        return array.concat({ title: "Cafes", data: cafes.data });
      case "parks":
        return array.concat({ title: "Parks", data: parks.data });
      case "tourist-spots":
        return array.concat({ title: "Tourism", data: tourism.data });
    }
  }, [cafes.data, parks.data, tourism.data, restaurants.data, type]);

  React.useEffect(() => {
    if (locationStore.current) return;
    initializeLocationServices();
  }, []);

  const snapPoints = React.useMemo(() => {
    return ["30%", "50%", dimensions.height - 92];
  }, [dimensions]);

  const itemSeparatorComponent = React.useCallback(() => {
    return <Box height={16} />;
  }, []);

  const sectionSeparatorComponent = React.useCallback(() => {
    return <Box height={24} />;
  }, []);

  const renderSectionList = React.useCallback(
    ({ section }: { section: SectionListData<PlacesByCategory, { title: string; data: PlacesByCategory[] }> }) => {
      return (
        <Box>
          <Text size={17} fontWeight="medium" color={theme.colors.heading}>
            {section.title} near&nbsp;
            <Text size={17} fontWeight="bold" color={theme.colors.heading}>
              {[location?.address.district, location?.address.city].filter(Boolean).join(", ")}
            </Text>
          </Text>
        </Box>
      );
    },
    [location]
  );

  const renderItem: ListRenderItem<PlacesByCategory> = React.useCallback(({ item }) => {
    return (
      <Box>
        <Body fontWeight="medium" color={theme.colors.secondary}>
          {item.title}
        </Body>
        <Body size="md">
          {[item.address.street, item.address.subdistrict, item.address.district, item.address.city].filter(Boolean).join(", ")} - {item.address.postalCode}
        </Body>
        {Boolean(item.foodTypes?.length) && (
          <Body size="md">
            Specialty: <Body fontWeight="medium">{item.foodTypes!.map(({ name }) => name).join(", ")}</Body>
          </Body>
        )}
        {Boolean(item.openingHours?.length) && (
          <Box flexDirection="row" alignItems="center">
            <Body size="md">
              Opening Hours: <Body fontWeight="medium">{item.openingHours![0].text}</Body>
            </Body>
          </Box>
        )}
      </Box>
    );
  }, []);

  function handleTypeChange(value: Category) {
    if (type === value) return setType("all");
    setType(value);
  }

  async function initializeLocationServices() {
    const { granted } = await LocationServices.requestForegroundPermissionsAsync();
    let coordinates = initialRegion as Pick<LocationServices.LocationObjectCoords, "latitude" | "longitude">;
    if (granted) {
      const { coords } = await LocationServices.getCurrentPositionAsync();
      coordinates = coords;
    }
    try {
      const address = await reverseGeocoder.fetchAsync({ ...coordinates });
      locationStore.updateCurrent(address);
    } catch (error) {
      console.log(error.response?.data?.message ?? error.message);
    }
  }

  async function fetchUserLocation() {
    const { granted } = await LocationServices.requestForegroundPermissionsAsync();
    if (!granted) return Alert.alert("Permission not set", "Please allow Exploriana to access your location from settings");
    const { coords } = await LocationServices.getCurrentPositionAsync();
    try {
      const address = await reverseGeocoder.fetchAsync({ ...coords });
      locationStore.updateCurrent(address);
      ToastAndroid.show(address.title, ToastAndroid.SHORT);
    } catch (error) {
      console.log(error.response?.data?.message ?? error.message);
    }
  }

  function keyExtractor(item: PlacesByCategory) {
    return item.id;
  }

  return (
    <SafeAreaView style={[sharedStyles.fullHeight]}>
      <StatusBar backgroundColor={theme.colors.surface} />
      <Box backgroundColor={theme.colors.surface} paddingHorizontal={16} paddingTop={12} paddingBottom={16} zIndex={10} elevation={2}>
        <PageHeader title="Search Places" />
        <Box flexDirection="row" alignItems="center" marginTop={12}>
          <SearchBar placeholder="Search for places..." style={styles.searchBar} />
          <Box height={56} width={56} backgroundColor={theme.colors.background} borderTopRightRadius={theme.shapes.rounded.lg} borderBottomRightRadius={theme.shapes.rounded.lg}>
            <TouchableOpacity style={styles.userLocation} activeOpacity={0.6} onPress={fetchUserLocation}>
              <Ionicons name="location" color={theme.colors.secondary} size={18} />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
      <MapView style={styles.map} mapType="standard" provider={PROVIDER_GOOGLE} region={region}>
        {markers.map((props) => (
          <Marker {...props} />
        ))}
      </MapView>
      <BottomSheet ref={bottomSheet} snapPoints={snapPoints} index={0} style={styles.container} handleIndicatorStyle={styles.indicator}>
        <BottomSheetView>
          <Box flexWrap="wrap" flexDirection="row" paddingHorizontal={12} marginBottom={36}>
            <ServiceCard caption="Cafes" icon={<Cafe height={36} />} style={styles.services} onPress={() => handleTypeChange("cafes")} />
            <ServiceCard caption="Parks" icon={<Parks height={36} />} style={styles.services} onPress={() => handleTypeChange("parks")} />
            <ServiceCard caption="Restaurants" icon={<Restro height={36} />} style={styles.services} onPress={() => handleTypeChange("restaurants")} />
            <ServiceCard caption="Tourist Spots" icon={<TouristSpots height={36} />} style={styles.services} onPress={() => handleTypeChange("tourist-spots")} />
          </Box>
        </BottomSheetView>
        <BottomSheetSectionList
          sections={places}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          renderSectionHeader={renderSectionList}
          ItemSeparatorComponent={itemSeparatorComponent}
          SectionSeparatorComponent={sectionSeparatorComponent}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        />
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
