import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Alert, ListRenderItem, SectionListData, StyleSheet, ToastAndroid, TouchableOpacity, useWindowDimensions } from "react-native";
import MapView, { MapPressEvent, Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { useGeocoder, useLocationAutocompleteQuery, useReverseGeocode, useSearchPlacesByCategoryQuery } from "@exploriana/api/here-sdk";
import { Box } from "@exploriana/components/Box";
import { ServiceCard } from "@exploriana/components/Card";
import { Divider } from "@exploriana/components/Divider";
import { Cafe, Hotel, Parks, Restro, TouristSpots } from "@exploriana/components/Icons";
import { SearchBar } from "@exploriana/components/Input";
import { PageHeader } from "@exploriana/components/Layout";
import { ShimmerPlaceholder } from "@exploriana/components/Placeholder";
import { Body, Text } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config/theme";
import useDebounceState from "@exploriana/hooks/use-debounced-state";
import { PlacesByCategory } from "@exploriana/interface/api";
import { useLocationStore } from "@exploriana/store/location";
import { sharedStyles } from "@exploriana/styles/shared";
import * as LocationServices from "expo-location";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const initialRegion = { latitude: 22.5726, longitude: 88.3639, latitudeDelta: 0.2, longitudeDelta: 0 };

const mapTypeToCategory = {
  all: "Show places near",
  restaurants: "Show restaurants near",
  cafes: "Show cafes near",
  parks: "Show parks near",
  hotels: "Show hotels near",
  "tourist-spots": "Show popular tourist spots near",
};

type Category = keyof typeof mapTypeToCategory;

export function PlacesScreen() {
  const searchBar = React.useRef<TextInput | null>(null);
  const bottomSheet = React.useRef<BottomSheet | null>(null);

  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState<Category>("all");
  const [showResults, setShowResults] = React.useState(false);

  const query = useDebounceState(search, 300);

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
    if (!location) return [{ key: String(Date.now()), coordinate: { latitude: initialRegion.latitude, longitude: initialRegion.longitude } }];
    return [{ key: location.id, coordinate: { latitude: location.position.lat, longitude: location.position.lng } }];
  }, [location]);

  const geocoder = useGeocoder();
  const reverseGeocoder = useReverseGeocode();

  const cafes = useSearchPlacesByCategoryQuery({ latitude: region.latitude, longitude: region.longitude, query: "cafe" });
  const hotels = useSearchPlacesByCategoryQuery({ latitude: region.latitude, longitude: region.longitude, query: "hotel" });
  const parks = useSearchPlacesByCategoryQuery({ latitude: region.latitude, longitude: region.longitude, query: "parks" });
  const tourism = useSearchPlacesByCategoryQuery({ latitude: region.latitude, longitude: region.longitude, query: "tourism" });
  const restaurants = useSearchPlacesByCategoryQuery({ latitude: region.latitude, longitude: region.longitude, query: "restaurant" });

  const autocomplete = useLocationAutocompleteQuery(query, 7);

  const places = React.useMemo(() => {
    const array: Array<{ title: string; data: PlacesByCategory[] }> = [];
    switch (type) {
      case "all":
        return array.concat(
          { title: "Restaurants", data: restaurants.data.slice(0, 8) },
          { title: "Hotels", data: hotels.data.slice(0, 8) },
          { title: "Cafes", data: cafes.data.slice(0, 8) },
          { title: "Parks", data: parks.data.slice(0, 8) },
          { title: "Tourism", data: tourism.data.slice(0, 8) }
        );
      case "restaurants":
        return array.concat({ title: "Restaurants", data: restaurants.data });
      case "hotels":
        return array.concat({ title: "Hotels", data: hotels.data });
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

  const renderListHeaderComponent = React.useCallback(() => {
    return (
      <Box marginHorizontal={-8} marginBottom={28}>
        <Box flexWrap="wrap" flexDirection="row">
          <ServiceCard
            caption="Hotels"
            icon={<Hotel height={36} fill={type === "hotels" ? theme.colors.surface : theme.colors.text} />}
            color={type === "hotels" ? theme.colors.surface : theme.colors.text}
            style={type === "hotels" ? styles.activeServices : styles.services}
            onPress={() => handleTypeChange("hotels")}
          />
          <ServiceCard
            caption="Cafes"
            icon={<Cafe height={36} fill={type === "cafes" ? theme.colors.surface : theme.colors.text} />}
            color={type === "cafes" ? theme.colors.surface : theme.colors.text}
            style={type === "cafes" ? styles.activeServices : styles.services}
            onPress={() => handleTypeChange("cafes")}
          />
          <ServiceCard
            caption="Parks"
            icon={<Parks height={36} fill={type === "parks" ? theme.colors.surface : theme.colors.text} />}
            color={type === "parks" ? theme.colors.surface : theme.colors.text}
            style={type === "parks" ? styles.activeServices : styles.services}
            onPress={() => handleTypeChange("parks")}
          />
        </Box>
        <Box flexWrap="wrap" flexDirection="row">
          <ServiceCard
            caption="Restaurants"
            icon={<Restro height={36} fill={type === "restaurants" ? theme.colors.surface : theme.colors.text} />}
            color={type === "restaurants" ? theme.colors.surface : theme.colors.text}
            style={type === "restaurants" ? styles.activeServices : styles.services}
            onPress={() => handleTypeChange("restaurants")}
          />
          <ServiceCard
            caption="Tourist Spots"
            icon={<TouristSpots height={36} fill={type === "tourist-spots" ? theme.colors.surface : theme.colors.text} />}
            color={type === "tourist-spots" ? theme.colors.surface : theme.colors.text}
            style={type === "tourist-spots" ? styles.activeServices : styles.services}
            onPress={() => handleTypeChange("tourist-spots")}
          />
        </Box>
      </Box>
    );
  }, [type]);

  const itemSeparatorComponent = React.useCallback(() => {
    return <Box height={16} />;
  }, []);

  const sectionSeparatorComponent = React.useCallback(() => {
    return <Box height={24} />;
  }, []);

  const renderSectionList = React.useCallback(
    ({ section }: { section: SectionListData<PlacesByCategory, { title: string; data: PlacesByCategory[] }> }) => {
      return (
        <Box marginBottom={-16} paddingTop={6} paddingBottom={10} backgroundColor={theme.colors.surface}>
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
      <Box backgroundColor={theme.colors.background} borderRadius={theme.shapes.rounded.lg} paddingHorizontal={20} paddingVertical={16}>
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

  async function handleSelectSearchResult(address: string) {
    setShowResults(false);
    searchBar.current?.blur();
    const result = await geocoder.fetchAsync(address);
    locationStore.updateSelected(result);
  }

  async function handleMapPress(event: MapPressEvent) {
    const coordinate = event.nativeEvent.coordinate;
    try {
      const address = await reverseGeocoder.fetchAsync({ ...coordinate });
      locationStore.updateSelected(address);
      ToastAndroid.show(address.title, ToastAndroid.SHORT);
    } catch (error) {
      const message = error.response?.data?.message ?? error.message ?? "Unable to fetch location due to some error";
      Alert.alert("Unable to fetch location", message);
    }
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
      const message = error.response?.data?.message ?? error.message ?? "Unable to fetch location due to some error";
      Alert.alert("Unable to fetch location", message);
    }
  }

  function keyExtractor(item: PlacesByCategory) {
    return item.id;
  }

  return (
    <SafeAreaView style={[sharedStyles.fullHeight]}>
      <StatusBar backgroundColor={theme.colors.surface} />
      <Box backgroundColor={theme.colors.surface} position="relative" paddingHorizontal={16} paddingTop={12} paddingBottom={16} zIndex={10} elevation={2}>
        <PageHeader title="Search Places" />
        <Box flexDirection="row" alignItems="center" marginTop={12}>
          <SearchBar ref={searchBar} placeholder="Search for places..." style={styles.searchBar} value={search} onChangeText={setSearch} onFocus={() => setShowResults(true)} />
          <Box height={56} width={56} backgroundColor={theme.colors.background} borderTopRightRadius={theme.shapes.rounded.lg} borderBottomRightRadius={theme.shapes.rounded.lg}>
            <TouchableOpacity style={styles.userLocation} activeOpacity={0.6} onPress={fetchUserLocation}>
              <Ionicons name="location" color={theme.colors.secondary} size={18} />
            </TouchableOpacity>
          </Box>
        </Box>
        {query.length >= 3 && showResults && (
          <Box position="absolute" width={dimensions.width} left={0} top={126} minHeight={200} elevation={5} zIndex={5} backgroundColor={theme.colors.surface}>
            {autocomplete.isLoading || autocomplete.isFetching ? (
              <Box paddingHorizontal={16}>
                {[...Array(3).keys()].map((key) => (
                  <ShimmerPlaceholder width="100%" height={32} key={key} style={{ marginTop: 16 }} borderRadius={theme.shapes.rounded.sm} />
                ))}
              </Box>
            ) : autocomplete.data.length ? (
              autocomplete.data.map((data) => (
                <Box>
                  <TouchableOpacity key={data.id} style={styles.searchResult} onPress={() => handleSelectSearchResult(data.address.label)}>
                    <Body style={styles.searchResultText}>{data.address.label}</Body>
                  </TouchableOpacity>
                  <Divider />
                </Box>
              ))
            ) : (
              <Box height="100%" alignItems="center" justifyContent="center" paddingHorizontal={16}>
                <Body color={theme.colors.error}>No results found. Please try a different keyword.</Body>
              </Box>
            )}
          </Box>
        )}
      </Box>
      <MapView style={styles.map} mapType="standard" provider={PROVIDER_GOOGLE} region={region} onPress={handleMapPress}>
        {markers.map((props) => (
          <Marker {...props} />
        ))}
      </MapView>
      <BottomSheet ref={bottomSheet} snapPoints={snapPoints} index={0} style={styles.container} handleIndicatorStyle={styles.indicator}>
        <BottomSheetSectionList
          sections={places}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          renderSectionHeader={renderSectionList}
          ListHeaderComponent={renderListHeaderComponent}
          ItemSeparatorComponent={itemSeparatorComponent}
          SectionSeparatorComponent={sectionSeparatorComponent}
          contentContainerStyle={styles.content}
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
  content: {
    paddingHorizontal: 20,
  },
  searchResult: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  searchResultText: {
    textTransform: "capitalize",
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
    minWidth: 90,
    backgroundColor: theme.colors.background,
  },
  activeServices: {
    minWidth: 90,
    backgroundColor: theme.colors.secondary,
  },
});
