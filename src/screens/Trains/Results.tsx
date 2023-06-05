import { Box } from "@exploriana/components/Box";
import { PageHeader } from "@exploriana/components/Layout";
import { Body, Heading } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config";
import { sharedStyles } from "@exploriana/styles/shared";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function SearchTrainResultScreen() {
  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.background} style="dark" />
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.pvSmall, sharedStyles.ph]}>
        <PageHeader title="Trains" />
        <Box marginTop={28}>
          <Heading>Search Result</Heading>
          <Body style={sharedStyles.headerDescription}>Trains available for your route on 24th June</Body>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
