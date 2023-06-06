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
import { Schedule } from "@exploriana/interface/core";

import { sharedStyles } from "@exploriana/styles/shared";
import { theme } from "@exploriana/config";

const TrainIcon = <Train height={20} width={20} fill={theme.colors.text} />;

export function BookTrainScreen() {
  const [selected, setSelected] = React.useState<number>();

  const details: Schedule | undefined = React.useMemo(() => {
    if (!selected) return undefined;
    return undefined;
  }, [selected]);

  const isModalOpen = Boolean(details);

  function closeModal() {
    setSelected(undefined);
  }

  function onSelect(id: number) {
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
      <ScrollView contentContainerStyle={[sharedStyles.fullGrow, sharedStyles.ph, sharedStyles.pv]}>
        <TransportCard onPress={onSelect(1)} data={details} cover={require("assets/images/IRCTC.png")} icon={TrainIcon} />
      </ScrollView>
      <BookTransportModal visible={isModalOpen} onRequestClose={closeModal} data={details} cover={require("assets/images/IRCTC.png")} icon={TrainIcon} />
    </SafeAreaView>
  );
}
