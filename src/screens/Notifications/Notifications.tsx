import { Box } from "@exploriana/components/Box";
import { PageHeader } from "@exploriana/components/Layout";
import { Body } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config/theme";
import { sharedStyles } from "@exploriana/styles/shared";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export function NotificationScreen() {
  return (
    <SafeAreaView style={sharedStyles.fullHeight}>
      <StatusBar backgroundColor={theme.colors.secondary} />
      <Box backgroundColor={theme.colors.secondary} paddingTop={12} paddingHorizontal={20} paddingBottom={16}>
        <PageHeader title="Notifications" color={theme.colors.surface} />
      </Box>
      <Box flex={1} alignItems="center" justifyContent="center">
        <Body color={theme.colors.error}>No notifications are present</Body>
      </Box>
    </SafeAreaView>
  );
}
