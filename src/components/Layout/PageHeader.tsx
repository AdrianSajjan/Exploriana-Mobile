import { Box } from "@exploriana/components/Box";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "@exploriana/components/Button";
import { Text } from "@exploriana/components/Typography";
import { theme } from "@exploriana/config";
import { useNavigation } from "@react-navigation/native";

export function PageHeader({ title }: { title: string }) {
  const navigation = useNavigation();

  function handleGoBack() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("Home" as never);
  }

  return (
    <Box flexDirection="row" alignItems="center">
      <Box flex={1}>
        <IconButton onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} />
        </IconButton>
      </Box>
      <Text size={20} color={theme.colors.heading} fontWeight="medium">
        {title}
      </Text>
      <Box flex={1}></Box>
    </Box>
  );
}
