import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@exploriana/components/Box";
import { TransportCard } from "@exploriana/components/Card";
import { Connector } from "@exploriana/components/Divider";
import { Train } from "@exploriana/components/Icons";
import { PageHeader } from "@exploriana/components/Layout";
import { BookTransportModal } from "@exploriana/components/Modal";
import { Body, Heading } from "@exploriana/components/Typography";
import { Transport } from "@exploriana/interface/core";

import { useFetchLocationFromAddressQuery } from "@exploriana/api/location";
import { theme } from "@exploriana/config";
import { useScheduleStore } from "@exploriana/store/schedule";
import { sharedStyles } from "@exploriana/styles/shared";
import { useFetchTrainsByRouteQuery } from "@exploriana/api/trains";

const TrainIcon = <Train height={20} width={20} fill={theme.colors.text} />;

export function BookTrainScreen() {
  const [selected, setSelected] = React.useState<string>();

  const schedule = useScheduleStore();

  const locationOfDeparture = useFetchLocationFromAddressQuery(schedule.details?.placeOfDeparture);
  const locationOfArrival = useFetchLocationFromAddressQuery(schedule.details?.placeOfArrival);

  const trains = useFetchTrainsByRouteQuery(locationOfDeparture.data.city, locationOfArrival.data.city);

  console.log(JSON.stringify(trains.data, null, 2));

  const details: Transport | undefined = React.useMemo(() => {
    if (!selected) return undefined;
    return trains.data.find((train) => train.id === selected);
  }, [selected]);

  const isModalOpen = Boolean(details);

  function closeModal() {
    setSelected(undefined);
  }

  function onSelect(id: string) {
    return () => {
      setSelected(id);
    };
  }

  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.secondary} style="light" />
      <Box backgroundColor={theme.colors.secondary} paddingTop={12} paddingHorizontal={20} paddingBottom={0}>
        <PageHeader title="Book Trains" color={theme.colors.surface} />
        <Box marginTop={24}>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Body color={theme.colors.tint}>
              {locationOfDeparture.data.city}, {locationOfDeparture.data.state.code}
            </Body>
            <Body color={theme.colors.tint}>
              {locationOfArrival.data.city}, {locationOfArrival.data.state.code}
            </Body>
          </Box>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={4}>
            <Heading size="sm" fontWeight="medium" color={theme.colors.surface}>
              {locationOfDeparture.data.city}
            </Heading>
            <Connector icon={<Train height={20} width={20} fill={theme.colors.text} />} />
            <Heading size="sm" fontWeight="medium" color={theme.colors.surface}>
              {locationOfArrival.data.city}
            </Heading>
          </Box>
        </Box>
        <Box marginTop={20}></Box>
      </Box>
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.ph, sharedStyles.pv]}>
        {trains.data.map((train) => (
          <TransportCard key={train.id} onPress={onSelect(train.id)} data={train} cover={require("assets/images/IRCTC.png")} icon={TrainIcon} />
        ))}
      </ScrollView>
      <BookTransportModal visible={isModalOpen} onRequestClose={closeModal} data={details} cover={require("assets/images/IRCTC.png")} icon={TrainIcon} />
    </SafeAreaView>
  );
}
