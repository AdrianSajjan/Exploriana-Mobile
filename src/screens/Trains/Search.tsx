import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Octicons } from "@expo/vector-icons";

import { Box } from "@exploriana/components/Box";
import { IconButton, PrimaryButton } from "@exploriana/components/Button";
import { Divider } from "@exploriana/components/Divider";
import { Train } from "@exploriana/components/Icons";
import { ArrivalDepartureInput, TextField } from "@exploriana/components/Input";
import { PageHeader } from "@exploriana/components/Layout";
import { Body, Heading } from "@exploriana/components/Typography";
import { RecentBookingCard } from "@exploriana/components/Card";

import { theme } from "@exploriana/config";
import { sharedStyles } from "@exploriana/styles/shared";

const styles = StyleSheet.create({
  input: {
    marginTop: 16,
  },
  button: {
    marginTop: 20,
  },
  divider: {
    marginTop: 32,
    marginBottom: 24,
  },
  dateSwitch: {
    paddingBottom: 20,
    marginHorizontal: 8,
  },
});

export function TrainSearchScreen() {
  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.background} style="dark" />
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.pvSmall, sharedStyles.ph]}>
        <PageHeader title="Book Trains" />
        <Box marginTop={36}>
          <Heading>Book Trains</Heading>
          <Body>Book your trains at competitive price</Body>
        </Box>
        <Box marginTop={18}>
          <ArrivalDepartureInput
            icon={<Train height={20} width={20} />}
            {...{ departure: { placeholder: "Where are you travelling from?" }, arrival: { placeholder: "Where will you be travelling to?" } }}
          />
          <PrimaryButton label="Search Trains" style={styles.button} />
        </Box>
        <Divider style={styles.divider} />
        <Box>
          <Heading size="sm"> Recent Searches</Heading>
          <Box marginTop={16}>
            <RecentBookingCard placeOfDeparture="Kolkata" placeOfArrival="Chennai" dateOfDeparture="Tue, 6 June" />
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
