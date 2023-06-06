import * as React from "react";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@exploriana/components/Box";
import { PrimaryButton } from "@exploriana/components/Button";
import { RecentBookingCard } from "@exploriana/components/Card";
import { Divider } from "@exploriana/components/Divider";
import { HelperText } from "@exploriana/components/Form";
import { Train } from "@exploriana/components/Icons";
import { PageHeader } from "@exploriana/components/Layout";
import { ArrivalDepartureInput, TextField } from "@exploriana/components/Input";
import { Body, Heading, Text } from "@exploriana/components/Typography";
import { TripType, TripTypeSwitch } from "@exploriana/components/Switch";

import { useSQLiteDatabase } from "@exploriana/hooks/use-database";

import { theme } from "@exploriana/config";
import { createFactory } from "@exploriana/lib/core";
import { sharedStyles } from "@exploriana/styles/shared";

import { Schedule } from "@exploriana/interface/core";
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
  const [placeOfDeparture, setPlaceOfDeparture] = React.useState("");

  const [database] = useSQLiteDatabase();

  const suggestions = useQuery(
    ["cities", { placeOfDeparture }] as const,
    async (context) => {
      const params = context.queryKey[1];
      const sql = await createFactory(Promise<SQLite.SQLTransaction>, (resolve) => database.transaction(resolve));
      const results = await createFactory(Promise<string[]>, (resolve, reject) =>
        sql.executeSql(
          `SELECT * FROM cities WHERE cities.city LIKE ?;`,
          ["%" + params.placeOfDeparture + "%"],
          (_, result) => {
            resolve(result.rows._array);
          },
          (_, error) => {
            reject(error.message);
            return false;
          }
        )
      );
      return results;
    },
    {
      enabled: Boolean(database) && placeOfDeparture.length >= 3,
      retry: false,
    }
  );

  React.useEffect(() => {
    console.log(JSON.stringify(suggestions.data, null, 4));
  }, [suggestions]);

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
            {...{ departure: { value: placeOfDeparture, placeholder: "Where From?" }, arrival: { placeholder: "Where To?" } }}
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
