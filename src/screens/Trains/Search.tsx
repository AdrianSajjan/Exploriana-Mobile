import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Formik, FormikProps, useFormik } from "formik";
import utils from "lodash/fp";
import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

import { Box } from "@exploriana/components/Box";
import { PrimaryButton } from "@exploriana/components/Button";
import { HelperText } from "@exploriana/components/Form";
import { Train } from "@exploriana/components/Icons";
import { ArrivalDepartureInput, TextField } from "@exploriana/components/Input";
import { PageHeader } from "@exploriana/components/Layout";
import { TripType, TripTypeSwitch } from "@exploriana/components/Switch";
import { Body, Heading } from "@exploriana/components/Typography";

import { useScheduleStore } from "@exploriana/store/schedule";

import { theme } from "@exploriana/config";
import { initializeDate } from "@exploriana/lib/core";
import { sharedStyles } from "@exploriana/styles/shared";

import { SelectCityModal } from "@exploriana/components/Modal";
import { Schedule } from "@exploriana/interface/core";
import { Nullable } from "@exploriana/interface/helper";
import { AppStackParamList } from "@exploriana/interface/navigation";
import { errorText, isInvalid } from "@exploriana/lib/form";
import { DatePicker } from "@exploriana/components/Picker";

interface FormState {
  placeOfDeparture: string;
  placeOfArrival: string;
  dateOfDeparture: string;
  dateOfReturn: Nullable<string>;
  trip: TripType;
}

type NavigationProps = NativeStackNavigationProp<AppStackParamList, "Search-Trains">;
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
  dateInput: {
    flex: 1,
  },
});

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

  const [isArrivalModalVisible, setArrivalModalVisible] = React.useState(false);
  const [isDepartureModalVisible, setDepartureModalVisible] = React.useState(false);

  const { values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue } = useFormik<FormState>({
    initialValues: {
      placeOfDeparture: schedule.details?.placeOfDeparture ?? "",
      placeOfArrival: schedule.details?.placeOfArrival ?? "",
      dateOfDeparture: schedule.details?.dateOfDeparture ?? initializeDate().toISOString(),
      dateOfReturn: schedule.details?.dateOfReturn ?? null,
      trip: schedule.details?.dateOfReturn ? "return-trip" : "one-way",
    },
    validationSchema: ValidationSchema,
    onSubmit: (values: FormState) => {
      const state = utils.omit(["trip"])(values) as Schedule;
      schedule.update(state);
      navigation.navigate("Book-Trains");
    },
  });

  function handleSelectDepartureCity(value: string) {
    setFieldValue("placeOfDeparture", value);
    setDepartureModalVisible(false);
  }

  function handleOpenDepartureModal() {
    setDepartureModalVisible(true);
  }

  function handleCloseDepartureModal() {
    setDepartureModalVisible(false);
  }

  function handleSelectArrivalCity(value: string) {
    setFieldValue("placeOfArrival", value);
    setArrivalModalVisible(false);
  }

  function handleOpenArrivalModal() {
    setArrivalModalVisible(true);
  }

  function handleCloseArrivalModal() {
    setArrivalModalVisible(false);
  }

  function handleSwitchArrivalAndDeparture() {
    const departure = values.placeOfDeparture;
    const arrival = values.placeOfArrival;
    setFieldValue("placeOfArrival", departure);
    setFieldValue("placeOfDeparture", arrival);
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
        <Box marginTop={20}>
          <ArrivalDepartureInput
            icon={<Train height={20} width={20} />}
            onSwitch={handleSwitchArrivalAndDeparture}
            helperText="Enter your arrival and departure locations"
            errorText={errorText(["placeOfDeparture", "placeOfArrival"], { errors, touched })}
            isInvalid={isInvalid(["placeOfDeparture", "placeOfArrival"], { errors, touched })}
            {...{
              departure: { value: values.placeOfDeparture, onPress: handleOpenDepartureModal, placeholder: "Where From?", onBlur: handleBlur("placeOfDeparture") },
              arrival: { value: values.placeOfArrival, onPress: handleOpenArrivalModal, placeholder: "Where To?", onBlur: handleBlur("placeOfArrival") },
            }}
          />
          <Box marginTop={20}>
            <TripTypeSwitch value={values.trip} onChange={handleChange("trip")} />
            <HelperText>Select the type of your journey</HelperText>
          </Box>
          <Box marginTop={20} flexDirection="row">
            <DatePicker
              helperText="Date of departure"
              title="Date of Departure"
              value={values.dateOfDeparture}
              onChange={handleChange("dateOfDeparture")}
              placeholder="Departure Date"
              style={styles.dateInput}
            />
            {values.trip === "return-trip" && (
              <DatePicker
                helperText="Date of return"
                title="Date of Return"
                value={values.dateOfReturn ?? undefined}
                onChange={handleChange("dateOfReturn")}
                placeholder="Return Date"
                style={[styles.dateInput, { marginLeft: 12 }]}
              />
            )}
          </Box>
          <PrimaryButton label="Search Trains" style={styles.button} onPress={() => handleSubmit()} />
        </Box>
      </ScrollView>
      <SelectCityModal onSelect={handleSelectDepartureCity} visible={isDepartureModalVisible} onRequestClose={handleCloseDepartureModal} />
      <SelectCityModal onSelect={handleSelectArrivalCity} visible={isArrivalModalVisible} onRequestClose={handleCloseArrivalModal} />
    </SafeAreaView>
  );
}
