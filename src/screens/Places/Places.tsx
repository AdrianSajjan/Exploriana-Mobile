import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
export * as FileSystem from "expo-file-system";
import * as LocationServices from "expo-location";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetFlatList, BottomSheetSectionList } from "@gorhom/bottom-sheet";
import MapView, { Callout, MapPressEvent, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Alert, FlatList, Image, ListRenderItem, ScrollView, SectionListData, StyleSheet, ToastAndroid, TouchableOpacity, View, useWindowDimensions } from "react-native";

import { Box } from "@exploriana/components/Box";
import { ServiceCard } from "@exploriana/components/Card";
import { Divider } from "@exploriana/components/Divider";
import { Cafe, Hotel, Mall, Parks, Restro, TouristSpots } from "@exploriana/components/Icons";
import { SearchBar } from "@exploriana/components/Input";
import { PageHeader } from "@exploriana/components/Layout";
import { ShimmerPlaceholder } from "@exploriana/components/Placeholder";
import { Body, Text } from "@exploriana/components/Typography";

import { theme } from "@exploriana/config/theme";
import { sharedStyles } from "@exploriana/styles/shared";
import { PlacesByCategory } from "@exploriana/interface/api";

import { useLocationStore } from "@exploriana/store/location";
import useDebounceState from "@exploriana/hooks/use-debounced-state";
import { useGeocoder, useLocationAutocompleteQuery, useReverseGeocode, useSearchPlacesByCategoryQuery } from "@exploriana/api/here-sdk";
import { useFetchGooglePlaceImageByReference, useGooglePlaceSearch } from "@exploriana/api/places";
import { googleApiKey } from "@exploriana/config/app";

const initialRegion = { latitude: 22.5726, longitude: 88.3639, latitudeDelta: 0.2, longitudeDelta: 0 };

const mapTypeToCategory = {
  all: "Show places near",
  cafes: "Show cafes near",
  parks: "Show parks near",
  hotels: "Show hotels near",
  malls: "Show shopping malls near me",
  restaurants: "Show restaurants near",
  tourism: "Show popular tourist spots near",
};

const services = [
  {
    name: "Hotels",
    value: "hotels",
    Icon: Hotel,
  },
  {
    name: "Restaurants",
    value: "restaurants",
    Icon: Restro,
  },
  {
    name: "Cafes",
    value: "cafes",
    Icon: Cafe,
  },
  {
    name: "Malls",
    value: "malls",
    Icon: Mall,
  },
  {
    name: "Parks",
    value: "parks",
    Icon: Parks,
  },
  {
    name: "Tourisms",
    value: "tourism",
    Icon: TouristSpots,
  },
] as const;

type Category = keyof typeof mapTypeToCategory;

export function PlacesScreen() {
  const searchBar = React.useRef<TextInput | null>(null);
  const bottomSheet = React.useRef<BottomSheet | null>(null);

  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState<Category>("all");
  const [showResults, setShowResults] = React.useState(false);
  const [destination, setDestination] = React.useState<Array<{ key: string; coordinate: { latitude: number; longitude: number }; title: string }>>([]);

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
    if (!location) return [{ key: String(Date.now()), coordinate: { latitude: initialRegion.latitude, longitude: initialRegion.longitude }, title: "Kolkata" }];
    return [{ key: location.id, coordinate: { latitude: location.position.lat, longitude: location.position.lng }, title: location.address.subdistrict }];
  }, [location]);

  const geocoder = useGeocoder();
  const reverseGeocoder = useReverseGeocode();

  const cafes = useSearchPlacesByCategoryQuery({ latitude: region.latitude, longitude: region.longitude, query: "cafe" });
  const hotels = useSearchPlacesByCategoryQuery({ latitude: region.latitude, longitude: region.longitude, query: "hotel" });
  const parks = useSearchPlacesByCategoryQuery({ latitude: region.latitude, longitude: region.longitude, query: "parks" });
  const malls = useSearchPlacesByCategoryQuery({ latitude: region.latitude, longitude: region.longitude, query: "malls" });
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
          { title: "Malls", data: malls.data.slice(0, 8) },
          { title: "Parks", data: parks.data.slice(0, 8) },
          { title: "Tourism", data: tourism.data.slice(0, 8) }
        );
      case "hotels":
        return array.concat({ title: "Hotels", data: hotels.data });
      case "cafes":
        return array.concat({ title: "Cafes", data: cafes.data });
      case "malls":
        return array.concat({ title: "Malls", data: malls.data });
      case "parks":
        return array.concat({ title: "Parks", data: parks.data });
      case "tourism":
        return array.concat({ title: "Tourism", data: tourism.data });
      case "restaurants":
        return array.concat({ title: "Restaurants", data: restaurants.data });
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
          {services.map(({ Icon, name, value }) => (
            <ServiceCard
              key={value}
              caption={name}
              onPress={() => handleTypeChange(value)}
              style={type === value ? styles.activeServices : styles.services}
              color={type === value ? theme.colors.surface : theme.colors.text}
              icon={<Icon height={36} fill={type === value ? theme.colors.surface : theme.colors.text} />}
            />
          ))}
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
    function onClick() {
      setDestination([{ key: String(Date.now()), coordinate: { latitude: item.access[0].lat, longitude: item.access[0].lng }, title: item.title }]);
      bottomSheet.current?.snapToIndex(1);
    }
    return <ListResult item={item} onClick={onClick} />;
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
          <Marker {...props}>
            <Callout tooltip>
              <View style={{ flexDirection: "row", alignSelf: "flex-start", backgroundColor: "#fff", borderRadius: 6, borderWidth: 0.5, padding: 15 }}>
                <Body>{props.title}</Body>
              </View>
            </Callout>
          </Marker>
        ))}
        {destination.map((props) => (
          <Marker {...props}>
            <Callout tooltip>
              <View style={{ backgroundColor: "#fff", borderRadius: 6, borderWidth: 0.5, padding: 15 }}>
                <Body>{props.title}</Body>
              </View>
            </Callout>
          </Marker>
        ))}
        <Callout />
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

function ListResult({ item, onClick }: { onClick?: () => void; item: PlacesByCategory }) {
  const [photos, setPhotos] = React.useState<any[]>([]);

  const places = useGooglePlaceSearch();
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    places.mutate(item.address.label, {
      onSuccess: async (value) => {
        const references = value[0]?.photos ?? [];
        for (const data of references) {
          const reference = data.photo_reference;
          setPhotos((state) => [...state, reference]);
        }
      },
    });
  }, []);

  return (
    <Box>
      <BottomSheetFlatList
        data={photos}
        pagingEnabled
        overScrollMode="never"
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <Image
            source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${item}&key=${googleApiKey}` }}
            style={{ width: width - 40, aspectRatio: 16 / 9, resizeMode: "cover" }}
            borderTopRightRadius={theme.shapes.rounded.lg}
            borderTopLeftRadius={theme.shapes.rounded.lg}
          />
        )}
        horizontal
      />
      <TouchableOpacity activeOpacity={0.6} onPress={onClick}>
        <Box
          backgroundColor={theme.colors.background}
          borderTopRightRadius={Boolean(photos.length) ? 0 : theme.shapes.rounded.lg}
          borderTopLeftRadius={Boolean(photos.length) ? 0 : theme.shapes.rounded.lg}
          borderBottomLeftRadius={theme.shapes.rounded.lg}
          borderBottomRightRadius={theme.shapes.rounded.lg}
          paddingHorizontal={20}
          paddingVertical={16}
        >
          <Body fontWeight="medium" color={theme.colors.secondary}>
            {item.title}
          </Body>
          <Body size="md">
            {[item.address.street, item.address.subdistrict, item.address.district, item.address.city].filter(Boolean).join(", ")} - {item.address.postalCode}
          </Body>
          {item.distance !== undefined && (
            <Box marginTop={6} marginBottom={6}>
              <Body size="md">
                <Body size="md" color={theme.colors.secondary} fontWeight="medium">
                  {item.distance ?? 0} meters
                </Body>
                &nbsp;from your location
              </Body>
              <Body size="md">
                <Body size="md" color={theme.colors.secondary} fontWeight="medium">
                  {(item.distance > 1000 ? (60 / 40000) * item.distance : (60 / 4000) * item.distance).toFixed(2)} minutes
                </Body>
                &nbsp;{item.distance > 1000 ? "by car or bike" : "by walking or cycling"}
              </Body>
            </Box>
          )}
          {Boolean(item.foodTypes?.length) && (
            <Body size="md">
              Specialty:&nbsp;
              <Body fontWeight="medium" color={theme.colors.secondary}>
                {item.foodTypes!.map(({ name }) => name).join(", ")}
              </Body>
            </Body>
          )}
          {Boolean(item.openingHours?.length) && (
            <Box flexDirection="row" alignItems="center">
              <Body size="md">
                Opening Hours:&nbsp;
                <Body fontWeight="medium" color={theme.colors.secondary}>
                  {item.openingHours![0].text}
                </Body>
              </Body>
            </Box>
          )}
        </Box>
      </TouchableOpacity>
    </Box>
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
