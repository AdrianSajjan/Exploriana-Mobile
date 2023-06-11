import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { FlatList, ListRenderItem, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@exploriana/components/Box";
import { TransportCard } from "@exploriana/components/Card";
import { Connector } from "@exploriana/components/Divider";
import { Flight } from "@exploriana/components/Icons";
import { PageHeader } from "@exploriana/components/Layout";
import { Body, Heading } from "@exploriana/components/Typography";
import { Transport } from "@exploriana/interface/core";

import { useFetchAirportLocationFromAddressQuery, useFetchLocationFromAddressQuery } from "@exploriana/api/location";
import { useFetchFlightsByRouteQuery } from "@exploriana/api/flights";
import { Navigate } from "@exploriana/components/Navigation";
import { ShimmerPlaceholder } from "@exploriana/components/Placeholder";
import { theme } from "@exploriana/config/theme";
import { AppStackParamList } from "@exploriana/interface/navigation";
import { initializeDate } from "@exploriana/lib/core";
import { useScheduleStore } from "@exploriana/store/schedule";
import { useTransportStore } from "@exploriana/store/transport";
import { sharedStyles } from "@exploriana/styles/shared";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format } from "date-fns";

type NavigationProps = NativeStackNavigationProp<AppStackParamList, "Book-Flights">;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  shimmer: {
    marginTop: 20,
  },
});

const FlightIcon = <Flight height={24} width={24} fill={theme.colors.text} />;

export function BookFlightScreen() {
  const schedule = useScheduleStore();
  const transport = useTransportStore();
  const navigation = useNavigation<NavigationProps>();

  const locationOfArrival = useFetchAirportLocationFromAddressQuery(schedule.selected?.placeOfArrival ?? "");
  const locationOfDeparture = useFetchAirportLocationFromAddressQuery(schedule.selected?.placeOfDeparture ?? "");

  const flights = useFetchFlightsByRouteQuery(locationOfDeparture.data.city, locationOfArrival.data.city);

  function onSelect(data: Transport) {
    return () => {
      transport.update(data);
      navigation.navigate("Flight-Checkout");
    };
  }

  function keyExtractor(item: Transport) {
    return item.id;
  }

  const renderItem: ListRenderItem<Transport> = React.useCallback(
    ({ item }) => <TransportCard onPress={onSelect(item)} data={item} cover={require("assets/images/Flight.png")} icon={FlightIcon} />,
    []
  );

  const renderItemSeparator = React.useCallback(() => {
    return <Box height={20} />;
  }, []);

  const renderEmptyList = React.useCallback(() => {
    if (flights.isLoading || flights.isFetching)
      return (
        <Box>
          <ShimmerPlaceholder height={150} width="100%" borderRadius={theme.shapes.rounded.lg} />
          <ShimmerPlaceholder height={150} width="100%" borderRadius={theme.shapes.rounded.lg} style={styles.shimmer} />
          <ShimmerPlaceholder height={150} width="100%" borderRadius={theme.shapes.rounded.lg} style={styles.shimmer} />
        </Box>
      );

    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <Body color={theme.colors.error} size="md" lineHeight={24} textAlign="center">
          No flights found on {format(initializeDate(schedule.selected?.dateOfDeparture), "do MMMM")} for {locationOfDeparture.data.city} - {locationOfArrival.data.city} route. Please select a
          different date or route.
        </Body>
      </Box>
    );
  }, [schedule.selected, locationOfDeparture, locationOfArrival, flights.isLoading, flights.isFetching]);

  if (!schedule.selected) return <Navigate to="Book-Flights" />;

  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.secondary} style="light" />
      <Box backgroundColor={theme.colors.secondary} paddingTop={12} paddingHorizontal={20} paddingBottom={16}>
        <PageHeader title="Book Flights" color={theme.colors.surface} />
        <Box marginTop={20}>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={4}>
            <Heading size="sm" fontWeight="medium" color={theme.colors.surface}>
              {locationOfDeparture.data.airport?.iata}
            </Heading>
            <Connector icon={<Flight height={28} width={28} fill={theme.colors.text} />} />
            <Heading size="sm" textAlign="right" fontWeight="medium" color={theme.colors.surface}>
              {locationOfArrival.data.airport?.iata}
            </Heading>
          </Box>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={4}>
            <Body size="sm" color={theme.colors.text}>
              {locationOfDeparture.data.city}, {locationOfDeparture.data.state.code}
            </Body>
            <Body size="sm" color={theme.colors.text}>
              {format(initializeDate(schedule.selected.dateOfDeparture), "MMMM dd")}
            </Body>
            <Body size="sm" color={theme.colors.text}>
              {locationOfArrival.data.city}, {locationOfArrival.data.state.code}
            </Body>
          </Box>
        </Box>
      </Box>
      <FlatList
        data={flights.data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.content}
        ListEmptyComponent={renderEmptyList}
        ItemSeparatorComponent={renderItemSeparator}
      />
    </SafeAreaView>
  );
}
