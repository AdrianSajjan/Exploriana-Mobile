import { Box } from "@exploriana/components/Box";
import { TransportCard } from "@exploriana/components/Card";
import { Connector } from "@exploriana/components/Divider";
import { Train } from "@exploriana/components/Icons";
import { PageHeader } from "@exploriana/components/Layout";
import { Body, Heading } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config";
import { sharedStyles } from "@exploriana/styles/shared";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TrainIcon = <Train height={20} width={20} fill={theme.colors.text} />;

export function SearchTrainResultScreen() {
  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.secondary} style="light" />
      <Box backgroundColor={theme.colors.secondary} paddingTop={12} paddingHorizontal={20} paddingBottom={0}>
        <PageHeader title="Search Results" color={theme.colors.surface} />
        <Box marginTop={24}>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Body color={theme.colors.tint}>Howrah, WB</Body>
            <Body color={theme.colors.tint}>Chennai, TN</Body>
          </Box>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={4}>
            <Heading size="sm" fontWeight="medium" color={theme.colors.surface}>
              HWH
            </Heading>
            <Connector icon={<Train height={20} width={20} fill={theme.colors.text} />} />
            <Heading size="sm" fontWeight="medium" color={theme.colors.surface}>
              MSB
            </Heading>
          </Box>
        </Box>
        <Box marginTop={20}></Box>
      </Box>
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.ph, { paddingVertical: 24 }]}>
        <TransportCard
          price={4500}
          timeOfArrival="13:40"
          placeOfArrival="Chennai"
          placeOfDeparture="Howrah"
          timeOfDeparture="09:50"
          name="Rajdhani Express"
          cover={require("assets/images/IRCTC.png")}
          icon={TrainIcon}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
