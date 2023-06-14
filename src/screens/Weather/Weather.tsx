import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import * as LocationServices from "expo-location";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Alert, Image, StyleSheet, ToastAndroid, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import MapView, { Callout, MapPressEvent, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@exploriana/components/Box";
import { Divider } from "@exploriana/components/Divider";
import { SearchBar } from "@exploriana/components/Input";
import { PageHeader } from "@exploriana/components/Layout";
import { ShimmerPlaceholder } from "@exploriana/components/Placeholder";
import { Body } from "@exploriana/components/Typography";

import { theme } from "@exploriana/config/theme";
import { sharedStyles } from "@exploriana/styles/shared";

import { useGeocoder, useLocationAutocompleteQuery, useReverseGeocode } from "@exploriana/api/here-sdk";
import { useFetchWeatherForecast } from "@exploriana/api/weather";
import useDebounceState from "@exploriana/hooks/use-debounced-state";
import { useWeatherStore } from "@exploriana/store/weather";

const initialRegion = { latitude: 22.5726, longitude: 88.3639, latitudeDelta: 0.2, longitudeDelta: 0 };

export function WeatherScreen() {
  const searchBar = React.useRef<TextInput | null>(null);
  const bottomSheet = React.useRef<BottomSheet | null>(null);

  const [search, setSearch] = React.useState("");
  const [showResults, setShowResults] = React.useState(false);

  const query = useDebounceState(search, 300);

  const dimensions = useWindowDimensions();
  const weatherStore = useWeatherStore();

  const location = weatherStore.selected;

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

  const autocomplete = useLocationAutocompleteQuery(query, 7);
  const weather = useFetchWeatherForecast(location?.address.city ?? "");

  React.useEffect(() => {
    if (weatherStore.selected) return;
    initializeLocationServices();
  }, []);

  const snapPoints = React.useMemo(() => {
    return ["30%", "50%", dimensions.height - 92];
  }, [dimensions]);

  async function handleSelectSearchResult(address: string) {
    setShowResults(false);
    searchBar.current?.blur();
    const result = await geocoder.fetchAsync(address);
    weatherStore.update(result);
  }

  async function handleMapPress(event: MapPressEvent) {
    const coordinate = event.nativeEvent.coordinate;
    try {
      const address = await reverseGeocoder.fetchAsync({ ...coordinate });
      weatherStore.update(address);
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
      weatherStore.update(address);
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
      weatherStore.update(address);
      ToastAndroid.show(address.title, ToastAndroid.SHORT);
    } catch (error) {
      const message = error.response?.data?.message ?? error.message ?? "Unable to fetch location due to some error";
      Alert.alert("Unable to fetch location", message);
    }
  }

  return (
    <SafeAreaView style={[sharedStyles.fullHeight]}>
      <StatusBar backgroundColor={theme.colors.surface} />
      <Box backgroundColor={theme.colors.surface} position="relative" paddingHorizontal={16} paddingTop={12} paddingBottom={16} zIndex={10} elevation={2}>
        <PageHeader title="Weather Report" />
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
      </MapView>
      <BottomSheet ref={bottomSheet} snapPoints={snapPoints} index={0} style={styles.container} handleIndicatorStyle={styles.indicator}>
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {weather.data && (
            <Box paddingHorizontal={24}>
              <Box marginTop={12}>
                <Body textAlign="center">
                  Showing weather report for&nbsp;
                  <Body fontWeight="medium" color={theme.colors.secondary}>
                    {location?.address.district}
                  </Body>
                </Body>
              </Box>
              <Box marginTop={20}>
                <Box flexDirection="row" alignItems="center" justifyContent="center">
                  <Image source={{ uri: "https:" + weather.data?.current.condition.icon, height: 56, width: 56 }} />
                  <Body style={{ marginLeft: 4 }}>Today</Body>
                </Box>
                <Box alignItems="center" flexDirection="row" marginTop={8}>
                  <Box flex={1}>
                    <Body fontWeight="medium" color={theme.colors.secondary}>
                      {weather.data?.current.temp_c}&deg; Celsius
                    </Body>
                    <Body>
                      Feels Like:&nbsp;
                      <Body fontWeight="medium" color={theme.colors.secondary}>
                        {weather.data?.current.feelslike_c}&deg; Celsius
                      </Body>
                    </Body>
                  </Box>
                  <Box alignItems="center" flexDirection="row">
                    <Box>
                      <Body textAlign="right">Condition</Body>
                      <Body textAlign="right" fontWeight="medium" color={theme.colors.secondary}>
                        {weather.data?.current.condition.text}
                      </Body>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {weather.data?.forecast.forecastday.map((forecast, index) => (
                <Box marginTop={20} key={forecast.date + index}>
                  <Box flexDirection="row" alignItems="center" justifyContent="center">
                    <Image source={{ uri: "https:" + forecast.day.condition.icon, height: 56, width: 56 }} />
                    <Body style={{ marginLeft: 4 }}>{forecast.date}</Body>
                  </Box>
                  <Box alignItems="center" flexDirection="row" marginTop={8}>
                    <Box flex={1}>
                      <Body>
                        Min Temp:&nbsp;
                        <Body fontWeight="medium" color={theme.colors.secondary}>
                          {forecast.day.mintemp_c}&deg; Celsius
                        </Body>
                      </Body>
                      <Body>
                        Max Temp:&nbsp;
                        <Body fontWeight="medium" color={theme.colors.secondary}>
                          {forecast.day.maxtemp_c}&deg; Celsius
                        </Body>
                      </Body>
                    </Box>
                    <Box alignItems="center" flexDirection="row">
                      <Box>
                        <Body textAlign="right">Condition</Body>
                        <Body textAlign="right" fontWeight="medium" color={theme.colors.secondary}>
                          {forecast.day.condition.text}
                        </Body>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </BottomSheetScrollView>
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
