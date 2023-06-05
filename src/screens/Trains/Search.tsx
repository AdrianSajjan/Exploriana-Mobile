import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Box } from "@exploriana/components/Box";
import { PrimaryButton } from "@exploriana/components/Button";
import { RecentBookingCard } from "@exploriana/components/Card";
import { Divider } from "@exploriana/components/Divider";
import { Train } from "@exploriana/components/Icons";
import { ArrivalDepartureInput } from "@exploriana/components/Input";
import { PageHeader } from "@exploriana/components/Layout";
import { Body, Heading, Text } from "@exploriana/components/Typography";

import { theme } from "@exploriana/config";
import { sharedStyles } from "@exploriana/styles/shared";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
    marginTop: 42,
    marginBottom: 32,
  },
  dateSwitch: {
    paddingBottom: 20,
    marginHorizontal: 8,
  },
});

export function SearchTrainScreen() {
  const navigation = useNavigation<NavigationProps>();

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
          <ArrivalDepartureInput
            style={styles.input}
            helperText="Enter your departure date and arrival date"
            icon={<Ionicons name="calendar" size={16} color={theme.colors.text} />}
            {...{ departure: { placeholder: "Departure Date" }, arrival: { placeholder: "Arrival Date - Optional" } }}
          />
          <PrimaryButton label="Search Trains" style={styles.button} onPress={() => navigation.navigate("Search-Train-Results")} />
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
