import * as React from "react";
import { Image, StyleSheet } from "react-native";
import { Box } from "@exploriana/components/Box";
import { theme } from "@exploriana/config/theme";
import { sharedStyles } from "@exploriana/styles/shared";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Body, Caption, Heading } from "@exploriana/components/Typography";
import { Connector, Divider } from "@exploriana/components/Divider";
import { Train } from "@exploriana/components/Icons";
import { PageHeader } from "@exploriana/components/Layout";
import { PrimaryButton } from "@exploriana/components/Button";

const styles = StyleSheet.create({
  brand: {
    height: 32,
    width: 32,
    resizeMode: "contain",
  },
  barcode: {
    width: "100%",
    height: 60,
  },
  name: {
    marginLeft: 8,
  },
});

const TrainIcon = <Train height={20} width={20} fill={theme.colors.text} />;

export function BoardingPassScreen({}) {
  return (
    <SafeAreaView style={[sharedStyles.fullHeight]}>
      <StatusBar backgroundColor={theme.colors.secondary} style="light" />
      <Box flex={1} backgroundColor={theme.colors.secondary} paddingHorizontal={18} paddingTop={20} paddingBottom={24}>
        <PageHeader title="Boarding Pass" color={theme.colors.surface} />
        <Box flex={1} alignItems="stretch" justifyContent="center">
          <Box backgroundColor={theme.colors.surface} borderRadius={theme.shapes.rounded.lg} paddingVertical={24} paddingHorizontal={24}>
            <Box flexDirection="row" alignItems="center" marginBottom={24}>
              <Image source={require("assets/images/IRCTC.png")} style={styles.brand} />
              <Body color={theme.colors.secondary} size="lg" fontWeight="medium" style={styles.name}>
                Acela
              </Body>
            </Box>
            <Divider />
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={24}>
              <Caption>New York, NY</Caption>
              <Caption>Boston, MA</Caption>
            </Box>
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={10}>
              <Heading fontWeight="medium" size="sm" color={theme.colors.secondary}>
                NYC
              </Heading>
              <Connector icon={TrainIcon} />
              <Heading fontWeight="medium" size="sm" color={theme.colors.secondary}>
                BBY
              </Heading>
            </Box>
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={12} marginBottom={24}>
              <Caption>Oct 20, 06:15AM</Caption>
              <Caption>3h 45m</Caption>
              <Caption>Oct 20, 10:03AM</Caption>
            </Box>
            <Divider />
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginTop={32}>
              <Box flex={1}>
                <Caption>Train No</Caption>
                <Body fontWeight="medium" color={theme.colors.secondary}>
                  224MP
                </Body>
              </Box>
              <Box flex={1}>
                <Caption textAlign="center">Seat No</Caption>
                <Body fontWeight="medium" color={theme.colors.secondary} textAlign="center">
                  Seat 3C
                </Body>
              </Box>
              <Box flex={1}>
                <Caption textAlign="right">Train ID</Caption>
                <Body color={theme.colors.secondary} textAlign="right" fontWeight="medium">
                  AO78690
                </Body>
              </Box>
            </Box>
            <Box flexDirection="row" alignItems="center" justifyContent="center" marginTop={32} marginHorizontal={-36}>
              <Box height={20} width={20} borderRadius={20} backgroundColor={theme.colors.secondary} />
              <Divider type="dashed" width={1} style={sharedStyles.fullHeight} />
              <Box height={20} width={20} borderRadius={20} backgroundColor={theme.colors.secondary} />
            </Box>
            <Box alignItems="center" justifyContent="center" paddingTop={24} paddingBottom={12}>
              <Image source={require("assets/images/barcode.png")} style={styles.barcode} />
            </Box>
          </Box>
        </Box>
        <PrimaryButton label="Email Ticket" fullWidth />
      </Box>
    </SafeAreaView>
  );
}
