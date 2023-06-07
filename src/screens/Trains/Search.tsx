import * as Yup from "yup";
import utils from "lodash/fp";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Formik, FormikProps } from "formik";
import * as React from "react";
import { ListRenderItem, ScrollView, StyleSheet } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@exploriana/components/Box";
import { PrimaryButton } from "@exploriana/components/Button";
import { RecentBookingCard } from "@exploriana/components/Card";
import { Divider } from "@exploriana/components/Divider";
import { HelperText } from "@exploriana/components/Form";
import { Train } from "@exploriana/components/Icons";
import { ArrivalDepartureInput, SearchBar, TextField } from "@exploriana/components/Input";
import { PageHeader } from "@exploriana/components/Layout";
import { TripType, TripTypeSwitch } from "@exploriana/components/Switch";
import { Body, Heading, Text } from "@exploriana/components/Typography";

import { useScheduleStore } from "@exploriana/store/schedule";
import { useSQLiteDatabase } from "@exploriana/hooks/use-database";

import { theme } from "@exploriana/config";
import { createFactory, initializeDate } from "@exploriana/lib/core";
import { sharedStyles } from "@exploriana/styles/shared";

import { Location, Schedule } from "@exploriana/interface/core";
import { Nullable } from "@exploriana/interface/helper";
import { AppStackParamList } from "@exploriana/interface/navigation";
import { errorText, isInvalid } from "@exploriana/lib/form";

type NavigationProps = NativeStackNavigationProp<AppStackParamList, "Search-Trains">;

type SuggestionSheetProps = { onSelect?: (value: string) => void; onClose?: () => void };

type FormState = { placeOfDeparture: string; placeOfArrival: string; dateOfDeparture: Date; dateOfReturn: Nullable<Date>; trip: TripType; activeSuggestionKey: Nullable<string> };

type FormikRef = FormikProps<FormState>;

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
  sheetDivider: {
    marginTop: 24,
  },
  sheetList: {
    paddingTop: 12,
  },
  dateInput: {
    flex: 1,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
});

const snapPoints = [525];

const CalendarIcon = <Ionicons name="calendar" size={16} color={theme.colors.text} />;

const ValidationSchema = Yup.object().shape({
  placeOfDeparture: Yup.string().required("Place of departure is required"),
  placeOfArrival: Yup.string()
    .required("Place of arrival is required")
    .notOneOf([Yup.ref("placeOfDeparture"), null], "Arrival and departure location cannot be same"),
});

export function SearchTrainScreen() {
  const navigation = useNavigation<NavigationProps>();

  const schedule = useScheduleStore();

  const sheet = React.useRef<BottomSheet>();
  const form = React.useRef<FormikRef>();

  const initialValues: FormState = {
    placeOfDeparture: schedule.details?.placeOfDeparture ?? "",
    placeOfArrival: schedule.details?.placeOfArrival ?? "",
    dateOfDeparture: schedule.details?.dateOfDeparture ?? initializeDate(),
    dateOfReturn: schedule.details?.dateOfReturn ?? null,
    trip: schedule.details?.dateOfReturn ? "return-trip" : "one-way",
    activeSuggestionKey: "",
  };

  function handleSelectSuggestion(value: string) {
    const activeSuggestionKey = form.current.values.activeSuggestionKey;
    if (!activeSuggestionKey) return sheet.current.close();
    form.current.setFieldValue(activeSuggestionKey, value);
    sheet.current.close();
  }

  function handleCloseSuggestion() {
    form.current.setFieldValue("activeSuggestionKey", null);
  }

  function handleSwitchArrivalAndDeparture() {
    const arrival = form.current.values.placeOfArrival;
    const departure = form.current.values.placeOfDeparture;
    form.current.setFieldValue("placeOfArrival", departure);
    form.current.setFieldValue("placeOfDeparture", arrival);
  }

  function handleOpenSuggestion(field: string) {
    return () => {
      form.current.setFieldValue("activeSuggestionKey", field);
      sheet.current.expand();
    };
  }

  function onSubmit(values: FormState) {
    const state = utils.omit(["trip", "activeSuggestionKey"])(values) as Schedule;
    schedule.update(state);
    navigation.navigate("Book-Trains");
  }

  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar style="dark" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.pvSmall, sharedStyles.ph]}>
        <PageHeader title="Trains" />
        <Box marginTop={28}>
          <Heading>Search Trains</Heading>
          <Body style={sharedStyles.headerDescription}>Search trains across various routes</Body>
        </Box>
        <Formik innerRef={form} initialValues={initialValues} validationSchema={ValidationSchema} onSubmit={onSubmit} enableReinitialize>
          {({ values, errors, touched, handleChange, handleSubmit, handleBlur }) => (
            <Box marginTop={20}>
              <ArrivalDepartureInput
                icon={<Train height={20} width={20} />}
                onSwitch={handleSwitchArrivalAndDeparture}
                helperText="Enter your arrival and departure locations"
                errorText={errorText(["placeOfDeparture", "placeOfArrival"], { errors, touched })}
                isInvalid={isInvalid(["placeOfDeparture", "placeOfArrival"], { errors, touched })}
                {...{
                  departure: { value: values.placeOfDeparture, onPress: handleOpenSuggestion("placeOfDeparture"), placeholder: "Where From?", onBlur: handleBlur("placeOfDeparture") },
                  arrival: { value: values.placeOfArrival, onPress: handleOpenSuggestion("placeOfArrival"), placeholder: "Where To?", onBlur: handleBlur("placeOfArrival") },
                }}
              />
              <Box marginTop={20}>
                <TripTypeSwitch value={values.trip} onChange={handleChange("trip")} />
                <HelperText>Select the type of your journey</HelperText>
              </Box>
              <Box marginTop={20} flexDirection="row">
                <TextField helperText="Date of departure" placeholder="Departure Date" icon={CalendarIcon} style={styles.dateInput} />
                {values.trip === "return-trip" && <TextField helperText="Date of return" placeholder="Return Date" icon={CalendarIcon} style={[styles.dateInput, { marginLeft: 12 }]} />}
              </Box>
              <PrimaryButton label="Search Trains" style={styles.button} onPress={() => handleSubmit()} />
            </Box>
          )}
        </Formik>
      </ScrollView>
      <SuggestionBottomSheet ref={sheet} onSelect={handleSelectSuggestion} onClose={handleCloseSuggestion} />
    </SafeAreaView>
  );
}

const SuggestionBottomSheet = React.forwardRef<BottomSheet, SuggestionSheetProps>(({ onSelect, onClose }, ref) => {
  const [query, setQuery] = React.useState("");

  const [database] = useSQLiteDatabase();

  const suggestions = useQuery(
    ["cities", { query }] as const,
    async (context) => {
      const params = context.queryKey[1];
      const sql = await createFactory(Promise<SQLite.SQLTransaction>, (resolve) => database.transaction(resolve));
      const results = await createFactory(Promise<Location[]>, (resolve, reject) =>
        sql.executeSql(
          `SELECT * FROM cities WHERE cities.city LIKE ?;`,
          ["%" + params.query + "%"],
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
      initialData: [],
      enabled: Boolean(database),
      retry: false,
    }
  );

  const renderItem: ListRenderItem<Location> = React.useCallback(({ item }) => {
    return (
      <TouchableOpacity style={[sharedStyles.ph, { paddingVertical: 14 }]} onPress={() => onSelect([item.city, item.state].join(", "))}>
        <Body fontWeight="medium" color={theme.colors.secondary}>
          {item.city}
          <Body size="md">, {[item.district, item.state].join(", ")}</Body>
        </Body>
      </TouchableOpacity>
    );
  }, []);

  function keyExtractor(item: Location) {
    return [item.city, item.district, item.state].join("-");
  }

  return (
    <BottomSheet ref={ref} index={-1} backgroundStyle={theme.shadows.lg} enablePanDownToClose snapPoints={snapPoints} onClose={onClose}>
      <BottomSheetView>
        <Box paddingTop={8}>
          <SearchBar placeholder="Search for cities..." value={query} onChangeText={setQuery} />
        </Box>
        <Divider />
        <FlatList data={suggestions.data} contentContainerStyle={styles.sheetList} keyExtractor={keyExtractor} renderItem={renderItem} />
      </BottomSheetView>
    </BottomSheet>
  );
});
