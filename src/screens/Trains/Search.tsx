import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Box } from "@exploriana/components/Box";
import { PrimaryButton } from "@exploriana/components/Button";
import { RecentBookingCard } from "@exploriana/components/Card";
import { Divider } from "@exploriana/components/Divider";
import { Train } from "@exploriana/components/Icons";
import { ArrivalDepartureInput, TextField } from "@exploriana/components/Input";
import { PageHeader } from "@exploriana/components/Layout";
import { Body, Heading, Text } from "@exploriana/components/Typography";
import { HelperText } from "@exploriana/components/Form";
import { TripType, TripTypeSwitch } from "@exploriana/components/Switch";

import { theme } from "@exploriana/config";
import { sharedStyles } from "@exploriana/styles/shared";
import { AppStackParamList } from "@exploriana/interface/navigation";

type NavigationProps = NativeStackNavigationProp<AppStackParamList, "Search-Trains">;

const styles = StyleSheet.create({
  subtitle: {
    marginTop: -4,
  },
  input: {
    marginTop: 16,
  },
  button: {
    marginTop: 20,
  },
  divider: {
    marginTop: 36,
    marginBottom: 24,
  },
  dateInput: {
    flex: 1,
  },
});

const CalendarIcon = <Ionicons name="calendar" size={16} color={theme.colors.text} />;

export function SearchTrainScreen() {
  const navigation = useNavigation<NavigationProps>();

  const [trip, setTrip] = React.useState<TripType>("one-way");

  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.background} style="dark" />
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.pvSmall, sharedStyles.ph]}>
        <PageHeader title="Trains" />
        <Box marginTop={28}>
          <Heading>Search Trains</Heading>
          <Body style={sharedStyles.headerDescription}>Search trains across various routes</Body>
        </Box>
        <Box marginTop={20}>
          <ArrivalDepartureInput
            icon={<Train height={20} width={20} />}
            helperText="Enter your arrival and departure locations"
            {...{ departure: { placeholder: "Where From?" }, arrival: { placeholder: "Where To?" } }}
          />
          <Box marginTop={20}>
            <TripTypeSwitch value={trip} onChange={(trip) => setTrip(trip)} />
            <HelperText>Select the type of your journey</HelperText>
          </Box>
          <Box marginTop={20} flexDirection="row">
            <TextField helperText="Date of departure" placeholder="6 Jun 2023" icon={CalendarIcon} style={styles.dateInput} />
            {trip === "return-trip" && <TextField helperText="Date of return" placeholder="Return Date" icon={CalendarIcon} style={[styles.dateInput, { marginLeft: 12 }]} />}
          </Box>
          <PrimaryButton label="Search Trains" style={styles.button} onPress={() => navigation.navigate("Book-Trains")} />
        </Box>
        <Divider style={styles.divider} />
        <Box>
          <Text size={18} fontWeight="bold" color={theme.colors.heading}>
            Recent Searches
          </Text>
          <Box marginTop={16}>
            <RecentBookingCard placeOfDeparture="Kolkata" placeOfArrival="Chennai" dateOfDeparture="Tue, 6 June" />
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
