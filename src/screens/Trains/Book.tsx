import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { FlatList, ListRenderItem, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@exploriana/components/Box";
import { TransportCard } from "@exploriana/components/Card";
import { Connector } from "@exploriana/components/Divider";
import { Train } from "@exploriana/components/Icons";
import { PageHeader } from "@exploriana/components/Layout";
import { BookTransportModal } from "@exploriana/components/Modal";
import { Body, Caption, Heading } from "@exploriana/components/Typography";
import { Transport } from "@exploriana/interface/core";

import { useFetchLocationFromAddressQuery } from "@exploriana/api/location";
import { theme } from "@exploriana/config";
import { useScheduleStore } from "@exploriana/store/schedule";
import { sharedStyles } from "@exploriana/styles/shared";
import { useFetchTrainsByRouteQuery } from "@exploriana/api/trains";
import { initializeDate } from "@exploriana/lib/core";
import { format } from "date-fns";

const TrainIcon = <Train height={20} width={20} fill={theme.colors.text} />;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
});

export function BookTrainScreen() {
  const [selected, setSelected] = React.useState<string>();

  const schedule = useScheduleStore();

  const locationOfDeparture = useFetchLocationFromAddressQuery(schedule.details?.placeOfDeparture ?? "");
  const locationOfArrival = useFetchLocationFromAddressQuery(schedule.details?.placeOfArrival ?? "");

  const trains = useFetchTrainsByRouteQuery(locationOfDeparture.data.city, locationOfArrival.data.city);

  const details: Transport | undefined = React.useMemo(() => {
    if (!selected) return undefined;
    return trains.data.find((train) => train.id === selected);
  }, [selected]);

  const renderItem: ListRenderItem<Transport> = React.useCallback(
    ({ item }) => <TransportCard onPress={onSelect(item.id)} data={item} cover={require("assets/images/IRCTC.png")} icon={TrainIcon} />,
    []
  );

  const renderItemSeparator = React.useCallback(() => {
    return <Box height={20} />;
  }, []);

  const renderEmptyList = React.useCallback(() => {
    if (!schedule.details) return null;
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <Body color={theme.colors.error} size="md" lineHeight={24} textAlign="center">
          No trains found on {format(initializeDate(schedule.details.dateOfDeparture), "do MMMM")} for {locationOfDeparture.data.city} - {locationOfArrival.data.city} route. Please select a different
          date or route.
        </Body>
      </Box>
    );
  }, [schedule.details]);

  function closeModal() {
    setSelected(undefined);
  }

  function onSelect(id: string) {
    return () => {
      setSelected(id);
    };
  }

  function keyExtractor(item: Transport) {
    return item.id;
  }

  const isModalOpen = Boolean(details);

  if (!schedule.details) return null;

  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.secondary} style="light" />
      <Box backgroundColor={theme.colors.secondary} paddingTop={12} paddingHorizontal={20} paddingBottom={16}>
        <PageHeader title="Book Trains" color={theme.colors.surface} />
        <Box marginTop={20}>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={4}>
            <Heading size="sm" fontWeight="medium" color={theme.colors.surface}>
              {locationOfDeparture.data.station.code}
            </Heading>
            <Connector icon={<Train height={20} width={20} fill={theme.colors.text} />} />
            <Heading size="sm" textAlign="right" fontWeight="medium" color={theme.colors.surface}>
              {locationOfArrival.data.station.code}
            </Heading>
          </Box>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={4}>
            <Body size="sm" color={theme.colors.text}>
              {locationOfDeparture.data.city}, {locationOfDeparture.data.state.code}
            </Body>
            <Body size="sm" color={theme.colors.text}>
              {format(initializeDate(schedule.details.dateOfDeparture), "MMMM dd")}
            </Body>
            <Body size="sm" color={theme.colors.text}>
              {locationOfArrival.data.city}, {locationOfArrival.data.state.code}
            </Body>
          </Box>
        </Box>
      </Box>
      <FlatList
        data={trains.data}
        ItemSeparatorComponent={renderItemSeparator}
        ListEmptyComponent={renderEmptyList}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.content}
        renderItem={renderItem}
      />
      <BookTransportModal visible={isModalOpen} onRequestClose={closeModal} data={details} cover={require("assets/images/IRCTC.png")} icon={TrainIcon} />
    </SafeAreaView>
  );
}
