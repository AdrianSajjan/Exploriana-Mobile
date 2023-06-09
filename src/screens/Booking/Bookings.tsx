import { Box } from "@exploriana/components/Box";
import { PageHeader } from "@exploriana/components/Layout";
import { theme } from "@exploriana/config";
import { sharedStyles } from "@exploriana/styles/shared";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export function BookingsScreen() {
  return (
    <SafeAreaView style={[sharedStyles.fullHeight]}>
      <StatusBar backgroundColor={theme.colors.secondary} style="light" />
      <Box backgroundColor={theme.colors.secondary} paddingTop={12} paddingHorizontal={20} paddingBottom={16}>
        <PageHeader title="Your Orders" color={theme.colors.surface} />
      </Box>
    </SafeAreaView>
  );
}
